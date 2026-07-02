import { useState } from "react";

/* ============================================================
   DRAYGONFIRE — v1.5 Industry Edition
   Functional build: real Claude API calls in Templates, Research,
   Business Suite, and Fantasy Creator. Everything else is the
   navigable shell ready for future wiring.
   ============================================================ */

const C = {
  bg: "#0A0A0F",
  surface: "#111118",
  surfaceHigh: "#1A1A26",
  border: "#1E1E2E",
  borderBright: "#2D2D45",
  accent: "#7C5CFC",
  accentSoft: "#7C5CFC18",
  accentGlow: "#7C5CFC44",
  fire: "#FF6B35",
  fireSoft: "#FF6B3518",
  fireGlow: "#FF6B3544",
  teal: "#00D4C8",
  amber: "#F5A623",
  rose: "#FF6B8A",
  green: "#22D45E",
  purple: "#B06EFF",
  blue: "#3B9EFF",
  text: "#E8E8F0",
  muted: "#6B6B8A",
  mutedMid: "#9090B0",
};

const AI_MODELS = [
  { id: "claude", name: "Claude", color: "#7C5CFC", best: "Writing, healthcare & legal content" },
  { id: "gpt4", name: "GPT-4o", color: "#10A37F", best: "Templates, SEO, marketing copy" },
  { id: "gemini", name: "Gemini", color: "#4285F4", best: "Video analysis, spreadsheets" },
  { id: "grok", name: "Grok", color: "#1DA1F2", best: "Real-time research, trends" },
  { id: "perplexity", name: "Perplexity", color: "#20B2AA", best: "Live web search" },
  { id: "llama", name: "Llama 3", color: "#0668E1", best: "Bulk processing" },
  { id: "mistral", name: "Mistral", color: "#FF6B35", best: "Multilingual content" },
  { id: "elevenlabs", name: "ElevenLabs", color: "#FF2D78", best: "Voice & audio" },
];

