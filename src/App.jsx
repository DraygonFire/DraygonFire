import { useState } from "react";

const C = {
  bg: "#0A0A0F",
  accent: "#7C5CFC",
  fire: "#FF6B35",
  text: "#E8E8F0",
  muted: "#6B6B8A",
};

export default function App() {
  const [active, setActive] = useState("home");
  const tabs = [
    { id: "home", label: "Home", icon: "◈" },
    { id: "create", label: "Create", icon: "✦" },
    { id: "templates", label: "Templates", icon: "◧" },
    { id: "publish", label: "Publish", icon: "◎" },
    { id: "research", label: "Research", icon: "◉" },
    { id: "business", label: "Business Suite", icon: "▣" },
    { id: "media", label: "Media Studio", icon: "◫" },
    { id: "fantasy", label: "Fantasy Creator", icon: "✧" },
    { id: "integrations", label: "Integrations", icon: "⟐" },
    { id: "progress", label: "My Progress", icon: "◆" },
    { id: "safety", label: "Safety & Trust", icon: "🛡" },
    { id: "roadmap", label: "Roadmap", icon: "◷" },
    { id: "martell", label: "Growth Blueprint", icon: "🔥" },
    { id: "compare", label: "Why DraygonFire", icon: "✕" },
  ];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: C.bg,
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: C.text,
      overflow: "hidden",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 232,
        background: "#111118",
        borderRight: "1px solid #1E1E2E",
        display: "flex",
        flexDirection: "column",
        padding: "0 0 20px",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 16px",
          borderBottom: "1px solid #1E1E2E",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `linear-gradient(135deg,${C.accent},${C.fire})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#fff",
            }}>D</div>
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 900,
                background: `linear-gradient(135deg,${C.accent},${C.fire})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>DraygonFire</div>
              <div style={{ fontSize: 9, color: C.fire, fontWeight: 700, letterSpacing: "1px" }}>
                v1.5 INDUSTRY EDITION
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "10px 8px", flex: 1 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                marginBottom: 1,
                background: active === tab.id ? C.accent + "18" : "transparent",
                color: active === tab.id ? C.accent : C.muted,
                fontSize: 12,
                fontWeight: active === tab.id ? 700 : 500,
                boxShadow: active === tab.id ? `inset 2px 0 0 ${C.accent}` : "none",
              }}
            >
              <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{
          padding: "16px 28px",
          borderBottom: "1px solid #1E1E2E",
          background: "#111118",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>DraygonFire</div>
            <div style={{ fontSize: 11, color: C.muted }}>
              The AI Operating System for Human Creativity — Set your content on fire
            </div>
          </div>
          <button style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(135deg,${C.accent},${C.fire})`,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}>🔥 Create Now</button>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
          <div style={{
            background: `linear-gradient(135deg,${C.accent}18,${C.fire}18)`,
            border: `1px solid ${C.fire}33`,
            borderRadius: 16,
            padding: "48px 40px",
            textAlign: "center",
            maxWidth: 640,
            margin: "0 auto",
          }}>
            <div style={{
              fontSize: 48,
              fontWeight: 900,
              background: `linear-gradient(135deg,${C.accent},${C.fire})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 16,
              letterSpacing: "-2px",
            }}>DraygonFire</div>
            <div style={{
              fontSize: 18,
              color: C.text,
              marginBottom: 12,
              fontWeight: 600,
            }}>Set Your Content On Fire 🔥</div>
            <div style={{
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.7,
              marginBottom: 32,
            }}>
              The AI Operating System for Human Creativity.<br />
              Every tool you need. One platform. On fire.<br /><br />
              Built by Lisa Walker Carrington — CNA, single mother,<br />
              grandmother, and founder — between night shifts in West Texas.
            </div>
            <div style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}>
              {["8 AI Models", "10 Industries", "14 Feature Zones", "All Ages"].map((tag, i) => (
                <span key={i} style={{
                  background: C.accent + "22",
                  color: C.accent,
                  border: `1px solid ${C.accent}44`,
                  borderRadius: 20,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                }}>{tag}</span>
              ))}
            </div>
            <div style={{ marginTop: 40, fontSize: 13, color: C.muted }}>
              Full platform launching soon at draygonfire.com
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
            marginTop: 24,
            maxWidth: 640,
            margin: "24px auto 0",
          }}>
            {[
              { label: "Projects Created", value: "1,247", color: C.accent },
              { label: "Hours Saved", value: "892h", color: C.fire },
              { label: "AI Models Active", value: "8", color: "#22D45E" },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "#1A1A26",
                border: "1px solid #1E1E2E",
                borderRadius: 12,
                padding: "20px",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: stat.color,
                  letterSpacing: "-1px",
                }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
