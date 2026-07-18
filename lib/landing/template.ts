// Minimal {token} substitution so landing-page personalization/urgency copy can stay
// generic (a handful of translated template strings) instead of needing a hardcoded
// variant per UTM source or country.
export function renderTemplate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match)
}