const INDUSTRIES = [
  { id: "healthcare", label: "Healthcare", icon: "🏥", color: C.teal, ai: "claude" },
  { id: "realestate", label: "Real Estate", icon: "🏠", color: C.amber, ai: "gpt4" },
  { id: "fitness", label: "Fitness", icon: "💪", color: C.rose, ai: "gpt4" },
  { id: "legal", label: "Legal", icon: "⚖️", color: C.purple, ai: "claude" },
  { id: "finance", label: "Finance", icon: "💰", color: C.green, ai: "gpt4" },
  { id: "education", label: "Education", icon: "📚", color: C.blue, ai: "claude" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️", color: C.fire, ai: "gpt4" },
  { id: "beauty", label: "Beauty", icon: "💄", color: C.rose, ai: "gpt4" },
];

const VERSIONS = [
  { v: "v1.0", name: "Content Edition", status: "live", color: C.accent, desc: "Video repurposing, AI captions, publishing, gamification" },
  { v: "v1.5", name: "Industry Edition", status: "live", color: C.teal, desc: "10 industry templates, dual-AI routing" },
  { v: "v2.0", name: "Intelligence Edition", status: "building", color: C.amber, desc: "Grok research, Gemini spreadsheets, analytics" },
  { v: "v2.5", name: "Creator Edition", status: "planned", color: C.purple, desc: "Fantasy creator, AI images, ElevenLabs voice" },
  { v: "v3.0", name: "Life Pathways Edition", status: "planned", color: C.green, desc: "Dream Home Planning, Pathways to Credentials, The Shift, The Spark" },
  { v: "v3.5", name: "The Horizon Edition", status: "planned", color: C.blue, desc: "Community success stories, Know Before You Go, Wins Wall" },
  { v: "v4.0", name: "Village Edition", status: "planned", color: C.fire, desc: "Bills/benefits navigation, housing education, resume + placement" },
  { v: "v5.0", name: "Autonomous Edition", status: "future", color: "#FFD700", desc: "AI runs your entire creative + life operation hands-free" },
];

/* ---------- Claude API helper ---------- */
async function askClaude(prompt, maxTokens = 1000) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, maxTokens }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return (data.text || "").replace(/```json|```/g, "").trim();
}
async function askImage(prompt, style = "vivid") {
  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, style }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Image generation failed");
  }
  return data;
}
/* ---------- Shared UI bits ---------- */
function Tag({ label, color, small }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: small ? "2px 8px" : "4px 12px",
      fontSize: small ? 10 : 12, fontWeight: 700, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function StatusBadge({ status }) {
  const map = {
    live: { label: "Live Now", color: C.green },
    building: { label: "Building", color: C.amber },
    planned: { label: "Planned", color: C.accent },
    future: { label: "Future", color: "#FFD700" },
  };
  const s = map[status] || map.planned;
  return <Tag label={s.label} color={s.color} small />;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function Sidebar({ active, setActive }) {
  const nav = [
    { id: "home", label: "Home", icon: "◈" },
    { id: "templates", label: "Templates", icon: "◧", badge: "LIVE AI" },
    { id: "research", label: "Research", icon: "◉", badge: "LIVE AI" },
    { id: "business", label: "Business Suite", icon: "▣", badge: "LIVE AI" },
    { id: "fantasy", label: "Fantasy Creator", icon: "✧", badge: "LIVE AI" },
    { id: "fiery", label: "Fiery Artistry", icon: "🔥", badge: "LIVE AI" },
    { id: "create", label: "Create & Clips", icon: "✦" },
    { id: "publish", label: "Publish", icon: "◎" },
    { id: "progress", label: "My Progress", icon: "◆" },
    { id: "safety", label: "Safety & Trust", icon: "🛡" },
    { id: "roadmap", label: "Roadmap", icon: "◷" },
    { id: "founder", label: "Founder's Statement", icon: "🔥" },
  ];
  return (
    <aside style={{
      width: 232, background: C.surface, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: "0 0 20px",
      flexShrink: 0, overflowY: "auto",
    }}>
      <div style={{ padding: "20px 16px 18px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg,${C.accent},${C.fire})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
          }}>D</div>
          <div>
            <div style={{
              fontSize: 14, fontWeight: 900,
              background: `linear-gradient(135deg,${C.accent},${C.fire})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>DraygonFire</div>
            <div style={{ fontSize: 9, color: C.fire, fontWeight: 700, letterSpacing: "1px" }}>
              v1.5 INDUSTRY EDITION
            </div>
          </div>
        </div>
      </div>
      <nav style={{ padding: "10px 8px", flex: 1 }}>
        {nav.map((item) => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "9px 10px",
            borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
            width: "100%", marginBottom: 1,
            background: active === item.id ? C.accentSoft : "transparent",
            color: active === item.id ? C.accent : C.mutedMid,
            fontSize: 12, fontWeight: active === item.id ? 700 : 500,
            boxShadow: active === item.id ? `inset 2px 0 0 ${C.accent}` : "none",
          }}>
            <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && <Tag label={item.badge} color={C.green} small />}
          </button>
        ))}
      </nav>
      <div style={{
        margin: "8px 10px 0", padding: 12,
        background: `linear-gradient(135deg,${C.accentSoft},${C.fireSoft})`,
        borderRadius: 10, border: `1px solid ${C.fire}33`,
      }}>
        <div style={{ fontSize: 11, color: C.mutedMid, lineHeight: 1.5 }}>
          🔥 Built by a CNA between night shifts. Set your content on fire.
        </div>
      </div>
    </aside>
  );
}

/* ============================================================
   HOME
   ============================================================ */
function HomeView({ setActive }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{
        background: `linear-gradient(135deg,${C.accentSoft},${C.fireSoft},transparent)`,
        border: `1px solid ${C.fire}33`, borderRadius: 16, padding: "32px 28px",
      }}>
        <div style={{ fontSize: 10, color: C.fire, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>
          The AI Operating System for Human Creativity
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-1px", marginBottom: 10, lineHeight: 1.15 }}>
          <span style={{ color: C.text }}>Every tool you need.</span><br />
          <span style={{
            background: `linear-gradient(135deg,${C.accent},${C.fire})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>One platform. On fire.</span>
        </div>
        <div style={{ fontSize: 14, color: C.mutedMid, maxWidth: 520, lineHeight: 1.7, marginBottom: 20 }}>
          From small flame to a blaze — DraygonFire turns one video, one idea,
          one piece of content into everything you need across every platform.
          Built by a single mother and traveling CNA, between night shifts, for
          anyone who has ever needed more than they had access to.
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setActive("templates")} style={{
            padding: "11px 22px", borderRadius: 9, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.accent},${C.fire})`, color: "#fff",
            fontSize: 13, fontWeight: 800, boxShadow: `0 4px 20px ${C.fireGlow}`,
          }}>🔥 Try AI Templates</button>
          <button onClick={() => setActive("founder")} style={{
            padding: "11px 22px", borderRadius: 9, border: `1px solid ${C.border}`,
            cursor: "pointer", background: "transparent", color: C.mutedMid,
            fontSize: 13, fontWeight: 600,
          }}>Read the Founder's Story →</button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 4 }}>
          ⚡ Live Right Now
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
          These tabs call real Claude AI. Try them — they generate fresh content every time.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { id: "templates", label: "Industry Templates", icon: "◧", color: C.teal, desc: "Healthcare, real estate, fitness & more" },
            { id: "research", label: "Research", icon: "◉", color: C.blue, desc: "Competitive intelligence engine" },
            { id: "business", label: "Business Suite", icon: "▣", color: C.amber, desc: "Spreadsheets, docs, invoices" },
            { id: "fantasy", label: "Fantasy Creator", icon: "✧", color: C.fire, desc: "Stories, worlds, characters" },
          ].map((zone) => (
            <button key={zone.id} onClick={() => setActive(zone.id)} style={{
              background: C.surfaceHigh, border: `1px solid ${zone.color}33`, borderRadius: 12,
              padding: "16px 14px", textAlign: "left", cursor: "pointer",
            }}>
              <div style={{ fontSize: 18, color: zone.color, marginBottom: 8 }}>{zone.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{zone.label}</div>
              <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.4 }}>{zone.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
          8 AI Models — Routed Automatically
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
          Currently live: Claude. The other 7 are roadmap integrations for v2.0+.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {AI_MODELS.map((ai, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${ai.color}33`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, background: ai.color + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: ai.color, flexShrink: 0,
                }}>{ai.name[0]}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{ai.name}</div>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: i === 0 ? C.green : C.muted, marginLeft: "auto",
                }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.4 }}>{ai.best}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATES — LIVE AI
   ============================================================ */
