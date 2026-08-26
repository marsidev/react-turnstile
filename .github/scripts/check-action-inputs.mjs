// Fails when a workflow passes a `with:` key that the pinned action version
// does not declare.
//
// GitHub only warns about unknown inputs ("Unexpected input(s) ..."), so the
// step keeps running with its defaults. That is how the changesets/action
// v1 -> v2 bump silently dropped `version` and `publish`: the release job would
// have gone green while doing nothing. A red check on the PR is the only place
// this is cheap to catch.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const WORKFLOWS = ".github/workflows";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

/** action.yml (or action.yaml) for `owner/repo@ref`, or null for a local action. */
const cache = new Map();
async function actionInputs(uses) {
  if (cache.has(uses)) return cache.get(uses);

  const [path, ref] = uses.split("@");
  const [owner, repo, ...subdir] = path.split("/");
  const prefix = subdir.length > 0 ? `${subdir.join("/")}/` : "";

  let manifest;
  for (const name of ["action.yml", "action.yaml"]) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${prefix}${name}`;
    const res = await fetch(url, token ? { headers: { authorization: `Bearer ${token}` } } : {});
    if (res.ok) {
      manifest = parse(await res.text());
      break;
    }
    if (res.status !== 404) throw new Error(`${url} -> HTTP ${res.status}`);
  }
  if (!manifest) throw new Error(`no action manifest found for ${uses}`);

  const inputs = new Set(Object.keys(manifest.inputs ?? {}));
  cache.set(uses, inputs);
  return inputs;
}

const problems = [];

for (const file of readdirSync(WORKFLOWS).filter(f => /\.ya?ml$/.test(f))) {
  const workflow = parse(readFileSync(join(WORKFLOWS, file), "utf8"));

  for (const [jobName, job] of Object.entries(workflow.jobs ?? {})) {
    for (const step of job.steps ?? []) {
      // Local actions and docker:// references have no manifest to fetch.
      if (!step.uses || step.uses.startsWith(".") || step.uses.startsWith("docker://")) continue;
      if (!step.with) continue;

      const declared = await actionInputs(step.uses);
      const unknown = Object.keys(step.with).filter(key => !declared.has(key));

      if (unknown.length > 0) {
        problems.push({ file, jobName, uses: step.uses, unknown });
      }
    }
  }
}

if (problems.length > 0) {
  for (const { file, jobName, uses, unknown } of problems) {
    const list = unknown.join(", ");
    console.error(`::error file=${WORKFLOWS}/${file}::${jobName}: ${uses} does not accept ${list}`);
  }
  process.exit(1);
}

console.log(
  `Every workflow input is declared by its pinned action (${cache.size} actions checked).`
);
