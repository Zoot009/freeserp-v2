import type { Metadata } from "next";
import { TOOLS, TRACKERS, type Shot } from "@/components/home/tools";
import { SAMPLE_REPORTS, type SampleReportEntry } from "@/components/landing/sample-reports";

/**
 * One dedicated page per tool that previously only lived inside a suite page.
 *
 * Copy, screenshots and prices are pulled from components/home/tools.ts where
 * the tool already has an entry, so the home page and these pages can never
 * quote different numbers. Only the page-specific bits (H1, meta, steps, FAQs)
 * live here, and every claim in them restates something already in tools.ts.
 */

export interface ToolPageData {
  path: string;
  kicker: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  points: string[];
  cost: string;
  shot: Shot;
  steps: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  /** Only where the sample is the report this exact tool produces. */
  report?: SampleReportEntry;
}

const tool = (kicker: string) => TOOLS.find((t) => t.kicker === kicker)!;
const tracker = (kicker: string) => TRACKERS.find((t) => t.kicker === kicker)!;

/** Asked on every tool page — both answers hold for every tool. */
const COMMON_FAQS = [
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes 100 credits every month, refilled automatically, with no credit card. Paid plans start at $19/month for 2,000 credits.",
  },
  {
    q: "Do I need a separate subscription for this tool?",
    a: "No. Every FreeSERP tool draws from the same credit balance. Rank tracking, the SERP checker and site audits run on the free plan's credits; competitor analysis, keyword research, the keyword score checker, internal link analysis, AEO & GEO audits and Google Maps audits need a paid plan or a credit pack.",
  },
];

function page(p: ToolPageData): ToolPageData {
  return { ...p, faqs: [...p.faqs, ...COMMON_FAQS] };
}

const maps = tracker("GOOGLE MAPS TRACKER");
const youtube = tracker("YOUTUBE RANK TRACKER");
const siteAudit = tool("FULL WEBSITE AUDIT");
const pageAudit = tool("PAGE AUDIT");
const links = tool("INTERNAL LINK ANALYSIS");
const keywordMagic = tool("KEYWORD MAGIC TOOL");
const keywordScore = tool("KEYWORD SCORE CHECKER");
const allKeywords = tool("ALL KEYWORDS");