function TemplatesView() {
  const [selInd, setSelInd] = useState("healthcare");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const ind = INDUSTRIES.find((i) => i.id === selInd);
  const aiModel = AI_MODELS.find((a) => a.id === ind?.ai);

  const generate = async () => {
    if (!details.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const txt = await askClaude(
        `You are an expert ${ind.label} content creator. Write a professional social media post for: "${details}". Use appropriate ${ind.label} industry terminology and a professional tone. Return ONLY valid JSON, no other text: {"caption": string, "hashtags": string[], "cta": string, "tip": string}`
      );
      setResult(JSON.parse(txt));
    } catch (e) {
      setError("Generation failed. This usually means the API key isn't set up yet, or you're out of credits. Check the VITE_ANTHROPIC_API_KEY environment variable in Vercel.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {INDUSTRIES.map((i) => (
          <button key={i.id} onClick={() => setSelInd(i.id)} style={{
            padding: "8px 14px", borderRadius: 20,
            border: `1px solid ${selInd === i.id ? i.color + "66" : C.border}`,
            cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: selInd === i.id ? i.color + "22" : C.surfaceHigh,
            color: selInd === i.id ? i.color : C.mutedMid,
            display: "flex", alignItems: "center", gap: 6,
          }}>{i.icon} {i.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.surfaceHigh, border: `1px solid ${ind.color}44`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>{ind.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ind.label} Templates</div>
              <div style={{ fontSize: 11, color: C.muted }}>Powered by {aiModel.name}</div>
            </div>
            <Tag label={aiModel.name} color={aiModel.color} small />
          </div>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)}
            placeholder={`Tell me about your ${ind.label} business or the message you want to share...`}
            style={{
              width: "100%", minHeight: 120, padding: 12, background: C.bg,
              border: `1px solid ${C.border}`, borderRadius: 8, outline: "none",
              resize: "vertical", color: C.text, fontSize: 13, lineHeight: 1.6, fontFamily: "inherit",
            }} />
          <button onClick={generate} disabled={loading || !details.trim()} style={{
            width: "100%", padding: "11px 0", borderRadius: 8, border: "none",
            cursor: loading || !details.trim() ? "default" : "pointer",
            background: loading || !details.trim() ? C.border : `linear-gradient(135deg,${ind.color},${C.accent})`,
            color: loading || !details.trim() ? C.muted : "#fff", fontSize: 13, fontWeight: 700,
          }}>{loading ? `${aiModel.name} is writing...` : `✨ Generate ${ind.label} Content`}</button>
        </div>

        <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Generated Content</div>
            {result && <Tag label="Ready" color={C.green} small />}
          </div>
          <div style={{ padding: 16, minHeight: 260 }}>
            {error && <div style={{ color: C.rose, fontSize: 12, lineHeight: 1.6 }}>{error}</div>}
            {result && !error ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: C.bg, borderRadius: 8, padding: 12, fontSize: 13, color: C.text, lineHeight: 1.7, border: `1px solid ${C.border}` }}>{result.caption}</div>
                {result.hashtags?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.hashtags.map((h, i) => <Tag key={i} label={`#${h}`} color={ind.color} small />)}
                  </div>
                )}
                {result.cta && <div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>→ {result.cta}</div>}
                {result.tip && (
                  <div style={{ background: C.accentSoft, border: `1px solid ${C.accentGlow}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.mutedMid }}>
                    <strong style={{ color: C.accent }}>Tip: </strong>{result.tip}
                  </div>
                )}
              </div>
            ) : !error && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, gap: 10 }}>
                <span style={{ fontSize: 36 }}>{ind.icon}</span>
                <div style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Enter your details and generate real {ind.label} content</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RESEARCH — LIVE AI
   ============================================================ */
function ResearchView() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const research = async () => {
    if (!query.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const txt = await askClaude(
        `You are a competitive intelligence analyst. Analyze this query and give actionable insight: "${query}". Return ONLY valid JSON, no other text: {"summary": string, "findings": string[], "competitors": string[], "opportunities": string[], "action": string}`
      );
      setResult(JSON.parse(txt));
    } catch (e) {
      setError("Research failed. Check that the API key is configured in Vercel environment variables.");
    }
    setLoading(false);
  };

  const presets = [
    "What are users complaining about with Opus Clip and Descript?",
    "What content trends are healthcare creators riding on TikTok right now?",
    "How are real estate agents using AI tools in 2026?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: C.surfaceHigh, border: `1px solid ${C.blue}44`, borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blue + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: C.blue }}>R</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Research Engine</div>
            <div style={{ fontSize: 12, color: C.muted }}>Competitive intelligence and market analysis</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about competitors, trends, customer pain points..."
            style={{ flex: 1, padding: "11px 14px", borderRadius: 9, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, outline: "none" }} />
          <button onClick={research} disabled={loading || !query.trim()} style={{
            padding: "11px 18px", borderRadius: 9, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.blue},${C.accent})`, color: "#fff",
            fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
          }}>{loading ? "Researching..." : "Research →"}</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {presets.map((p, i) => (
            <button key={i} onClick={() => setQuery(p)} style={{
              padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: "transparent", color: C.muted, fontSize: 10, cursor: "pointer",
            }}>{p.slice(0, 45)}...</button>
          ))}
        </div>
      </div>

      {error && <div style={{ color: C.rose, fontSize: 12 }}>{error}</div>}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Summary</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{result.summary}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { title: "Key Findings", items: result.findings, color: C.teal },
              { title: "Competitor Insights", items: result.competitors, color: C.rose },
              { title: "Opportunities", items: result.opportunities, color: C.green },
            ].map((s, i) => (
              <div key={i} style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>{s.title}</div>
                {s.items?.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, color: C.mutedMid, marginBottom: 6 }}>
                    <span style={{ color: s.color }}>→</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {result.action && (
            <div style={{ background: C.accentSoft, border: `1px solid ${C.accentGlow}`, borderRadius: 12, padding: 14, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              <strong style={{ color: C.accent }}>Strategic Action: </strong>{result.action}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   BUSINESS SUITE — LIVE AI
   ============================================================ */
function BusinessView() {
  const [activeTool, setActiveTool] = useState("spreadsheet");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const tools = [
    { id: "spreadsheet", label: "AI Spreadsheet", icon: "📊", desc: "Budgets, trackers, plans" },
    { id: "document", label: "Document Creator", icon: "📄", desc: "Proposals, reports, contracts" },
    { id: "invoice", label: "Invoice Generator", icon: "💰", desc: "Professional invoices" },
    { id: "research", label: "Market Research", icon: "🔍", desc: "Business intelligence" },
  ];

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const txt = await askClaude(
        `Create a professional ${activeTool} for: "${prompt}". Return ONLY valid JSON, no other text: {"title": string, "content": string, "summary": string}`
      );
      setResult(JSON.parse(txt));
    } catch (e) {
      setError("Generation failed. Check that the API key is configured in Vercel environment variables.");
    }
    setLoading(false);
  };

  const active = tools.find((t) => t.id === activeTool);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {tools.map((t) => (
          <button key={t.id} onClick={() => setActiveTool(t.id)} style={{
            flex: 1, padding: "12px 10px", borderRadius: 10,
            border: `1px solid ${activeTool === t.id ? C.amber + "55" : C.border}`,
            cursor: "pointer", background: activeTool === t.id ? C.surfaceHigh : C.surfaceHigh,
            color: activeTool === t.id ? C.amber : C.mutedMid, textAlign: "left",
            boxShadow: activeTool === t.id ? `inset 0 0 0 1px ${C.amber}55` : "none",
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{t.label}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{t.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.surfaceHigh, border: `1px solid ${C.amber}33`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{active.icon} {active.label}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{active.desc}</div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe what you need... e.g. "Monthly budget for a small healthcare practice with 3 staff"`}
            style={{
              flex: 1, minHeight: 120, padding: 12, background: C.bg,
              border: `1px solid ${C.border}`, borderRadius: 8, outline: "none",
              resize: "vertical", color: C.text, fontSize: 13, lineHeight: 1.6, fontFamily: "inherit",
            }} />
          <button onClick={generate} disabled={loading || !prompt.trim()} style={{
            width: "100%", padding: "11px 0", borderRadius: 8, border: "none",
            cursor: loading || !prompt.trim() ? "default" : "pointer",
            background: loading || !prompt.trim() ? C.border : `linear-gradient(135deg,${C.amber},${C.fire})`,
            color: loading || !prompt.trim() ? C.muted : "#fff", fontSize: 13, fontWeight: 700,
          }}>{loading ? "Generating..." : "Generate with AI"}</button>
        </div>
        <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Output</div>
          </div>
          <div style={{ padding: 16, minHeight: 260 }}>
            {error && <div style={{ color: C.rose, fontSize: 12 }}>{error}</div>}
            {result && !error ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{result.title}</div>
                <div style={{
                  background: C.bg, borderRadius: 8, padding: 12, fontSize: 12, color: C.mutedMid,
                  lineHeight: 1.7, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap",
                  maxHeight: 200, overflowY: "auto",
                }}>{result.content}</div>
                {result.summary && (
                  <div style={{ fontSize: 12, color: C.amber, background: C.fireSoft, borderRadius: 8, padding: "8px 12px" }}>{result.summary}</div>
                )}
              </div>
            ) : !error && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, gap: 10 }}>
                <span style={{ fontSize: 32 }}>{active.icon}</span>
                <div style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>Describe what you need and AI creates it instantly</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FANTASY CREATOR — LIVE AI, AGE-GATED
   ============================================================ */
/* ============================================================
   FINAL VERSION — paste this in place of your current
   FantasyView function (lines 567–671 in your current App.jsx).
   Includes the original age-gate (13+) confirmation screen,
   PLUS the new image generation panel.
   ============================================================ */

function FantasyView() {
  const [confirmed, setConfirmed] = useState(false);
  const [mode, setMode] = useState("story"); // "story" | "character" | "world"
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  async function handleCreate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const styleMap = {
        story: "Write a short, imaginative fantasy story based on this idea",
        character: "Create a detailed fantasy character profile based on this idea, including appearance, personality, and backstory",
        world: "Design a fantasy world concept based on this idea, including geography, culture, and atmosphere",
      };
      const text = await askClaude(`${styleMap[mode]}: ${prompt}. Keep it appropriate for ages 13+, no graphic violence or mature themes.`);
      setResult(text);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again in a moment.");
    }
    setLoading(false);
  }

  async function handleCreateArt() {
    if (!prompt.trim()) return;
    setImgLoading(true);
    setImgError("");
    setImgUrl("");
    try {
      const artPrompt = `Fantasy digital art of: ${prompt}`;
      const data = await askImage(artPrompt, "vivid");
      setImgUrl(data.imageUrl);
    } catch (e) {
      setImgError(e.message || "Image generation failed. Try again in a moment.");
    }
    setImgLoading(false);
  }

  if (!confirmed) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>✧</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#eee" }}>Fantasy Creator — Ages 13+</div>
        <div style={{ fontSize: 14, color: "#999", maxWidth: 420, lineHeight: 1.6 }}>
          This tool creates AI-generated stories, characters, worlds, and artwork.
          Content is AI-moderated and intended for users 13 years and older.
        </div>
        <button
          onClick={() => setConfirmed(true)}
          style={{
            padding: "12px 28px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #7C5CFC, #FF6B35)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          I am 13 or older — Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 16, color: "#FF6B35", fontWeight: 700 }}>
        ✧ Fantasy Creator — Ages 13+ · AI-Moderated
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["story", "character", "world"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: mode === m ? "2px solid #7C5CFC" : "1px solid #333",
              background: mode === m ? "#7C5CFC22" : "transparent",
              color: mode === m ? "#7C5CFC" : "#ccc",
              cursor: "pointer",
              textTransform: "capitalize",
              fontWeight: 600,
            }}
          >
            {m === "story" ? "📖 Story Writer" : m === "character" ? "⚔️ Character Creator" : "🌍 World Builder"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your idea... e.g. Create me a mystic dragon that is purple and silver with ice blue eyes"
            style={{
              width: "100%",
              minHeight: 160,
              padding: 14,
              borderRadius: 10,
              border: "1px solid #333",
              background: "#111",
              color: "#eee",
              fontSize: 15,
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={handleCreate}
              disabled={loading || !prompt.trim()}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #7C5CFC, #FF6B35)",
                color: "#fff",
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                opacity: loading || !prompt.trim() ? 0.6 : 1,
              }}
            >
              {loading ? "Creating..." : "✨ Create with AI"}
            </button>
            <button
              onClick={handleCreateArt}
              disabled={imgLoading || !prompt.trim()}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #FF6B35",
                background: "transparent",
                color: "#FF6B35",
                fontWeight: 700,
                cursor: imgLoading ? "wait" : "pointer",
                opacity: imgLoading || !prompt.trim() ? 0.6 : 1,
              }}
            >
              {imgLoading ? "Painting..." : "🎨 Create Art"}
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 10, color: "#eee" }}>Your Creation</div>

          {error && (
            <div style={{ color: "#ff6b6b", marginBottom: 12, fontSize: 14 }}>{error}</div>
          )}
          {result && (
            <div
              style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: 10,
                padding: 16,
                whiteSpace: "pre-wrap",
                fontSize: 14,
                lineHeight: 1.6,
                color: "#ddd",
                marginBottom: 16,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              {result}
            </div>
          )}

          {imgError && (
            <div style={{ color: "#ff6b6b", marginBottom: 12, fontSize: 14 }}>{imgError}</div>
          )}
          {imgLoading && (
            <div style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>
              🎨 Bringing your imagination to life... (usually 10-20 seconds)
            </div>
          )}
          {imgUrl && (
            <div>
              <img
                src={imgUrl}
                alt="AI generated fantasy art"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: "1px solid #333",
                }}
              />
              <a
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  color: "#7C5CFC",
                  fontSize: 13,
                }}
              >
                Open full size / save image →
              </a>
            </div>
          )}

          {!result && !imgUrl && !loading && !imgLoading && (
            <div style={{ color: "#666", fontSize: 14 }}>
              Describe your idea, then choose "Create with AI" for the written creation, and/or "Create Art" to see it come to life visually.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function FieryArtistryView() {
  const [category, setCategory] = useState("realistic");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [gallery, setGallery] = useState([]);

  const categories = [
    { id: "realistic",   label: "📷 Realistic",        hint: "Photographic, lifelike" },
    { id: "fantasy",     label: "✨ Fantasy",           hint: "Digital painting, mystical" },
    { id: "anime",       label: "🎌 Anime",             hint: "Manga & anime style" },
    { id: "illustration",label: "🎨 Illustration",      hint: "Flat design, clean lines" },
    { id: "branding",    label: "🏢 Branding & Logos",  hint: "Logo concepts, brand marks" },
    { id: "architecture",label: "🏠 Architecture",      hint: "Interiors, home concepts" },
    { id: "pattern",     label: "🧵 Patterns & Texture",hint: "Repeatable, decorative" },
  ];

  const styleModifiers = {
    realistic: "photorealistic, high detail, natural lighting, professional photography",
    fantasy: "fantasy digital art, painterly, dramatic lighting, imaginative",
    anime: "anime style, manga art, clean line work, vibrant cel-shaded colors",
    illustration: "flat illustration style, clean vector-like lines, modern graphic design",
    branding: "professional logo design, clean and minimal, suitable for branding, vector style, simple background",
    architecture: "architectural visualization, interior design concept, realistic lighting, high quality render",
    pattern: "seamless repeatable pattern, decorative texture, flat design, tileable",
  };

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setImgUrl("");
    try {
      const fullPrompt = `${prompt}. Style: ${styleModifiers[category]}.`;
      const data = await askImage(fullPrompt);
      setImgUrl(data.imageUrl);
      setGallery((prev) => [{ url: data.imageUrl, prompt, category }, ...prev].slice(0, 12));
    } catch (e) {
      setError(e.message || "Something went wrong. Try again in a moment.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 4, color: "#FF6B35", fontWeight: 700, fontSize: 18 }}>
        🔥 Fiery Artistry
      </div>
      <div style={{ marginBottom: 20, color: "#999", fontSize: 14 }}>
        Realistic photos, fantasy art, anime, logos, patterns, interiors — bring anything to life.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            title={c.hint}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: category === c.id ? "2px solid #7C5CFC" : "1px solid #333",
              background: category === c.id ? "#7C5CFC22" : "transparent",
              color: category === c.id ? "#7C5CFC" : "#ccc",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              category === "branding"
                ? "e.g. A modern logo for a coffee roastery called 'Ember & Oak', warm tones"
                : category === "architecture"
                ? "e.g. A cozy 5-bedroom modular farmhouse living room, natural light, warm wood"
                : "Describe what you want to create..."
            }
            style={{
              width: "100%",
              minHeight: 140,
              padding: 14,
              borderRadius: 10,
              border: "1px solid #333",
              background: "#111",
              color: "#eee",
              fontSize: 15,
              resize: "vertical",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "13px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #7C5CFC, #FF6B35)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "wait" : "pointer",
              opacity: loading || !prompt.trim() ? 0.6 : 1,
            }}
          >
            {loading ? "🔥 Igniting your creation..." : "🔥 Create with Fiery Artistry"}
          </button>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 10,
              border: "1px dashed #444",
              background: "#7C5CFC0a",
            }}
          >
            <div style={{ color: "#B06EFF", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              🎬 Animated & Video Creation — Coming Soon
            </div>
            <div style={{ color: "#888", fontSize: 12, lineHeight: 1.6 }}>
              Bring your art to life with motion — animated scenes, short video clips, and
              moving brand assets. This feature is in active development for a future
              DraygonFire release.
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 10, color: "#eee" }}>Your Creation</div>

          {error && (
            <div style={{ color: "#ff6b6b", marginBottom: 12, fontSize: 14 }}>{error}</div>
          )}
          {loading && (
            <div style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>
              🔥 This usually takes 10-20 seconds...
            </div>
          )}
          {imgUrl && (
            <div style={{ marginBottom: 20 }}>
              <img
                src={imgUrl}
                alt="AI generated artwork"
                style={{ width: "100%", borderRadius: 10, border: "1px solid #333" }}
              />
              <a
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-block", marginTop: 10, color: "#7C5CFC", fontSize: 13 }}
              >
                Open full size / save image →
              </a>
            </div>
          )}
          {!imgUrl && !loading && !error && (
            <div style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
              Pick a style above, describe your idea, and watch it come to life.
            </div>
          )}

          {gallery.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, color: "#eee", fontSize: 13 }}>
                Recent Creations
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {gallery.map((item, i) => (
                  <img
                    key={i}
                    src={item.url}
                    alt={item.prompt}
                    title={item.prompt}
                    onClick={() => setImgUrl(item.url)}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #333",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   PLACEHOLDER TABS (shell, not yet wired)
   ============================================================ */
function PlaceholderView({ title, desc, icon, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, textAlign: "center" }}>
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{title}</div>
      <div style={{ fontSize: 13, color: C.muted, maxWidth: 420, lineHeight: 1.6 }}>{desc}</div>
      <Tag label="Coming in a future version" color={color} />
    </div>
  );
}

/* ============================================================
   SAFETY
   ============================================================ */
function SafetyView() {
  const rules = [
    { rule: "No sexual content involving minors — ever, under any circumstances", level: "absolute" },
    { rule: "No content depicting rape, torture, or non-consensual acts", level: "absolute" },
    { rule: "No content usable for grooming or predatory behavior", level: "absolute" },
    { rule: "Age verification required — Fantasy Creator 13+, mature content 18+", level: "required" },
    { rule: "All AI-generated content treated as synthetic media", level: "required" },
    { rule: "DraygonFire never vouches for or certifies third parties (landlords, employers, etc.) — it teaches users what to look for so they can decide for themselves", level: "required" },
    { rule: "Financial and legal information is educational only — never advice, never a guarantee of outcome", level: "required" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: `linear-gradient(135deg,${C.rose}18,${C.accentSoft})`,
        border: `1px solid ${C.rose}44`, borderRadius: 14, padding: 24,
      }}>
        <div style={{ fontSize: 10, color: C.rose, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>
          Non-Negotiable Commitments
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 10 }}>
          Safety & Trust — Built From The Foundation
        </div>
        <div style={{ fontSize: 13, color: C.mutedMid, lineHeight: 1.7, maxWidth: 560 }}>
          DraygonFire was built by a single mother who worked night shifts to protect her family.
          The safety of every user — especially children and people in vulnerable situations —
          is not a feature. It is the foundation everything else is built on.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rules.map((r, i) => {
          const lc = r.level === "absolute" ? C.rose : C.amber;
          return (
            <div key={i} style={{
              background: C.surfaceHigh, border: `1px solid ${lc}33`, borderRadius: 10,
              padding: "13px 18px", display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 1.5 }}>{r.rule}</div>
              <Tag label={r.level === "absolute" ? "ABSOLUTE" : "Required"} color={lc} small />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   ROADMAP
   ============================================================ */
function RoadmapView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 6 }}>From a Small Flame to a Blaze</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Every version adds real capability. v1.5 is what's live and functional today.
          Everything after is the roadmap — vision that gets built one stage at a time,
          the same way DraygonFire itself got built: between night shifts, one piece at a time.
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,${C.fire},transparent)` }} />
        {VERSIONS.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 18, marginBottom: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: v.status === "live" ? `linear-gradient(135deg,${v.color},${v.color}88)` : C.surfaceHigh,
              border: `2px solid ${v.color}`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 900, color: v.status === "live" ? "#fff" : v.color, zIndex: 1,
            }}>{v.v}</div>
            <div style={{
              flex: 1, background: C.surfaceHigh,
              border: `1px solid ${v.status === "live" ? v.color + "44" : C.border}`,
              borderRadius: 12, padding: "14px 18px", marginBottom: 4,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{v.name}</div>
                <StatusBadge status={v.status} />
              </div>
              <div style={{ fontSize: 12, color: C.mutedMid, lineHeight: 1.5 }}>{v.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   FOUNDER'S STATEMENT
   ============================================================ */
function FounderView() {
  const paragraphs = [
    "I built DraygonFire from my heart, and I want you to understand exactly where that heart has been.",
    "I had a village. My mom, my stepdad, my family — they showed up for me the way family does. But even with a village, sometimes there still wasn't enough. Not enough money. Not enough skills or knowledge to find what we needed. Not enough hours in a day. Having people who love you and having access to what you actually need are two different things, and I lived in that gap for a long time.",
    "I've worked more jobs than I can count on one hand — healthcare, retail, bartending, even putting up barbwire fences. I'm a jack of all trades and master of none, and for a long time I thought that meant I never figured out what I was supposed to be. Now I understand it differently. It means I've stood in more rooms than most people ever will. I carry all of that with me.",
    "That's where the idea for this platform was born — not in a boardroom, not from a business degree, but from twenty years of knowing what it feels like to need help and not know how to find it, or where to even look.",
    "I believe we all go through trials and tribulations. And sometimes all it takes is one person, one platform, one small thing showing up at the right moment — something that takes a small flame and turns it into a blaze. Something stronger. Fiercer. I want this platform to be that spark for as many people as it possibly can.",
    "This isn't about giving away every secret or every detail of how something works. It's about being honest. Sincere. Showing integrity and compassion in every part of this — being decent human beings helping other decent human beings.",
    "I'm doing this for me and for my family first — I won't pretend otherwise. But I'm also doing it because throughout my life, wonderful people have shown up for me in moments when I needed it most. This is my way of giving that back.",
    "This is a hand up. It is not pity, and it was never built from pity. I am not here to say \"I'm sorry for you.\" I am here to say: let me help you find the spark that turns negativity into something positive.",
    "That's what DraygonFire is. That's what it has always been, even back when it was just an idea between night shifts in a parking lot.",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 680 }}>
      <div style={{ fontSize: 10, color: C.fire, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px" }}>
        From the Founder
      </div>
      {paragraphs.map((p, i) => (
        <div key={i} style={{ fontSize: 14, color: i === paragraphs.length - 1 ? C.fire : C.mutedMid, lineHeight: 1.8, fontWeight: i === paragraphs.length - 1 ? 700 : 400 }}>
          {p}
        </div>
      ))}
      <div style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>— Lisa Walker Carrington, Founder</div>
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("home");

  const meta = {
    home: { title: "DraygonFire", sub: "The AI operating system for human creativity" },
    templates: { title: "Industry Templates", sub: "Live AI — generates real content for 8 industries" },
    research: { title: "Research", sub: "Live AI — competitive intelligence on demand" },
    business: { title: "Business Suite", sub: "Live AI — spreadsheets, documents, invoices" },
    fantasy: { title: "Fantasy Creator", sub: "Live AI — stories, worlds, characters — ages 13+" },
    create: { title: "Create & Clips", sub: "Video repurposing — roadmap feature" },
    publish: { title: "Publish", sub: "Multi-platform publishing — roadmap feature" },
    progress: { title: "My Progress", sub: "XP, streaks, achievements — roadmap feature" },
    safety: { title: "Safety & Trust", sub: "Non-negotiable protections, built from the foundation" },
    roadmap: { title: "Version Roadmap", sub: "From a small flame to a blaze" },
    founder: { title: "Founder's Statement", sub: "Why DraygonFire exists" },
  }[active] || { title: "DraygonFire", sub: "" };

  return (
    <div style={{
      display: "flex", height: "100vh", background: C.bg,
      fontFamily: "'Inter',-apple-system,sans-serif", color: C.text, overflow: "hidden",
    }}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        textarea::placeholder,input::placeholder{color:${C.muted}}
      `}</style>

      <Sidebar active={active} setActive={setActive} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          padding: "16px 28px", borderBottom: `1px solid ${C.border}`,
          background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{meta.title}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{meta.sub}</div>
          </div>
          <button onClick={() => setActive("templates")} style={{
            padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.accent},${C.fire})`, color: "#fff",
            fontSize: 12, fontWeight: 700,
          }}>🔥 Try It Live</button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "22px 28px" }}>
          {active === "home" && <HomeView setActive={setActive} />}
          {active === "templates" && <TemplatesView />}
          {active === "research" && <ResearchView />}
          {active === "business" && <BusinessView />}
          {active === "fantasy" && <FantasyView />}
          {active === "fiery" && <FieryArtistryView />}
          {active === "create" && <PlaceholderView title="Create & Clips" icon="✦" color={C.accent} desc="Video repurposing — upload a video, get 10+ platform-ready clips with AI captions. Roadmap feature, not yet wired to live processing." />}
          {active === "publish" && <PlaceholderView title="Publish" icon="◎" color={C.green} desc="One-click publishing to every social platform simultaneously. Requires Buffer API integration — roadmap feature." />}
          {active === "progress" && <PlaceholderView title="My Progress" icon="◆" color={C.amber} desc="XP, streaks, achievements, and AI daily digest. Requires a database (Supabase) to persist user data — roadmap feature." />}
          {active === "safety" && <SafetyView />}
          {active === "roadmap" && <RoadmapView />}
          {active === "founder" && <FounderView />}
        </div>
      </main>
    </div>
  );
}
