export type Location = { code: string; name: string }

// NOTE: This list is intentionally limited to the markets the backend's SERP
// provider (DataForSEO, via the v2 API) actually supports. It must stay in sync
// with SUPPORTED_LOCATIONS in
// freeserp-backend/src/modules/serp/dataforseo.mapper.ts — picking a country
// that isn't supported makes /api/check return a 400. Codes are ISO-3166
// alpha-2 (note the UK is "gb", not "uk").

export const POPULAR_LOCATIONS: Location[] = [
  { code: "in", name: "India" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "au", name: "Australia" },
  { code: "ca", name: "Canada" },
  { code: "sg", name: "Singapore" },
  { code: "ae", name: "UAE" },
]

export const ALL_LOCATIONS: Location[] = [
  { code: "ar", name: "Argentina" },
  { code: "au", name: "Australia" },
  { code: "at", name: "Austria" },
  { code: "bh", name: "Bahrain" },
  { code: "bd", name: "Bangladesh" },
  { code: "be", name: "Belgium" },
  { code: "br", name: "Brazil" },
  { code: "bg", name: "Bulgaria" },
  { code: "ca", name: "Canada" },
  { code: "cl", name: "Chile" },
  { code: "co", name: "Colombia" },
  { code: "cr", name: "Costa Rica" },
  { code: "hr", name: "Croatia" },
  { code: "cz", name: "Czechia" },
  { code: "dk", name: "Denmark" },
  { code: "do", name: "Dominican Republic" },
  { code: "ec", name: "Ecuador" },
  { code: "eg", name: "Egypt" },
  { code: "fi", name: "Finland" },
  { code: "fr", name: "France" },
  { code: "de", name: "Germany" },
  { code: "gh", name: "Ghana" },
  { code: "gr", name: "Greece" },
  { code: "gt", name: "Guatemala" },
  { code: "hk", name: "Hong Kong" },
  { code: "hu", name: "Hungary" },
  { code: "in", name: "India" },
  { code: "id", name: "Indonesia" },
  { code: "ie", name: "Ireland" },
  { code: "il", name: "Israel" },
  { code: "it", name: "Italy" },
  { code: "jp", name: "Japan" },
  { code: "jo", name: "Jordan" },
  { code: "ke", name: "Kenya" },
  { code: "kw", name: "Kuwait" },
  { code: "my", name: "Malaysia" },
  { code: "mx", name: "Mexico" },
  { code: "ma", name: "Morocco" },
  { code: "nl", name: "Netherlands" },
  { code: "nz", name: "New Zealand" },
  { code: "ng", name: "Nigeria" },
  { code: "no", name: "Norway" },
  { code: "om", name: "Oman" },
  { code: "pk", name: "Pakistan" },
  { code: "pe", name: "Peru" },
  { code: "ph", name: "Philippines" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "qa", name: "Qatar" },
  { code: "ro", name: "Romania" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "sg", name: "Singapore" },
  { code: "sk", name: "Slovakia" },
  { code: "za", name: "South Africa" },
  { code: "kr", name: "South Korea" },
  { code: "es", name: "Spain" },
  { code: "lk", name: "Sri Lanka" },
  { code: "se", name: "Sweden" },
  { code: "ch", name: "Switzerland" },
  { code: "tw", name: "Taiwan" },
  { code: "th", name: "Thailand" },
  { code: "tr", name: "Turkey" },
  { code: "ua", name: "Ukraine" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "uy", name: "Uruguay" },
  { code: "ve", name: "Venezuela" },
  { code: "vn", name: "Vietnam" },
]

export function flagFor(code: string): string {
  if (code === "uk") code = "gb"
  if (code.length !== 2) return ""
  const cp = (c: string) => 0x1f1e6 + (c.toUpperCase().charCodeAt(0) - 65)
  return String.fromCodePoint(cp(code[0]), cp(code[1]))
}

const NAME_BY_CODE = new Map<string, string>(
  [...POPULAR_LOCATIONS, ...ALL_LOCATIONS].map((l) => [l.code, l.name]),
)

/** Human country name for an ISO-3166 alpha-2 code, e.g. "in" → "India". Falls back to the upper-cased code. */
export function countryName(code: string): string {
  return NAME_BY_CODE.get(code.toLowerCase()) ?? code.toUpperCase()
}
