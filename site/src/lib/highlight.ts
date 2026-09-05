/** Shared syntax palette for the playground snippet and example code blocks. */
export const CODE_COLORS = {
  keyword: "text-blue-700 dark:text-blue-400",
  component: "text-orange-800 dark:text-cf-orange",
  attr: "text-kumo-subtle",
  comment: "text-kumo-subtle",
  string: "text-teal-700 dark:text-teal-650",
  plain: "text-kumo-strong"
};

export interface CodeToken {
  text: string;
  color?: string;
}

// Just enough grammar for the snippets on this site: comments, strings,
// a few keywords, JSX/HTML tag names, and attribute/object-key names.
const TOKEN_PATTERN = new RegExp(
  [
    String.raw`(\/\/.*|<!--.*?-->)`,
    String.raw`("[^"]*")`,
    String.raw`(\b(?:import|from|const|false|true)\b)`,
    String.raw`(<\/?[A-Za-z][\w.-]*)`,
    String.raw`([A-Za-z_]\w*(?=[=:]))`
  ].join("|"),
  "g"
);

export function tokenizeLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let last = 0;

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    if (match.index > last) tokens.push({ text: line.slice(last, match.index) });
    const [comment, string, keyword, tag, attr] = match.slice(1);

    if (comment) tokens.push({ text: comment, color: CODE_COLORS.comment });
    else if (string) tokens.push({ text: string, color: CODE_COLORS.string });
    else if (keyword) tokens.push({ text: keyword, color: CODE_COLORS.keyword });
    else if (tag) {
      const bracket = tag.startsWith("</") ? "</" : "<";
      tokens.push({ text: bracket });
      tokens.push({ text: tag.slice(bracket.length), color: CODE_COLORS.component });
    } else if (attr) tokens.push({ text: attr, color: CODE_COLORS.attr });

    last = match.index + match[0].length;
  }

  if (last < line.length) tokens.push({ text: line.slice(last) });
  return tokens;
}
