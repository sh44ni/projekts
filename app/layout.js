import { Inter, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ContactProviderWrapper from "./components/ContactProviderWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Projekts — Custom Web Development, App & AI Solutions | Pakistan & Oman",
  description:
    "Projekts builds high-performance web platforms, mobile apps, and AI-powered systems for businesses in Pakistan, Oman, the US, and Switzerland. From booking systems to enterprise dashboards — built to scale.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`} suppressHydrationWarning>
      <head>
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
      </head>
      <body>
        <ContactProviderWrapper>
          {children}
        </ContactProviderWrapper>
      </body>
    </html>
  );
}
