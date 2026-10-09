import JsonLd from "./components/JsonLd";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ContactProviderWrapper from "./components/ContactProviderWrapper";
import ChatWidget from "./components/ChatWidget";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL("https://projektsvision.com"),
  title: {
    default: "Projekts Vision | Custom Software, Web & AI Solutions (USA)",
    template: "%s | Projekts Vision",
  },
  description:
    "Projekts Vision is a full-cycle software development and AI engineering firm serving high-growth companies across the United States. We engineer custom web platforms, mobile apps, and intelligent automation systems built to scale.",
  keywords: [
    "Custom Software Development USA",
    "Web Application Development United States",
    "Enterprise AI Solutions US",
    "Next.js Development Company",
    "Mobile App Development Agency USA",
    "Full Stack Engineering Firm",
    "AI Automation Agency",
    "Cloud Architecture & Scalable Platforms",
  ],
  authors: [{ name: "Projekts Vision", url: "https://projektsvision.com" }],
  creator: "Projekts Vision",
  publisher: "Projekts Vision",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://projektsvision.com",
  },
  openGraph: {
    title: "Projekts Vision | Custom Software, Web & AI Solutions (USA)",
    description:
      "Full-cycle custom software, web platforms, mobile apps, and enterprise AI engineering for high-growth businesses across the United States.",
    url: "https://projektsvision.com",
    siteName: "Projekts Vision",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Projekts Vision - Custom Software, Web & AI Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projekts Vision | Custom Software, Web & AI Solutions (USA)",
    description:
      "Full-cycle custom software, web platforms, mobile apps, and enterprise AI engineering for high-growth businesses across the United States.",
    images: ["/og-image.png"],
  },
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
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-US"
      className={`${plusJakartaSans.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C7FQEBSW3V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C7FQEBSW3V');
          `}
        </Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1015602524410761');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1015602524410761&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <div className="site-bg" aria-hidden="true" />
        <ContactProviderWrapper>{children}</ContactProviderWrapper>
        <ChatWidget />
      </body>
    </html>
  );
}
