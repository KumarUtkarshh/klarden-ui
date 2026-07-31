import { ThemeProvider } from "@/components/theme-provider";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Animated React Components for Design Engineers`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.authorUrl }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Animated React Components for Design Engineers`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Premium Animated React UI Components`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Animated React Components`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultOgImage],
    creator: SITE_CONFIG.twitter,
    site: SITE_CONFIG.twitter,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = SITE_CONFIG.url;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: SITE_CONFIG.name,
        url: baseUrl,
        description: SITE_CONFIG.description,
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/docs/{search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: SITE_CONFIG.name,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.svg`,
        },
        sameAs: [SITE_CONFIG.github],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#software`,
        name: SITE_CONFIG.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: baseUrl,
        description: SITE_CONFIG.description,
        codeRepository: SITE_CONFIG.github,
        programmingLanguage: ["TypeScript", "React", "Next.js"],
        license: "https://opensource.org/licenses/MIT",
        author: { "@type": "Person", name: SITE_CONFIG.author, url: SITE_CONFIG.authorUrl },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#component-list`,
        name: "Klarden UI Component Library",
        description: "All animated React components available in Klarden UI",
        url: baseUrl,
        numberOfItems: 26,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accordion", url: `${baseUrl}/docs/components/accordion` },
          { "@type": "ListItem", position: 2, name: "Basic Number Ticker", url: `${baseUrl}/docs/components/basic-number-ticker` },
          { "@type": "ListItem", position: 3, name: "Blur Reveal", url: `${baseUrl}/docs/components/blur-reveal` },
          { "@type": "ListItem", position: 4, name: "Box Carousel", url: `${baseUrl}/docs/components/box-carousel` },
          { "@type": "ListItem", position: 5, name: "Command Orbit", url: `${baseUrl}/docs/components/command-orbit` },
          { "@type": "ListItem", position: 6, name: "Image Trail", url: `${baseUrl}/docs/components/image-trail` },
          { "@type": "ListItem", position: 7, name: "Label Input", url: `${baseUrl}/docs/components/label-input` },
          { "@type": "ListItem", position: 8, name: "Logo Carousel", url: `${baseUrl}/docs/components/logo-carousel` },
          { "@type": "ListItem", position: 9, name: "Mac Terminal", url: `${baseUrl}/docs/components/mac-terminal` },
          { "@type": "ListItem", position: 10, name: "Magnetic Dock", url: `${baseUrl}/docs/components/magnetic-dock` },
          { "@type": "ListItem", position: 11, name: "Orbit Context Menu", url: `${baseUrl}/docs/components/orbit-context-menu` },
          { "@type": "ListItem", position: 12, name: "Page Not Found", url: `${baseUrl}/docs/components/page-not-found` },
          { "@type": "ListItem", position: 13, name: "Pagination", url: `${baseUrl}/docs/components/pagination` },
          { "@type": "ListItem", position: 14, name: "Portal Uploader", url: `${baseUrl}/docs/components/portal-uploader` },
          { "@type": "ListItem", position: 15, name: "QR Code", url: `${baseUrl}/docs/components/qr-code` },
          { "@type": "ListItem", position: 16, name: "Rich Button", url: `${baseUrl}/docs/components/rich-button` },
          { "@type": "ListItem", position: 17, name: "Shimmer Text", url: `${baseUrl}/docs/components/shimmer-text` },
          { "@type": "ListItem", position: 18, name: "Signature", url: `${baseUrl}/docs/components/signature` },
          { "@type": "ListItem", position: 19, name: "Slider", url: `${baseUrl}/docs/components/slider` },
          { "@type": "ListItem", position: 20, name: "Spotify Card", url: `${baseUrl}/docs/components/spotify-card` },
          { "@type": "ListItem", position: 21, name: "Tactile Highlight", url: `${baseUrl}/docs/components/tactile-highlight` },
          { "@type": "ListItem", position: 22, name: "Animated Gradient", url: `${baseUrl}/docs/backgrounds/animated-gradient` },
          { "@type": "ListItem", position: 23, name: "Ghost Ether", url: `${baseUrl}/docs/backgrounds/ghost-ether` },
          { "@type": "ListItem", position: 24, name: "Plasma Wave", url: `${baseUrl}/docs/backgrounds/plasma-wave` },
          { "@type": "ListItem", position: 25, name: "RNA Lines", url: `${baseUrl}/docs/backgrounds/rna-lines` },
          { "@type": "ListItem", position: 26, name: "Starry Sky", url: `${baseUrl}/docs/backgrounds/starry-sky` },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
