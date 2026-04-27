import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata = {
  title: "App Development Services — Projekts | iOS, Android & Cross-Platform",
  description:
    "Projekts delivers native and cross-platform mobile apps with seamless UX. React Native, Swift, Flutter — from concept to App Store launch.",
  openGraph: {
    title: "App Development Services — Projekts",
    description: "Mobile apps that users love, built for iOS and Android.",
  },
};

const DATA = {
  title: "App Development",
  subtitle:
    "Native and cross-platform mobile applications with pixel-perfect interfaces, seamless UX, and the performance your users demand.",
  description: {
    heading: "Apps that users actually keep on their home screen.",
    paragraphs: [
      "The average user deletes an app within 3 days. We build the ones they keep. Our mobile development process is obsessively user-centered — every interaction, animation, and flow is designed to feel instant and intuitive.",
      "We specialize in both cross-platform efficiency (React Native, Flutter) and native power (Swift, Kotlin) depending on your performance requirements. From MVP launches to enterprise-grade apps with millions of users, our architecture scales with your ambition.",
    ],
  },
  features: {
    heading: "From first tap to five-star reviews.",
    items: [
      { title: "Cross-Platform Apps", desc: "Single codebase for iOS and Android with React Native or Flutter — 60% faster development, zero compromise on quality." },
      { title: "Native iOS & Android", desc: "Swift and Kotlin apps for performance-critical use cases — AR, real-time processing, and hardware-level integrations." },
      { title: "UI/UX Design", desc: "Platform-specific design systems following Apple HIG and Material Design 3 guidelines for native-feeling experiences." },
      { title: "Offline-First Architecture", desc: "Local data persistence, background sync, and conflict resolution so your app works everywhere — even without signal." },
      { title: "Push Notifications", desc: "Segmented, scheduled, and behavior-triggered notifications with deep linking and rich media support." },
      { title: "App Store Optimization", desc: "ASO strategy, screenshot design, A/B testing, and review management to maximize organic downloads." },
    ],
  },
  process: {
    heading: "Concept to App Store in 10-16 weeks.",
    steps: [
      { title: "Product Strategy", desc: "Market research, competitor analysis, and feature prioritization to define your MVP scope and monetization model." },
      { title: "UX & Prototyping", desc: "Wireframes, user flows, and interactive prototypes tested with real users before any code is written." },
      { title: "Iterative Development", desc: "Bi-weekly TestFlight/Beta builds so you can test on real devices and provide feedback throughout development." },
      { title: "QA & Beta Testing", desc: "Device matrix testing, performance profiling, crash analytics, and a private beta launch to gather early feedback." },
      { title: "Launch & Growth", desc: "App Store submission, launch marketing support, analytics setup, and an iterative roadmap for post-launch features." },
    ],
  },
  techStack: {
    heading: "The right tool for every platform.",
    items: ["React Native", "Flutter", "Swift", "Kotlin", "Expo", "Firebase", "Supabase", "RevenueCat", "OneSignal", "Fastlane", "TestFlight", "CodePush", "Sentry", "Mixpanel", "App Store Connect", "Google Play Console"],
  },
  faqs: [
    { q: "Should I build native or cross-platform?", a: "Cross-platform (React Native/Flutter) covers 90% of use cases at 60% of the cost. We recommend native only for AR, complex animations, or hardware-specific needs." },
    { q: "How much does a mobile app cost?", a: "MVP apps typically start at $20,000-$40,000. Complex apps with backend infrastructure range from $50,000-$120,000. We'll scope it precisely during discovery." },
    { q: "Do you handle backend development too?", a: "Yes. We build the complete stack — API, database, authentication, push notifications, admin panels, and cloud infrastructure." },
    { q: "Can you update my existing app?", a: "Absolutely. We take over existing codebases, fix performance issues, add features, and modernize outdated architectures." },
    { q: "How do you handle app updates after launch?", a: "We offer maintenance retainers that include bug fixes, OS compatibility updates, feature additions, and performance monitoring." },
    { q: "Do you submit to the App Store and Google Play?", a: "Yes — we handle the entire submission process including metadata, screenshots, privacy policies, and review responses." },
  ],
  ctaText: "Ready to Launch Your",
};

export default function AppDevelopmentPage() {
  return <ServicePageLayout {...DATA} />;
}
