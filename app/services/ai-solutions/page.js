import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata = {
  title: "AI Solutions & Machine Learning — Projekts | Custom AI Development",
  description:
    "Projekts builds custom AI solutions — from LLM integrations and intelligent automation to computer vision and predictive analytics. Transform your workflows with AI.",
  openGraph: {
    title: "AI Solutions & Machine Learning — Projekts",
    description: "Custom AI that transforms your business operations and customer experience.",
  },
};

const DATA = {
  title: "AI Solutions",
  subtitle:
    "Custom machine learning models, intelligent automation, and AI-powered features that don't just impress — they transform how your business operates.",
  description: {
    heading: "AI that solves real problems, not just demos.",
    paragraphs: [
      "Most AI projects fail because they start with the technology instead of the problem. We start with your bottlenecks, your data, and your operations — then engineer the simplest AI solution that delivers measurable ROI.",
      "From integrating large language models into customer support workflows to building custom computer vision pipelines for quality control, we've deployed AI systems that save our clients thousands of hours per year. Every solution includes explainability, monitoring, and a clear path to production.",
    ],
  },
  features: {
    heading: "Intelligence built into your product.",
    items: [
      { title: "LLM Integration", desc: "Custom GPT, Claude, and open-source LLM integrations with RAG, fine-tuning, prompt engineering, and guardrails for production safety." },
      { title: "Intelligent Automation", desc: "AI-powered workflows that handle document processing, data extraction, classification, and decision-making at scale." },
      { title: "Predictive Analytics", desc: "Forecasting models for demand planning, churn prediction, pricing optimization, and anomaly detection." },
      { title: "Computer Vision", desc: "Image classification, object detection, OCR, and visual inspection systems for manufacturing and retail." },
      { title: "Conversational AI", desc: "Context-aware chatbots and voice assistants with memory, tool use, and seamless human handoff." },
      { title: "Recommendation Engines", desc: "Personalization systems that drive engagement — content recommendations, product suggestions, and dynamic pricing." },
    ],
  },
  process: {
    heading: "From proof-of-concept to production AI.",
    steps: [
      { title: "Problem Definition", desc: "We map your workflows, identify automation opportunities, and quantify the potential ROI of each AI initiative." },
      { title: "Data Assessment", desc: "Audit your data quality, availability, and infrastructure readiness. Design data pipelines if needed." },
      { title: "Rapid Prototyping", desc: "Build a working proof-of-concept in 2-4 weeks so you can validate the approach before committing to full development." },
      { title: "Model Development", desc: "Train, fine-tune, and evaluate models with rigorous testing. Implement bias detection and explainability." },
      { title: "Production Deployment", desc: "Containerized deployment with monitoring, A/B testing, model versioning, and automated retraining pipelines." },
    ],
  },
  techStack: {
    heading: "Enterprise AI infrastructure.",
    items: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Hugging Face", "scikit-learn", "FastAPI", "Pinecone", "Weaviate", "AWS SageMaker", "Google Vertex AI", "Docker", "Kubernetes", "MLflow", "Weights & Biases"],
  },
  faqs: [
    { q: "Do we need a lot of data to use AI?", a: "Not always. Pre-trained models and transfer learning can deliver results with surprisingly small datasets. We'll assess your data during discovery and be honest about what's feasible." },
    { q: "How long until we see ROI from AI?", a: "Proof-of-concept results typically come in 2-4 weeks. Production deployment in 8-16 weeks. Most clients see measurable ROI within the first quarter of deployment." },
    { q: "Is our data safe?", a: "Absolutely. We can deploy on-premise, in your private cloud, or use zero-retention API configurations. Your data never leaves your control." },
    { q: "Can AI replace our entire team?", a: "We focus on augmentation, not replacement. AI handles the repetitive work so your team can focus on high-value decisions. This typically results in 3-10x productivity gains." },
    { q: "What happens when the AI model degrades?", a: "We build monitoring dashboards that track model accuracy in real-time. Automated alerts trigger retraining pipelines when performance drops below thresholds." },
    { q: "Can you integrate AI into our existing software?", a: "Yes. We expose AI capabilities via APIs that integrate with any existing system — ERPs, CRMs, custom applications, or legacy software." },
  ],
  ctaText: "Ready to Add Intelligence to",
};

export default function AISolutionsPage() {
  return <ServicePageLayout {...DATA} />;
}
