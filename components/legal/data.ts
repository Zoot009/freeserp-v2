// Legal page content for /privacy and /terms.
// Copy ported verbatim from the original freeserp-ui legal pages — restyled, not rewritten.

export type LegalListItem = { lead?: string; text: string };

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: LegalListItem[] }
  | { type: "contact"; email: string; address?: string };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDoc = {
  slug: "privacy" | "terms";
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  sections: LegalSection[];
};

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  eyebrow: "Legal",
  title: "Privacy Policy",
  updated: "April 9, 2026",
  intro:
    "How FreeSERP collects, uses, and protects the personal information you share when you use the service.",
  metaTitle: "Privacy Policy | FreeSERP",
  metaDescription:
    "Learn how FreeSERP collects, uses, and protects your personal information.",
  sections: [
    {
      heading: "Introduction",
      blocks: [
        {
          type: "p",
          text: `FreeSERP ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.`,
        },
      ],
    },
    {
      heading: "Information We Collect",
      blocks: [
        { type: "p", text: "We collect the following types of information:" },
        {
          type: "list",
          items: [
            { lead: "Account Information:", text: "Email address, name, and password when you register" },
            { lead: "Usage Data:", text: "Keywords tracked, domains monitored, and search ranking data" },
            { lead: "Technical Data:", text: "IP address, browser type, device information, and cookies" },
            { lead: "Communication Data:", text: "Messages you send us through contact forms or support" },
          ],
        },
      ],
    },
    {
      heading: "How We Use Your Information",
      blocks: [
        { type: "p", text: "We use your data to:" },
        {
          type: "list",
          items: [
            { text: "Provide and maintain our SERP tracking service" },
            { text: "Send you ranking updates and notifications" },
            { text: "Improve our service and develop new features" },
            { text: "Communicate with you about updates and support" },
            { text: "Prevent fraud and ensure platform security" },
            { text: "Comply with legal obligations" },
          ],
        },
      ],
    },
    {
      heading: "Data Sharing and Disclosure",
      blocks: [
        { type: "p", text: "We do not sell your personal data. We may share your information with:" },
        {
          type: "list",
          items: [
            { lead: "Service Providers:", text: "Third-party vendors who help us operate our service" },
            { lead: "Legal Requirements:", text: "When required by law or to protect our rights" },
            { lead: "Business Transfers:", text: "In case of merger, acquisition, or asset sale" },
          ],
        },
      ],
    },
    {
      heading: "Cookies and Tracking",
      blocks: [
        {
          type: "p",
          text: "We use cookies and similar tracking technologies to improve your experience. You can control cookie preferences through your browser settings. Essential cookies are necessary for the service to function.",
        },
      ],
    },
    {
      heading: "Data Security",
      blocks: [
        {
          type: "p",
          text: "We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.",
        },
      ],
    },
    {
      heading: "Your Rights",
      blocks: [
        { type: "p", text: "You have the right to:" },
        {
          type: "list",
          items: [
            { text: "Access your personal data" },
            { text: "Correct inaccurate data" },
            { text: "Request deletion of your data" },
            { text: "Object to data processing" },
            { text: "Data portability" },
            { text: "Withdraw consent at any time" },
          ],
        },
      ],
    },
    {
      heading: "Data Retention",
      blocks: [
        {
          type: "p",
          text: "We retain your personal data only as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and data at any time.",
        },
      ],
    },
    {
      heading: "Children's Privacy",
      blocks: [
        {
          type: "p",
          text: "Our service is not intended for children under 16. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us.",
        },
      ],
    },
    {
      heading: "Changes to This Policy",
      blocks: [
        {
          type: "p",
          text: "We may update this privacy policy from time to time. We will notify you of significant changes via email or through our service. Continued use after changes constitutes acceptance.",
        },
      ],
    },
    {
      heading: "Contact Us",
      blocks: [
        {
          type: "p",
          text: "If you have questions about this privacy policy or our data practices, please contact us at:",
        },
        { type: "contact", email: "support@freeserp.com" },
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: "terms",
  eyebrow: "Legal",
  title: "Terms of Service",
  updated: "April 9, 2026",
  intro:
    "The terms and conditions that govern your access to and use of the FreeSERP service.",
  metaTitle: "Terms of Service | FreeSERP",
  metaDescription: "Read the terms and conditions for using FreeSERP services.",
  sections: [
    {
      heading: "Agreement to Terms",
      blocks: [
        {
          type: "p",
          text: `By accessing or using FreeSERP ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.`,
        },
      ],
    },
    {
      heading: "Description of Service",
      blocks: [
        {
          type: "p",
          text: "FreeSERP provides search engine ranking position (SERP) tracking and keyword research tools. The Service allows you to monitor your website's ranking on search engines and analyze keyword performance.",
        },
      ],
    },
    {
      heading: "User Accounts",
      blocks: [
        {
          type: "p",
          text: "To use certain features, you must register for an account. You agree to:",
        },
        {
          type: "list",
          items: [
            { text: "Provide accurate, current, and complete information" },
            { text: "Maintain and update your account information" },
            { text: "Keep your password secure and confidential" },
            { text: "Accept responsibility for all activities under your account" },
            { text: "Notify us immediately of any unauthorized use" },
          ],
        },
      ],
    },
    {
      heading: "Acceptable Use",
      blocks: [
        { type: "p", text: "You agree NOT to:" },
        {
          type: "list",
          items: [
            { text: "Violate any applicable laws or regulations" },
            { text: "Infringe on intellectual property rights" },
            { text: "Transmit malicious code or viruses" },
            { text: "Attempt to gain unauthorized access to our systems" },
            { text: "Use automated tools to scrape or harvest data excessively" },
            { text: "Resell or redistribute the Service without permission" },
            { text: "Interfere with other users' access to the Service" },
          ],
        },
      ],
    },
    {
      heading: "Free Plan Limitations",
      blocks: [
        {
          type: "p",
          text: "The free plan includes limitations on the number of keywords, projects, and check frequency. We reserve the right to modify these limitations at any time with reasonable notice.",
        },
      ],
    },
    {
      heading: "Intellectual Property",
      blocks: [
        {
          type: "p",
          text: "The Service and its original content, features, and functionality are owned by FreeSERP and are protected by international copyright, trademark, and other intellectual property laws.",
        },
      ],
    },
    {
      heading: "Data Accuracy",
      blocks: [
        {
          type: "p",
          text: "While we strive to provide accurate ranking data, we do not guarantee 100% accuracy. Search engine results can vary by location, personalization, and other factors. Use the data at your own discretion.",
        },
      ],
    },
    {
      heading: "Termination",
      blocks: [
        {
          type: "p",
          text: "We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.",
        },
      ],
    },
    {
      heading: "Disclaimers",
      blocks: [
        {
          type: "p",
          text: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.`,
        },
      ],
    },
    {
      heading: "Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: "IN NO EVENT SHALL FREESERP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.",
        },
      ],
    },
    {
      heading: "Indemnification",
      blocks: [
        {
          type: "p",
          text: "You agree to indemnify and hold FreeSERP harmless from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.",
        },
      ],
    },
    {
      heading: "Changes to Terms",
      blocks: [
        {
          type: "p",
          text: "We reserve the right to modify these Terms at any time. We will notify users of significant changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.",
        },
      ],
    },
    {
      heading: "Governing Law",
      blocks: [
        {
          type: "p",
          text: "These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.",
        },
      ],
    },
    {
      heading: "Contact Information",
      blocks: [
        { type: "p", text: "If you have questions about these Terms, please contact us at:" },
        { type: "contact", email: "support@freeserp.com" },
      ],
    },
  ],
};
