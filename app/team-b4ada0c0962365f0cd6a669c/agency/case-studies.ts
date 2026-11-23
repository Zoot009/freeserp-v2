// Client case studies, served at
//   /team-b4ada0c0962365f0cd6a669c/agency/<agency>/casestudy/<client>
// New client = new entry under its agency's `clients`. Empty optional sections are hidden.
// Images go in public/case-studies/<client>/ and are referenced as "/case-studies/<client>/x.png".

export interface CaseStudy {
  name: string
  address: string
  website: string
  /** Before/after screenshot pairs (e.g. Google Maps ranking, GBP profile). */
  beforeAfter?: { before: string; after: string; caption?: string }[]
  /** Local growth report (FreeSERP share link or a PDF in public/). */
  growthReportUrl?: string
  /** Before/after local rank reports (localrankreports.com) and the Maps rank each one shows. */
  rankReports?: { before: { url: string; rank?: number }; after: { url: string; rank?: number } }
  citations: string[]
  /** Shown blurred behind the login wall, by name only. */
  hiddenSites: string[]
  /** "+ N of our websites" count, also behind the login wall. */
  ownSites?: number
  reviews?: {
    before: { rating: number; count: number }
    after: { rating: number; count: number }
  }
  /** Where the QR code points (ideally the Google review link). Defaults to a Google Maps search. */
  qrUrl?: string
}

export const AGENCIES: Record<string, { name: string; clients: Record<string, CaseStudy> }> = {
  zoot: {
    name: "Zoot",
    clients: {
      "ci-siamo": {
        name: "Ci Siamo",
        address: "440 W 33rd St Ste 100, New York, NY 10001, United States",
        website: "https://www.cisiamo.com/",
        growthReportUrl: "https://app.freeserp.com/share/report/7867b14d-e9bf-4483-ac6a-514447b1f7c7",
        rankReports: {
          before: { url: "https://localrankreports.com/reports/cmwt9kvqs000208js3y3705l7", rank: 19 },
          after: { url: "https://localrankreports.com/reports/cmwt9m0nm000308js48u7xqgc", rank: 2 },
        },
        citations: [
          "https://www.tripadvisor.in/Restaurant_Review-g60763-d23417627-Reviews-Ci_Siamo-New_York_City_New_York.html",
          "https://www.yelp.com/biz/ci-siamo-new-york-5",
          // Not about this restaurant (Italian news piece on Serbia) — re-add only if intended.
          // "https://www.huffingtonpost.it/esteri/2026/11/22/news/dimitrije_dimic_i_miei_54_giorni_di_calvario_da_sovversivo_ma_ci_siamo_ripresi_la_serbia-23308910/",
          "https://www.opentable.com/r/ci-siamo-new-york",
          "https://www.thefork.com/restaurant/ci-siamo-r828528",
        ],
        hiddenSites: ["Trustpilot", "Foursquare", "Local Yahoo", "BatchGeo", "Zeemaps"],
        ownSites: 25,
      },
    },
  },
}
