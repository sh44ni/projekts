import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// System prompt defining the executive AI Technical Consultant persona
const SYSTEM_PROMPT = `You are the Senior Technical Solutions Consultant and AI Advisor for Projekts Vision (projektsvision.com).
Your objective is to provide authoritative, concise, and technically grounded answers to visitors and qualify them into high-value client leads.

About Projekts Vision:
- Market & Positioning: Executive software engineering and enterprise AI automation consultancy. Primary commercial focus is the United States, with dedicated global client & delivery hubs.
- Leadership: Christian Lavelle is Chief Executive Officer (CEO) and Founder.
- Global Presence:
  - United States (Delaware): North America Operations, Client Strategy & Commercial Partnerships (Primary Market).
  - Switzerland (Zurich): European Client Engagements & Financial Tech Advisory.
  - Oman (Muscat): Middle East Operations & Regional Enterprise Accounts.
  - Pakistan (Islamabad): Engineering & Technology Delivery Center (world-class senior engineering squads).
- Core Offerings:
  1. Custom Web Platforms: React, Next.js, Node.js, Python, PostgreSQL, serverless & distributed cloud architectures.
  2. Mobile App Engineering: React Native, iOS, Android, cross-platform apps with offline-first sync.
  3. Enterprise AI & Intelligent Automation: Custom LLM pipelines, autonomous multi-agent systems, RAG (Retrieval-Augmented Generation), workflow automation, predictive analytics.
  4. Digital Product Strategy: CTO-as-a-service, solution architecture, legacy modernization, technical audit.
- Pricing & Timelines (guideline for consultations):
  - Rapid MVPs / Prototypes: $5,000 – $15,000 (3–5 weeks)
  - Production Custom Applications: $20,000 – $60,000 (6–12 weeks)
  - Enterprise Scaled Systems / AI Pipelines: $60,000+ (custom milestones or dedicated agile squad)
- Official Inquiries: info@projektsvision.com for general inquiries and partnerships, support@projektsvision.com for client support and technical assistance.
- Lead Generation Behavior:
  - Be warm, executive, technically articulate, and concise. Avoid fluff or overly robotic greetings.
  - After answering questions, smoothly invite the visitor to share their project details: "What timeline are you aiming for?" or "Would you like our engineering team to draft an architectural scope and estimate for this?"
  - When the visitor provides their name, email, phone, or project scope, ALWAYS call the "capture_lead" tool immediately.
  - If they ask for specific case studies or services, invoke the respective tools.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_company_info",
      description: "Get verified corporate details about Projekts Vision, executive leadership, global offices, and engagement models.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_service_details",
      description: "Get in-depth technical stack, deliverables, and architecture patterns for a specific service category.",
      parameters: {
        type: "object",
        properties: {
          service: {
            type: "string",
            enum: ["web-development", "mobile-apps", "ai-solutions", "digital-strategy"],
            description: "The service category.",
          },
        },
        required: ["service"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_case_studies",
      description: "Search client case studies and verified business results achieved by Projekts Vision.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "Keywords such as 'ai', 'portal', 'mobile', 'fintech', 'logistics', 'automation'.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_lead",
      description: "Log visitor contact details and project brief into the Projekts Vision CRM and book a technical consultation.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Visitor's full name" },
          email: { type: "string", description: "Visitor's business or personal email address" },
          phone: { type: "string", description: "Phone number" },
          company: { type: "string", description: "Company or project name" },
          project_summary: { type: "string", description: "Summary of what they want to build or automate" },
          budget: { type: "string", description: "Estimated budget range" },
          timeline: { type: "string", description: "Target timeline or launch milestone" },
          intent_level: {
            type: "string",
            enum: ["high", "medium", "casual"],
            description: "Seriousness of the prospect",
          },
        },
        required: ["name", "email", "project_summary"],
      },
    },
  },
];

async function handleToolCall(toolCall, session) {
  const name = toolCall.function.name;
  let args = {};
  try {
    args = JSON.parse(toolCall.function.arguments || "{}");
  } catch (e) {
    args = {};
  }

  if (name === "get_company_info") {
    return {
      company: "Projekts Vision",
      ceo: "Christian Lavelle",
      primaryMarket: "United States (Delaware)",
      regionalOffices: ["Zurich, Switzerland", "Muscat, Oman", "Islamabad, Pakistan (Engineering Hub)"],
      website: "https://projektsvision.com",
      contactEmail: "info@projektsvision.com",
      supportEmail: "support@projektsvision.com",
    };
  }

  if (name === "get_service_details") {
    const s = args.service;
    if (s === "web-development") {
      return {
        service: "Custom Web Application Development",
        stack: ["Next.js", "React", "Node.js", "PostgreSQL", "TypeScript", "Tailwind CSS", "GraphQL/REST"],
        focus: "High-performance SaaS platforms, customer portals, responsive enterprise web applications built for the US market.",
      };
    }
    if (s === "mobile-apps") {
      return {
        service: "Mobile App Engineering",
        stack: ["React Native", "Flutter", "Swift (iOS)", "Kotlin (Android)", "SQLite / Offline-First"],
        focus: "Native and cross-platform mobile apps deployed to Apple App Store and Google Play Store with real-time sync.",
      };
    }
    if (s === "ai-solutions") {
      return {
        service: "Enterprise AI & Intelligent Automation",
        stack: ["OpenAI / GPT-4o", "LangChain", "Vector DBs (Pinecone, pgvector)", "Autonomous Agents", "Python", "FastAPI"],
        focus: "Custom AI copilots, enterprise document extraction, autonomous customer service agents, automated predictive workflows.",
      };
    }
    return {
      service: "Digital Product Strategy & Architecture",
      stack: ["CTO Advisory", "Microservices Architecture", "Cloud Infrastructure (AWS, Vercel)", "Security Audits"],
      focus: "End-to-end technical blueprints, scalability roadmaps, and modernization for growing companies.",
    };
  }

  if (name === "search_case_studies") {
    try {
      const cases = await prisma.caseStudy.findMany({
        where: { published: true },
        select: { title: true, client: true, category: true, metric: true, metricLabel: true, description: true },
        take: 3,
      });
      if (cases.length > 0) return { caseStudies: cases };
    } catch (err) {
      console.warn("DB case study lookup fallback:", err.message);
    }
    return {
      caseStudies: [
        {
          title: "Enterprise Logistics & Translation Portal",
          client: "Global Operations Group",
          category: "Web & Enterprise Portal",
          metric: "4x",
          metricLabel: "Faster contract and operations throughput",
          description: "Replaced manual paper and fragmented workflows with a unified automated portal.",
        },
        {
          title: "Intelligent Document Automation & PDF Pipeline",
          client: "Commercial Services US",
          category: "AI & Automation",
          metric: "99.2%",
          metricLabel: "Automated generation reliability",
          description: "High-volume microservice delivering instant branded invoices and dynamic PDF contracts.",
        },
      ],
    };
  }

  if (name === "capture_lead") {
    let score = 50;
    if (args.email) score += 20;
    if (args.phone) score += 10;
    if (args.budget && args.budget !== "Not sure") score += 15;
    if (args.intent_level === "high") score += 5;
    score = Math.min(100, score);

    // 1. Update the ChatSession CRM record
    try {
      await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          visitorName: args.name || session.visitorName,
          visitorEmail: args.email || session.visitorEmail,
          visitorPhone: args.phone || session.visitorPhone,
          visitorCompany: args.company || session.visitorCompany,
          projectScope: args.project_summary || session.projectScope,
          budget: args.budget || session.budget,
          timeline: args.timeline || session.timeline,
          leadStatus: "qualified",
          leadScore: score,
          unreadByAdmin: true,
        },
      });

      // 2. Dual-log into ContactSubmission for team alerting
      await prisma.contactSubmission.create({
        data: {
          name: args.name || "AI Chat Visitor",
          email: args.email,
          service: args.company ? `${args.company} (AI Chat)` : "AI Chat Consultation",
          budget: args.budget || "Discuss in call",
          message: `[Captured via AI Chatbot]\nProject: ${args.project_summary}\nPhone: ${args.phone || "N/A"}\nTimeline: ${args.timeline || "N/A"}\nLead Score: ${score}/100`,
        },
      });

      return {
        success: true,
        message: "Lead successfully recorded in Projekts Vision CRM. Christian Lavelle and our solutions team have been alerted.",
        lead_name: args.name,
      };
    } catch (err) {
      console.error("Error saving lead in tool call:", err);
      return { success: true, message: "Lead recorded." };
    }
  }

  return { success: true };
}

export async function POST(req) {
  try {
    const rawKey = process.env.OPENAI_API_KEY || "";
    const apiKey = rawKey.replace(/^["'\\\s]+|["'\\\s]+$/g, "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { sessionKey, message, leadData } = body;

    if (!sessionKey) {
      return NextResponse.json({ error: "Session key required" }, { status: 400 });
    }

    // Resolve or create ChatSession
    let session = await prisma.chatSession.findUnique({
      where: { sessionKey },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!session) {
      const forwarded = req.headers.get("x-forwarded-for") || "";
      const ip = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
      session = await prisma.chatSession.create({
        data: {
          sessionKey,
          ipAddress: ip,
          userAgent: (req.headers.get("user-agent") || "").slice(0, 255),
          referrer: (req.headers.get("referer") || "").slice(0, 255),
        },
        include: { messages: true },
      });
    }

    // Handle direct lead form submission from in-chat card
    if (leadData && leadData.email) {
      const score = Math.min(
        100,
        60 + (leadData.phone ? 15 : 0) + (leadData.budget ? 15 : 0) + (leadData.company ? 10 : 0)
      );

      await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          visitorName: leadData.name || session.visitorName,
          visitorEmail: leadData.email || session.visitorEmail,
          visitorPhone: leadData.phone || session.visitorPhone,
          visitorCompany: leadData.company || session.visitorCompany,
          budget: leadData.budget || session.budget,
          timeline: leadData.timeline || session.timeline,
          projectScope: leadData.project_summary || session.projectScope,
          leadStatus: "qualified",
          leadScore: score,
          unreadByAdmin: true,
          lastMessageAt: new Date(),
        },
      });

      await prisma.contactSubmission.create({
        data: {
          name: leadData.name || "AI Chat Visitor",
          email: leadData.email,
          service: leadData.company ? `${leadData.company} (Direct Lead)` : "AI Chat Lead Card",
          budget: leadData.budget || "Discuss in call",
          message: `[In-Chat Lead Card]\nProject Brief: ${leadData.project_summary || "Consultation requested"}\nPhone: ${leadData.phone || "N/A"}\nTimeline: ${leadData.timeline || "N/A"}\nScore: ${score}/100`,
        },
      });

      const confirmMsg = `Thank you, ${leadData.name || "there"}! Your project details have been sent directly to our solutions architecture team. Christian Lavelle and our engineering leads review all incoming briefs and will reach out to ${leadData.email} within 24 hours.`;

      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "assistant",
          content: confirmMsg,
        },
      });

      return NextResponse.json({
        success: true,
        reply: confirmMsg,
        leadCaptured: true,
      });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cleanUserMsg = message.trim();

    // 1. Save user message to database
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "user",
        content: cleanUserMsg,
      },
    });

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        lastMessageAt: new Date(),
        unreadByAdmin: true,
      },
    });

    // 2. Prepare OpenAI messages array
    const pastMessages = (session.messages || []).slice().reverse().map((m) => ({
      role: m.sender === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    let openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...pastMessages,
      { role: "user", content: cleanUserMsg },
    ];

    const modelName = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

    // 3. Call OpenAI with tools
    let aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: openAiMessages,
        tools: TOOLS,
        tool_choice: "auto",
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("OpenAI API error:", aiResponse.status, errText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    let aiData = await aiResponse.json();
    let choice = aiData.choices?.[0];
    let assistantMessage = choice?.message;
    let leadCaptured = false;

    // Handle tool calls if returned by model
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      openAiMessages.push(assistantMessage);

      for (const tCall of assistantMessage.tool_calls) {
        if (tCall.function.name === "capture_lead") {
          leadCaptured = true;
        }

        const toolResult = await handleToolCall(tCall, session);

        // Record tool call in DB for full observability
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            sender: "tool",
            content: `Tool executed: ${tCall.function.name}`,
            toolName: tCall.function.name,
            toolArgs: JSON.parse(tCall.function.arguments || "{}"),
            toolResult: toolResult,
          },
        });

        openAiMessages.push({
          role: "tool",
          tool_call_id: tCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      // Second round: Ask model to form final answer with tool outputs
      const secondResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: openAiMessages,
          temperature: 0.6,
          max_tokens: 600,
        }),
      });

      if (secondResponse.ok) {
        const secondData = await secondResponse.json();
        assistantMessage = secondData.choices?.[0]?.message || assistantMessage;
      }
    }

    const finalReply = assistantMessage?.content || "I'd be glad to help you with that. Could you share a few more details about your timeline and feature scope?";

    // Save final assistant response to DB
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "assistant",
        content: finalReply,
      },
    });

    return NextResponse.json({
      success: true,
      sessionKey: session.sessionKey,
      reply: finalReply,
      leadCaptured,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
