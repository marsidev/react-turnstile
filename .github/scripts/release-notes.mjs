// Creates one GitHub Release per package published by the release job, using
// that package's CHANGELOG.md entry as the body.
//
// The changelog is the single source for release notes: changesets writes it
// from the changeset files, and @changesets/changelog-github already adds the
// PR link, the commit link and the contributor credit.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { GH_TOKEN, REPO, PUBLISHED_PACKAGES } = process.env;

if (!GH_TOKEN) throw new Error("GH_TOKEN is required");
if (!REPO) throw new Error("REPO is required");

const published = JSON.parse(PUBLISHED_PACKAGES || "[]");
if (published.length === 0) {
  console.log("No published packages, nothing to release.");
  process.exit(0);
}

/** Map every workspace package name to its directory. */
function findPackages(dir, out = new Map(), depth = 0) {
  if (depth > 3) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== "node_modules" && !entry.name.startsWith(".")) {
      findPackages(join(dir, entry.name), out, depth + 1);
    }
  }
  try {
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    if (pkg.name) out.set(pkg.name, dir);
  } catch {}
  return out;
}

const dirs = findPackages(process.cwd());

/**
 * Pull the `## <version>` section out of a changelog, stopping at the next
 * heading of the same level.
 */
function changelogEntry(changelog, version) {
  const lines = changelog.split("\n");
  const start = lines.findIndex(l => l.trim() === `## ${version}`);
  if (start === -1) return undefined;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(l => l.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
}

/** Whether a release already exists for this tag. */
function exists(tag) {
  try {
    execFileSync("gh", ["release", "view", tag, "--repo", REPO, "--json", "tagName"], {
      stdio: "pipe",
      env: { ...process.env, GH_TOKEN }
    });
    return true;
  } catch {
    return false;
  }
}

const tmp = mkdtempSync(join(tmpdir(), "release-notes-"));

for (const { name, version } of published) {
  const tag = `${name}@${version}`;
  const dir = dirs.get(name);
  if (!dir) throw new Error(`${name} is not a workspace package`);

  const entry = changelogEntry(readFileSync(join(dir, "CHANGELOG.md"), "utf8"), version);
  if (!entry) throw new Error(`no changelog entry for ${tag}`);

  // Link back to the diff against the previous tag for this package, the way
  // the previous notes did. Only added when a previous tag exists.
  let body = entry;
  const previous = execFileSync("git", ["tag", "--list", `${name}@*`, "--sort=-v:refname"], {
    encoding: "utf8"
  })
    .split("\n")
    .map(t => t.trim())
    .filter(t => t && t !== tag)[0];

  if (previous) {
    const compare = `https://github.com/${REPO}/compare/${previous}...${tag}`;
    body += `\n\n##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](${compare})`;
  }

  const notes = join(tmp, `${version}.md`);
  writeFileSync(notes, body);

  // Re-running the job must converge rather than fail on a release that is
  // already there, so update an existing one instead of creating it twice.
  const prerelease = version.includes("-");
  const args = exists(tag)
    ? ["release", "edit", tag, `--prerelease=${prerelease}`]
    : ["release", "create", tag, "--verify-tag", ...(prerelease ? ["--prerelease"] : [])];

  console.log(`${args[1] === "edit" ? "Updating" : "Creating"} release ${tag}`);
  execFileSync("gh", [...args, "--repo", REPO, "--title", tag, "--notes-file", notes], {
    stdio: "inherit",
    env: { ...process.env, GH_TOKEN }
  });
}
