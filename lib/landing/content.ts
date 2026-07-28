// w/h are each SVG's intrinsic viewBox size, passed to the <img> so the browser
// can reserve the box (and its aspect) before the file loads — clears the CLS
// "images without explicit width and height" flag. The strip renders them at a
// fixed height with width:auto, so these only supply the aspect ratio; the
// display size is unchanged.
export const brands = [
  { name: "Tata Steel", logo: "/logos/logo-1.svg", w: 739, h: 297 },
  { name: "InCaps", logo: "/logos/logo-2.svg", w: 132, h: 53 },
  { name: "Brand", logo: "/logos/logo-3.svg", w: 132, h: 53 },
  { name: "Sony", logo: "/logos/logo-4.svg", w: 500, h: 90 },
  { name: "Payoneer", logo: "/logos/logo-5.svg", w: 631, h: 123 },
  { name: "HSBC", logo: "/logos/logo-6.svg", w: 316, h: 85 },
  { name: "Delivery", logo: "/logos/logo-7.svg", w: 2694, h: 427 },
  { name: "Yamaha", logo: "/logos/logo-8.svg", w: 2379, h: 670 },
];