export const TOOL_PAGES = {
  "google-maps-rank-tracker": page({
    path: "/google-maps-rank-tracker",
    kicker: "GOOGLE MAPS RANK TRACKER",
    h1: "Google Maps Rank Tracker",
    metaTitle: "Google Maps Rank Tracker — geo-grid local rankings | FreeSERP",
    metaDescription:
      "See your Google Maps and Local Pack rank across your service area on a 3×3 to 21×21 geo-grid, with ARP, ATRP, SoLV and the competitors beating you.",
    intro: maps.text,
    points: [
      ...maps.points,
      "Up to 10 keywords in a single scan",
      "A competitor leaderboard — every business found in the grid, scored on the same metrics as you",
      "Re-scan the same grid and compare it with earlier scans, point by point",
    ],
    cost: "35 credits for a 3×3 grid · up to 1,475 for 21×21",
    shot: maps.shot,
    report: SAMPLE_REPORTS.mapsTracker,
    steps: [
      { title: "Set the pin and radius", text: "Choose your business, where the grid is centred and how far across town it reaches." },
      { title: "Pick keywords and a grid size", text: "Up to 10 search terms per scan, on anything from a 3×3 grid up to 21×21." },
      { title: "Read the rank at every point", text: "Each grid point gets a rank pin. Open one to see which businesses rank there instead of you, then re-scan later to see what moved." },
    ],
    faqs: [
      {
        q: "What does a Google Maps rank tracker do?",
        a: "It checks where your business appears in Google Maps and the Local Pack for a search term. Because local results depend on where the searcher is standing, FreeSERP runs the same search from every point on a grid around you, so you see your rank across the whole service area instead of at one address.",
      },
      {
        q: "What do ARP, ATRP and SoLV mean?",
        a: "ARP is your average rank across the grid points where you were found. ATRP is the average across every point, with points where you were not found counted as rank 21. SoLV, share of local voice, is the percentage of grid points where you rank in the top 3 — the local pack.",
      },
      {
        q: "How does Google decide which businesses show in the Map Pack?",
        a: "Three things weigh most: relevance (how well your profile and category match the search), distance (how close you are to the searcher or the place named in the query) and prominence (how well known and well reviewed you are). Distance is why your rank changes from one street to the next — and why a grid shows more than a single rank check.",
      },
      {
        q: "Can I see which competitors outrank me?",
        a: "Yes. Open any grid point for the businesses ranking there, or open the competitor leaderboard: every business that appeared anywhere in the grid, with its own ARP, ATRP and SoLV, so you can see who owns which part of town.",
      },
      {
        q: "Can I track my local rankings over time?",
        a: "Yes. Re-scan the same location with the same grid size and radius, and FreeSERP lines the new scan up against the earlier ones so you can see which points improved and which slipped.",
      },
      {
        q: "How do I improve my Google Maps ranking?",
        a: "Start with a complete, verified Google Business Profile with the right primary category, consistent name, address and phone details across the web, a steady flow of reviews you reply to, and a website page that matches the area you serve. The Google Maps Audit runs 25 checks on a listing's profile, reviews, photos, website and visibility, and turns the gaps into a 30-day action plan.",
      },
      {
        q: "Do I need access to the Business Profile to scan it?",
        a: "No. The scan reads the same public Maps results a searcher sees, so you can run it on your own listing or a client's without logging in to the Business Profile.",
      },
      {
        q: "How much does a grid scan cost?",
        a: "It depends on the grid size: a 3×3 grid costs 35 credits, 11×11 costs 415 and 21×21 costs 1,475.",
      },
    ],
  }),

  "youtube-rank-tracker": page({
    path: "/youtube-rank-tracker",
    kicker: "YOUTUBE RANK TRACKER",
    h1: "YouTube Rank Tracker",
    metaTitle: "YouTube Rank Tracker — check your video rankings | FreeSERP",
    metaDescription:
      "Track where your videos rank in YouTube search for every keyword, by country and language. See position history and the videos ranking around yours.",
    intro: youtube.text,
    points: [
      ...youtube.points,
      "Search 20, 40 or 60 results deep for each keyword",
      "Every check stored, so each keyword builds its own position history",
      "The full results page behind every check — the competing videos, channels and shelves included",
    ],
    cost: "5 credits a keyword check",
    shot: youtube.shot,
    report: SAMPLE_REPORTS.youtube,
    steps: [
      { title: "Add a video or a channel", text: "Track one video, or point FreeSERP at a whole channel." },
      { title: "Add your keywords", text: "Set the country and language for each keyword you want to rank for." },
      { title: "Watch the positions", text: "Position, absolute rank and the result block it appeared in, with titles, thumbnails and view counts resolved for you — and a history that grows with every check." },
    ],
    faqs: [
      {
        q: "How do I check where my video ranks on YouTube?",
        a: "Add the video (or its channel) and the keywords you care about. FreeSERP runs each search on YouTube for the country and language you set, finds your video in the results and records its position, so you are not scrolling through results by hand or seeing them skewed by your own watch history.",
      },
      {
        q: "What is the difference between position and absolute rank?",
        a: "A YouTube results page mixes regular videos with Shorts shelves, playlists, channel cards and ads. Position counts regular videos only — the number most people mean by \"my ranking\". Absolute rank counts every item on the page, so it shows how far down a viewer actually has to scroll.",
      },
      {
        q: "Can I track a whole channel, not just one video?",
        a: "Yes. You can track a single video or an entire channel against your keyword set — handy when several of your videos compete for the same term.",
      },
      {
        q: "Can I see the competing videos for a keyword?",
        a: "Yes. Every check keeps the results page it came from, so you can see which videos and channels sit above and below yours and how their titles and view counts compare.",
      },
      {
        q: "Can I track rankings in a specific country or language?",
        a: "Yes. Each keyword carries its own country and language, so the same term can be tracked separately in different markets. Rankings are checked at country level rather than by city.",
      },
      {
        q: "Does it track video results in Google search too?",
        a: "This tracker measures YouTube's own search. Google rankings — including whether a video block appears for a keyword — are covered by the Google rank tracker in the same account.",
      },
      {
        q: "What affects how a video ranks on YouTube?",
        a: "Relevance comes first: a title, description, tags and spoken content that match what people search. Then how viewers respond — watch time, audience retention, likes, comments and subscribers gained — plus the overall quality of the video and channel. Specific, longer search phrases are usually easier to win than one-word topics.",
      },
      {
        q: "How do I find keywords for a YouTube video?",
        a: "Start typing your topic into YouTube's search box and note the suggestions — they come from real searches. Favour specific, question-style phrases, check what already ranks for them, then add the ones you can realistically win to the tracker and watch how your video moves.",
      },
      {
        q: "Can I track Google and YouTube for the same brand?",
        a: "Yes. YouTube projects sit alongside your Google projects in the same account and spend the same credit balance.",
      },
    ],
  }),

  "site-audit": page({
    path: "/site-audit",
    kicker: "WEBSITE SEO AUDIT",
    h1: "Website SEO Audit",
    metaTitle: "Website SEO Audit — crawl up to 1,000 pages | FreeSERP",
    metaDescription:
      "Crawl up to 1,000 pages and find the technical and on-page SEO issues across your whole site — indexing, HTTPS, titles, speed and mobile — ranked by severity.",
    intro: siteAudit.text,
    points: [
      ...siteAudit.points,
      "Crawlability checks: robots.txt, XML sitemap, canonical tags and noindex",
      "Security checks: HTTPS and a valid SSL certificate",
      "On-page checks on every page: titles, meta descriptions, headings, image alt text and word count",
      "Mobile and speed: viewport, tap targets, font size, load time and page weight",
    ],
    cost: siteAudit.cost,
    shot: siteAudit.shot!,
    report: SAMPLE_REPORTS.audit,
    steps: [
      { title: "Enter your domain", text: "Point FreeSERP at the site you want audited." },
      { title: "Let it crawl", text: "Up to 1,000 pages in a single crawl, every one checked against the same rules." },
      { title: "Work through the report", text: "Findings grouped by issue or page by page, ranked Critical, High, Medium and Low — then share, export or re-crawl to confirm the fixes." },
    ],
    faqs: [
      {
        q: "What does a website SEO audit check?",
        a: "Everything that stops search engines finding, reading and trusting your pages: crawlability (robots.txt, sitemap, canonical and noindex tags), security (HTTPS), on-page elements on every URL, performance, mobile usability, links, structured data and social tags. Each finding lists the pages it affects.",
      },
      {
        q: "Which issues should I fix first?",
        a: "Start with Critical findings, and with anything that keeps pages out of the index — a robots.txt block, a stray noindex, a wrong canonical. Next, fix issues that repeat across many pages, since one template change often clears hundreds of URLs. Lower-severity notices can wait for a routine pass.",
      },
      {
        q: "Does it check robots.txt and my XML sitemap?",
        a: "Yes. The audit reads your robots.txt, flags pages its rules block, and looks for an XML sitemap — the two files that tell search engines what they may crawl and what you want indexed.",
      },
      {
        q: "Does it find thin content?",
        a: "Every page's word count is checked, so thin pages stand out. To spot content that is decaying — pages losing clicks over time — connect Search Console and compare date ranges in its Pages table.",
      },
      {
        q: "Does the audit cover internal links and click depth?",
        a: "The Links grade looks at each page's balance of internal and external links. For the whole link graph — click depth from the homepage, hub pages and orphan pages — run Internal Link Analysis on the same domain.",
      },
      {
        q: "How is a site audit different from a page audit?",
        a: "A site audit crawls the whole domain and shows which problems are widespread. A page audit scores one URL in depth and explains every check — use it on the pages that matter most once the site-wide issues are fixed.",
      },
      {
        q: "How often should I audit my site?",
        a: "After any launch, redesign or migration, and on a regular schedule — monthly for sites that publish often, quarterly for quieter ones. Re-crawl whenever you like to confirm fixes have landed.",
      },
      {
        q: "How many pages can one audit crawl?",
        a: "Up to 1,000 pages in a single crawl.",
      },
      {
        q: "How much does a website audit cost?",
        a: "5 credits per page crawled, so a 100-page crawl costs 500 credits.",
      },
      {
        q: "Can I share the report?",
        a: "Yes. Share the report as a link, or export it to PDF or CSV.",
      },
    ],
  }),

  "page-audit": page({
    path: "/page-audit",
    kicker: "ON-PAGE SEO AUDIT",
    h1: "On-Page SEO Audit",
    metaTitle: "On-Page SEO Audit — 63 checks on any URL | FreeSERP",
    metaDescription:
      "Audit one URL against 63 on-page SEO checks — title, meta, headings, alt text, schema, speed and mobile — each failure explained, with what to fix first.",
    intro: pageAudit.text,
    points: [
      ...pageAudit.points,
      "On-page essentials: title tag, meta description, H1, heading order, image alt text and keyword consistency",
      "Technical basics: HTTPS, canonical, noindex, hreflang and a search-friendly URL",
      "Mobile and speed: viewport, tap targets, font size and PageSpeed for mobile and desktop",
      "Structured data and social tags: schema, Open Graph and Twitter cards",
    ],
    cost: pageAudit.cost,
    shot: pageAudit.shot!,
    report: SAMPLE_REPORTS.audit,
    steps: [
      { title: "Paste a URL", text: "The one page you actually care about — a landing page, a product page, a post you want to rank." },
      { title: "63 checks run", text: "Graded across six categories, under one overall score." },
      { title: "Fix, or ask", text: "Every failed check says what it found and why it matters — and you can ask the finished audit what to fix first." },
    ],
    faqs: [
      {
        q: "What does an on-page SEO audit check?",
        a: "Everything on a single page that affects how it ranks and gets clicked: the title tag, meta description and URL that make up its search snippet, the H1 and heading structure, keyword use across title, headings and copy, image alt text, word count, canonical and indexing tags, structured data, mobile usability and page speed.",
      },
      {
        q: "How long should a title tag and meta description be?",
        a: "The audit looks for a title of 40–60 characters and a meta description of 70–160 — long enough to say what the page is about, short enough not to be cut off in results. Put the main keyword early and write each one for the person deciding whether to click.",
      },
      {
        q: "Does it check structured data?",
        a: "Yes. It looks for identity schema (Organization or Person) and, for local businesses, LocalBusiness schema, along with the Open Graph and Twitter card tags that control how the page looks when shared.",
      },
      {
        q: "Can AI crawlers read my page?",
        a: "The audit measures how much of your content is in the page's initial HTML rather than added later by JavaScript. Many AI crawlers read only that first HTML, so content they cannot see cannot be quoted.",
      },
      {
        q: "What is the difference between Page Audit and Site Audit?",
        a: "Page Audit scores one URL in depth against 63 checks and explains each one. Site Audit crawls up to 1,000 pages and reports which issues repeat across the whole site. Run the site audit to find patterns, and the page audit on the pages that earn money.",
      },
      {
        q: "Can I ask questions about the results?",
        a: "Yes. Once the audit is done, the Audit Assistant answers follow-up questions such as what to fix first.",
      },
    ],
  }),

  "internal-link-analysis": page({
    path: "/internal-link-analysis",
    kicker: "INTERNAL LINK ANALYSIS",
    h1: "Internal Link Analysis",
    metaTitle: "Internal Link Analysis — find orphan pages | FreeSERP",
    metaDescription:
      "Map your internal links: hub pages, click depth from the homepage, inbound links per page, where link equity pools and the orphan pages nothing links to.",
    intro: links.text,
    points: [
      ...links.points,
      "Inbound and outbound link counts for every page, so thinly linked pages stand out",
      "Hub and authority pages identified, and your most-linked pages ranked",
      "Pages listed in your sitemap that no link reaches, flagged as orphans",
    ],
    cost: links.cost,
    shot: links.shot!,
    report: SAMPLE_REPORTS.linkGraph,
    steps: [
      { title: "Enter your domain", text: "FreeSERP crawls it and follows every internal link." },
      { title: "See the graph", text: "Your pages drawn as a node graph, with hubs and authority pages visible at a glance." },
      { title: "Fix what is stranded", text: "Orphan pages are named, and depth from the homepage shows what sits too far down — link to them from relevant, well-linked pages." },
    ],
    faqs: [
      {
        q: "What are internal links?",
        a: "Links from one page of your site to another. Structural links — menus, footers, breadcrumbs, sidebars — appear on every page. Contextual links sit inside the content and tie related pages together. Both help search engines discover pages and understand which ones matter most.",
      },
      {
        q: "What is an orphan page?",
        a: "A page that no other page on your site links to. Search engines and visitors struggle to reach it, so FreeSERP names every one it finds — including pages listed in your sitemap that no link points to.",
      },
      {
        q: "Why does click depth matter?",
        a: "Pages buried many clicks from the homepage tend to be crawled less often and receive less link equity. A common rule of thumb is to keep important pages within about three clicks. The analysis shows each page's depth so you can bring them closer.",
      },
      {
        q: "What is link equity, and how do hub pages help?",
        a: "Link equity is the ranking value that flows through links. Pages with many inbound links collect it, and pass it on through their own links. A hub — or pillar — page that links out to every article in its topic cluster, with each article linking back, keeps that value circulating where you want it.",
      },
      {
        q: "How many internal links should a page have?",
        a: "There is no magic number. Each important page should be linked from several relevant pages, not just one — a page with a single inbound link is easy to orphan by accident. The per-page inbound counts show which pages are thinly supported.",
      },
      {
        q: "What anchor text should internal links use?",
        a: "Short, descriptive text that tells readers and search engines what the target page is about. Avoid vague phrases like \"click here\", and vary the wording naturally rather than repeating the same exact keyword on every link.",
      },
      {
        q: "What other internal link problems should I look for?",
        a: "Links that point to redirected URLs or form redirect chains and loops, links to pages that return errors, plain HTTP links on an HTTPS site, and nofollow attributes on internal links. Each one wastes crawl time or link equity — point every link straight at the final, live HTTPS address.",
      },
    ],
  }),

  "keyword-research": page({
    path: "/keyword-research",
    kicker: "KEYWORD RESEARCH TOOL",
    h1: "Keyword Research Tool",
    metaTitle: "Keyword Research Tool — volume, difficulty, intent | FreeSERP",
    metaDescription:
      "Turn one seed keyword into hundreds of real ones with search volume, keyword difficulty, CPC and intent — filtered, grouped into topics and ready to track.",
    intro: keywordMagic.text,
    // Not keywordMagic.points: the tool has Broad and Related only (keyword-magic routes), no Phrase/Exact.
    points: [
      "Volume, difficulty, CPC and search intent on every keyword",
      "Broad match and Related keyword results, for the country you choose",
      "Word groups that carve a long list into topics",
      "Filter by minimum volume, maximum difficulty or intent",
      "Export to CSV, or send keywords straight to the rank tracker",
    ],
    cost: keywordMagic.cost,
    shot: keywordMagic.shot!,
    report: SAMPLE_REPORTS.keywordResearch,
    steps: [
      { title: "Enter a seed keyword", text: "One word or phrase that describes your topic, and the country you are targeting." },
      { title: "Pick a match type", text: "Broad match or Related keywords, then filter by volume, difficulty and intent." },
      { title: "Plan from the groups", text: "Word groups carve the list into topics, so a content plan falls out of it." },
    ],
    faqs: [
      {
        q: "What is keyword research?",
        a: "Finding the words and phrases people type into search engines about your topic, then judging which are worth targeting. Good research tells you what to write, which page should answer each search, and where you can realistically compete.",
      },
      {
        q: "How do I do keyword research?",
        a: "Start with a seed keyword, expand it into a long list, then judge each keyword on volume, difficulty, intent and relevance to your business. Group what is left into topics and give each topic one page to own.",
      },
      {
        q: "How do I read volume, difficulty, CPC and intent?",
        a: "Volume is the average monthly searches. Difficulty estimates how hard it is to reach the first page, shown as easy, medium or hard. CPC is what advertisers pay per click — a good sign of commercial value. Intent says what the searcher wants: to learn (informational), to reach a specific site (navigational), to compare (commercial) or to buy (transactional).",
      },
      {
        q: "How do I find long-tail keywords?",
        a: "Look for phrases of three or more words and for questions — how, what, best, near me. They have less volume each but clearer intent and less competition, which makes them the quickest wins for a newer site. Filter the list by text or a difficulty ceiling to surface them.",
      },
      {
        q: "How many keywords should I target per page?",
        a: "One main keyword per page, plus the close variants and questions that share its intent. If two pages chase the same keyword they compete with each other — word groups make that overlap easy to spot before you write.",
      },
      {
        q: "Where do the search volumes come from?",
        a: "From a keyword database — not a language model's guess. Volumes are monthly averages, so treat them as a guide to relative demand; Search Console shows the impressions your own pages actually get.",
      },
      {
        q: "Is the keyword research tool free?",
        a: "Every account can run Broad match searches on its monthly credits. Related keywords and the full page of results come with a paid plan.",
      },
      {
        q: "How much does a search cost?",
        a: "35 credits for 100 keywords, or 190 credits for the full page of results.",
      },
    ],
  }),

  "keyword-score-checker": page({
    path: "/keyword-score-checker",
    kicker: "KEYWORD SCORE CHECKER",
    h1: "Keyword Score Checker",
    metaTitle: "Keyword Score Checker — is your page ready to rank? | FreeSERP",
    metaDescription:
      "Check how well a page is built to rank for a keyword: one grade over on-page SEO, Domain and Page Authority, backlinks and real Core Web Vitals.",
    intro: keywordScore.text,
    points: [
      ...keywordScore.points,
      "On-page checks for your keyword: URL, title, meta description, headings, content, image alt text and schema",
      "A letter grade from A+ to F, with every sub-score behind it",
    ],
    cost: keywordScore.cost,
    shot: keywordScore.shot!,
    report: SAMPLE_REPORTS.keywordScore,
    steps: [
      { title: "Enter a URL and a keyword", text: "Your page, and the term you want it to rank for." },
      { title: "FreeSERP checks it", text: "A live crawl of the page, a PageSpeed run and an authority lookup." },
      { title: "Read the grade", text: "One score over on-page and off-page together, with the numbers behind it — re-run it after you change the page." },
    ],
    faqs: [
      {
        q: "What does the Keyword Score Checker look at?",
        a: "On-page, how well the URL, title, meta description, headings, content, image alt text, schema and internal links target your keyword. Off-page, the site's Domain Authority, the page's Page Authority and the backlinks behind both. Real page speed — TTFB, FCP, LCP and CLS — is measured too.",
      },
      {
        q: "Is this the same as keyword difficulty?",
        a: "No. Keyword difficulty estimates how hard a keyword is for anyone to rank for, judged from the pages already on page one. The Keyword Score grades your page for that keyword. Use difficulty — shown in the Keyword Research tool — to choose a keyword, and the score to check the page you built for it.",
      },
      {
        q: "What is a good keyword score?",
        a: "90 and above is A+ (excellent), 80 is A, 70 is B, 60 is C and 50 is D; below 50 is F. Off-page authority carries the larger share of the score, so a new site can have a well-optimised page and still score modestly — look at the on-page and off-page halves separately.",
      },
      {
        q: "What makes a keyword hard to rank for?",
        a: "Mostly the strength of the pages already ranking: how many different sites link to them and how authoritative their domains are. Results pages crowded with ads, maps, videos or answer boxes push organic links down, and high-volume, high-CPC terms attract the most competition.",
      },
      {
        q: "How do I find keywords my page can rank for?",
        a: "Go longer and more specific: long-tail phrases and questions usually face weaker pages. Filter keyword research by a difficulty ceiling, then compare your own authority with the pages already ranking before you commit.",
      },
      {
        q: "Why do different tools give different scores?",
        a: "Each tool uses its own link data, its own authority metric and its own formula, so scores are not comparable across tools. Compare scores within one tool, and watch how a page's score moves as you improve it.",
      },
      {
        q: "Who should use it?",
        a: "Writers checking a draft before it goes live, SEOs reviewing a page that is stuck on page two, and agencies that need a quick, explainable grade for a client page.",
      },
      {
        q: "How is it different from Competitor Analysis?",
        a: "Keyword Score looks only at your page and your keyword. Competitor Analysis puts your page beside the real top 10 for a tracked keyword.",
      },
    ],
  }),

  "search-console": page({
    path: "/search-console",
    kicker: "GOOGLE SEARCH CONSOLE",
    h1: "Search Console, beside your rankings",
    metaTitle: "Google Search Console data beside your rankings | FreeSERP",
    metaDescription:
      "Connect Google Search Console and see clicks, impressions, CTR and average position by query, page, country and device beside your tracked rankings. Free.",
    intro:
      "Link a Search Console property to any project and clicks, impressions and CTR sit beside the tracked position they belong to — so you can tell which rankings actually earn traffic.",
    points: [
      "Total clicks, impressions, CTR and average position",
      "A clicks trend over time, compared with the previous period",
      "Queries, pages, countries, devices and search appearance, each in its own table",
      "Drill from a page into its queries, or from a query into its pages",
      "Send queries straight to the rank tracker, or export any table to CSV",
      "Connecting it and reading it cost nothing",
    ],
    cost: "Free",
    shot: {
      src: "/shots/search-console.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Search Console view: total clicks, impressions, CTR and average position, a clicks trend, and the per-query table",
    },
    report: SAMPLE_REPORTS.searchConsole,
    steps: [
      { title: "Create a project", text: "One project per domain you track." },
      { title: "Link a Search Console property", text: "Connect the property that matches the project's domain." },
      { title: "See which rankings earn clicks", text: "Clicks, impressions and CTR sit beside the position you are tracking — over 7, 28 or 90 days, or a custom range." },
    ],
    faqs: [
      {
        q: "What is Google Search Console?",
        a: "A free service from Google that reports how your site performs in Google Search: the queries that show your pages, the clicks and impressions they earn, and whether your pages are indexed and healthy. FreeSERP reads its performance data and puts it beside your tracked rankings.",
      },
      {
        q: "What do clicks, impressions, CTR and average position mean?",
        a: "An impression is one appearance of your page in a search result; a click is someone choosing it. CTR is clicks divided by impressions. Average position is where your page appeared on average across all those impressions.",
      },
      {
        q: "Why is Search Console's position different from my tracked rank?",
        a: "Search Console averages your position over every search, location and device that showed your page. A rank tracker checks one location and device at a time. Read them together: the tracked rank shows where you stand, Search Console shows what that is worth in clicks.",
      },
      {
        q: "How do I find striking-distance keywords?",
        a: "Sort the Queries table by position and look for queries just outside the top results — roughly positions 4 to 15 — with plenty of impressions. A small improvement there earns the most extra clicks. Send the best ones to the rank tracker and watch them move.",
      },
      {
        q: "Does FreeSERP show indexing, sitemap or Core Web Vitals reports?",
        a: "It shows Search Console's performance data — clicks, impressions, CTR and position. Index coverage, sitemap status and Core Web Vitals stay in Search Console itself; FreeSERP's Site Audit checks robots.txt, sitemaps and page speed from its own crawl.",
      },
      {
        q: "What do I need to connect it?",
        a: "A Google account with access to a verified Search Console property — a domain property or a URL-prefix property — covering the project's domain.",
      },
      {
        q: "Does connecting Search Console cost credits?",
        a: "No. Connecting Search Console and reading its data cost nothing.",
      },
      {
        q: "Why connect it if I already track rankings?",
        a: "A ranking tells you where you appear. Search Console tells you whether that position earns clicks — together they show which rankings are worth defending.",
      },
    ],
  }),

  "all-keywords": page({
    path: "/all-keywords",
    kicker: "ALL KEYWORDS",
    h1: "Every tracked keyword, in one table",
    metaTitle: "All Keywords — all your rankings in one table | FreeSERP",
    metaDescription:
      "Every tracked keyword across every project in one table: position, movement, search volume, estimated traffic, ranking URL and SERP features. Export to CSV.",
    intro: allKeywords.text,
    points: [
      ...allKeywords.points,
      "Position, movement, search volume, estimated traffic, ranking URL and SERP features per keyword",
      "Star the keywords that matter and export the whole table to CSV",
    ],
    cost: allKeywords.cost,
    shot: allKeywords.shot!,
    report: SAMPLE_REPORTS.allKeywords,
    steps: [
      { title: "Track keywords in your projects", text: "Each domain gets its own project, targeting and history." },
      { title: "Open All Keywords", text: "Every project's keywords in one table, not one tab each." },
      { title: "Filter, star, export", text: "Narrow by project, device or search engine, star what matters, and export to CSV." },
    ],
    faqs: [
      {
        q: "What are keywords in SEO?",
        a: "The words and phrases people type into a search engine. Each one stands for a need — a question, a comparison, a purchase — and the pages that answer that need best are the ones that rank. Tracking a keyword means checking where your page appears for it.",
      },
      {
        q: "What is the difference between short-tail and long-tail keywords?",
        a: "Short-tail keywords are one or two broad words with big volume and fierce competition. Long-tail keywords are longer, more specific phrases: fewer searches each, but clearer intent and easier rankings. Most sites get much of their traffic from the long tail combined.",
      },
      {
        q: "What is search intent?",
        a: "The reason behind a search. Informational searches want an answer, navigational ones want a specific site, commercial ones are comparing options and transactional ones are ready to buy. A page ranks best when it matches the intent of its keyword.",
      },
      {
        q: "Should I track branded and non-branded keywords?",
        a: "Yes, both. Branded keywords include your company or product name and show how well you hold your own name. Non-branded keywords are how new customers find you, and that is usually where the growth is.",
      },
      {
        q: "What does the table show for each keyword?",
        a: "Its position and movement, search volume, estimated traffic, the URL that ranks and the SERP features around it — for every project, in one place.",
      },
      {
        q: "Do keywords still matter for AI search?",
        a: "Yes, but as topics more than exact phrases. AI answers break one question into several related searches, so pages that cover a topic thoroughly get cited more often. FreeSERP's AI Visibility Tracker shows whether ChatGPT, Gemini, Perplexity and Claude mention you.",
      },
      {
        q: "Does adding keywords cost credits?",
        a: "No. Adding a keyword is free — the rank check it schedules carries the charge.",
      },
      {
        q: "Can I export the table?",
        a: "Yes. The whole table exports to CSV.",
      },
    ],
  }),
} satisfies Record<string, ToolPageData>;

export type ToolSlug = keyof typeof TOOL_PAGES;

export function toolMetadata(slug: ToolSlug): Metadata {
  const p = TOOL_PAGES[slug];
  const url = `https://freeserp.com${p.path}`;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title: p.metaTitle, description: p.metaDescription, url, siteName: "FreeSERP", type: "website" },
    twitter: { card: "summary_large_image", title: p.metaTitle, description: p.metaDescription },
  };
}
