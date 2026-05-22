const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const glitz = await prisma.caseStudy.upsert({
    where: { slug: "glitz-glamour" },
    update: {},
    create: {
      slug: "glitz-glamour",
      published: true,
      sortOrder: 0,
      client: "Glitz & Glamour",
      logo: "/clients/glitzandglamour.svg",
      category: "Booking Platform",
      title: "End-to-end salon booking & loyalty platform with AI agent",
      description:
        "Replaced Instagram DMs and manual calendars with a complete business operating system — AI booking agent, digital loyalty cards, automated notifications, and a full analytics dashboard.",
      coverImage: "https://picsum.photos/seed/glitz1/800/500",
      metric: "+180%",
      metricLabel: "Online Bookings",
      tags: ["Next.js", "Node.js", "AI", "Apple Wallet"],
      headline: "From Instagram DMs to a Fully Integrated Platform",
      subtitle:
        "A complete business operating system for a growing beauty brand. AI booking agent, digital loyalty cards, automated notifications, and full analytics.",
      tech: ["Next.js", "Node.js", "OpenAI", "PostgreSQL", "Apple Wallet", "Twilio"],
      challenge:
        "Every booking came through Instagram DMs. The owner checked her calendar, responded with times, and hoped clients showed up. Loyalty tracking was nonexistent. Revenue was tracked in a notebook. No visibility into what was working.",
      solution:
        "We built a custom platform on Next.js with an AI booking agent, calendar-based booking engine, digital loyalty cards with Apple Wallet, automated SMS/email notifications, and a full admin dashboard with real-time analytics.",
      videoUrl: "",
      stats: [
        { value: "+180%", label: "Online Bookings" },
        { value: "0", label: "Manual DMs" },
        { value: "24/7", label: "Availability" },
        { value: "100%", label: "Automated Alerts" },
      ],
      gallery: [
        "https://picsum.photos/seed/gg-dash/800/500",
        "https://picsum.photos/seed/gg-booking/800/500",
        "https://picsum.photos/seed/gg-loyalty/800/500",
        "https://picsum.photos/seed/gg-agent/800/500",
        "https://picsum.photos/seed/gg-mobile/800/500",
      ],
      features: [
        { title: "AI Booking Agent", desc: "Trained on the business. Handles enquiries, checks availability, and captures bookings 24/7." },
        { title: "Calendar Booking Engine", desc: "Clients pick a service, choose a time slot, and confirm. No DMs needed." },
        { title: "Digital Loyalty Cards", desc: "Apple Wallet and Google Wallet integration. Stamps update automatically after each visit." },
        { title: "Admin Dashboard", desc: "Full control. Manage bookings, clients, blogs, photos, discount codes, and analytics." },
        { title: "SMS & Email Automation", desc: "Booking confirmations, reminders, and follow-ups sent automatically at every stage." },
        { title: "SEO Website & Blog", desc: "Service pages, pricing, and blog built to rank in search and convert visitors into clients." },
      ],
      sections: [
        {
          label: "Dashboard",
          title: "Admin Panel",
          desc: "Full visibility into bookings, revenue, clients, and loyalty program performance.",
          images: [
            "https://picsum.photos/seed/gg-admin1/900/560",
            "https://picsum.photos/seed/gg-admin2/900/560",
          ],
        },
        {
          label: "Client Experience",
          title: "Booking Flow",
          desc: "Mobile-first booking experience. From discovery to confirmation in under a minute.",
          images: [
            "https://picsum.photos/seed/gg-flow1/900/560",
            "https://picsum.photos/seed/gg-flow2/900/560",
            "https://picsum.photos/seed/gg-flow3/900/560",
          ],
        },
      ],
      results: [
        { title: "Bookings run 24/7", desc: "Clients book anytime without waiting for a reply." },
        { title: "Loyalty drives repeat visits", desc: "Digital cards on their phones. Zero manual effort." },
        { title: "Full business visibility", desc: "Revenue, trends, and client data in one dashboard." },
        { title: "Self-service management", desc: "Photos, blogs, events, and promotions without touching code." },
      ],
      ctaEyebrow: "Outgrown your tools?",
      ctaHeading: "Let's Build Your",
      ctaAccent: "Platform.",
    },
  });

  const sayma = await prisma.caseStudy.upsert({
    where: { slug: "sayma-manpower" },
    update: {},
    create: {
      slug: "sayma-manpower",
      published: true,
      sortOrder: 1,
      client: "Sayma Manpower",
      logo: "/clients/sayma-manpower.svg",
      category: "Digital Transformation",
      title: "Complete digital backbone for an offline agency in Oman",
      description:
        "Built an entire digital ecosystem from scratch — website, mobile app, social media management, and internal operations tools for a manpower agency with zero prior digital presence.",
      coverImage: "https://picsum.photos/seed/sayma1/800/500",
      metric: "2+ Yrs",
      metricLabel: "Partnership",
      tags: ["Next.js", "Mobile Apps", "Marketing"],
      headline: "Taking an Offline Agency Fully Digital",
      subtitle:
        "Complete digital backbone for a traditional housemaid supply agency in Oman. Website, staff apps, contracts, accounting, and two years of social media marketing.",
      tech: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Firebase"],
      challenge:
        "The entire operation ran on paper and phone calls. Contracts were physical documents. Training records lived in notebooks. Translators coordinated over WhatsApp. No website, no online presence, no system to manage operations.",
      solution:
        "We built a complete digital ecosystem: SEO-optimized website with chatbot, mobile apps for trainers/translators/management, digital contract management, accounting system, and managed social media marketing for two years.",
      videoUrl: "",
      stats: [
        { value: "2+", label: "Years Partnership" },
        { value: "100%", label: "Digital Contracts" },
        { value: "24/7", label: "Lead Capture" },
        { value: "3", label: "Staff App Roles" },
      ],
      gallery: [
        "https://picsum.photos/seed/sm-web/800/500",
        "https://picsum.photos/seed/sm-app/800/500",
        "https://picsum.photos/seed/sm-dash/800/500",
        "https://picsum.photos/seed/sm-contracts/800/500",
        "https://picsum.photos/seed/sm-social/800/500",
      ],
      features: [
        { title: "SEO Website", desc: "Professional site built to rank for employer searches in Oman. Lead capture on every page." },
        { title: "Built-In Chatbot", desc: "Handles employer enquiries, answers FAQs, and captures leads around the clock." },
        { title: "Staff Mobile Apps", desc: "Separate access for trainers, translators, and management. Each role sees only what they need." },
        { title: "Contract Management", desc: "Digital contracts with status tracking, expiry reminders, and full searchable history." },
        { title: "Accounting System", desc: "Employer payments, staff costs, and balances tracked in one system. Clean financial records." },
        { title: "Social Media Marketing", desc: "Two years of content, audience growth, and lead generation. Built presence from zero." },
      ],
      sections: [
        {
          label: "Website",
          title: "The Front Door",
          desc: "SEO-optimized site with chatbot. The biggest source of new employer enquiries.",
          images: [
            "https://picsum.photos/seed/sm-site1/900/560",
            "https://picsum.photos/seed/sm-site2/900/560",
          ],
        },
        {
          label: "Mobile Apps",
          title: "Staff Tools",
          desc: "Trainers, translators, and management each have their own app view.",
          images: [
            "https://picsum.photos/seed/sm-app1/900/560",
            "https://picsum.photos/seed/sm-app2/900/560",
            "https://picsum.photos/seed/sm-app3/900/560",
          ],
        },
        {
          label: "Operations",
          title: "Contracts & Accounting",
          desc: "Digital contract management and clean financial records.",
          images: [
            "https://picsum.photos/seed/sm-ops1/900/560",
            "https://picsum.photos/seed/sm-ops2/900/560",
          ],
        },
      ],
      results: [
        { title: "Employers find them online", desc: "SEO site with chatbot captures leads 24/7." },
        { title: "Staff work from their phones", desc: "Real-time updates, not group chat coordination." },
        { title: "Contracts are traceable", desc: "Digital, searchable, with automatic reminders." },
        { title: "Accounts are in order", desc: "Clean records that don't depend on spreadsheets." },
      ],
      ctaEyebrow: "Running on paper?",
      ctaHeading: "Let's Build Your",
      ctaAccent: "Digital Backbone.",
    },
  });

  console.log("✅ Seeded:", glitz.client, sayma.client);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
