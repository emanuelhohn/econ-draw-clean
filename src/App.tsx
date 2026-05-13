import { BIPSection } from "./components/BIPSection";
import { ZeichenSection } from "./components/ZeichenSection";
import "@excalidraw/excalidraw/index.css";
import "./App.css";

function TechStack() {
  const items = [
    { name: "React + Vite", desc: "Frontend-Framework und Build-Tool" },
    { name: "TypeScript", desc: "Typsichere Entwicklung" },
    { name: "Excalidraw", desc: "Open-Source Zeichenfläche mit Template-Support" },
    { name: "Chart.js / react-chartjs-2", desc: "Interaktive Datenvisualisierung" },
    { name: "Weltbank API", desc: "Live-Wirtschaftsdaten direkt aus der Quelle" },
    { name: "GitHub Pages", desc: "Kostenloses, serverloses Hosting" },
  ];
  return (
    <div style={{ padding: "2rem", margin: "0 2rem 2rem", background: "#f5f5f3", borderRadius: 10, border: "1px solid #e5e5e5" }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#444", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Technischer Stack</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        {items.map(({ name, desc }) => (
          <div key={name} style={{ background: "#fff", borderRadius: 7, padding: "0.65rem 0.85rem", border: "1px solid #e5e5e5" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-scroll">
      <header className="header">
        <div>
          <h1>Wirtschafts-Lernmaterial mit echtem digitalen Mehrwert</h1>
          <span className="header-sub">Emanuel Hohn</span>
        </div>
      </header>

      <main className="main-content">
        <BIPSection />
        <hr style={{ border: "none", borderTop: "1px solid #e5e5e5", margin: "1rem 2rem" }} />
        <ZeichenSection />
        <hr style={{ border: "none", borderTop: "1px solid #e5e5e5", margin: "1rem 2rem" }} />
        <div style={{ padding: "2rem 2rem 0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weiterführende Überlegungen</h3>
          <p style={{ fontSize: 12, color: "#888", marginBottom: "1rem" }}>Platzhaltertext</p>
          {[
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum semper, sem tortor aliquam nisi, quis egestas quam neque ut quam.",
            "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
          ].map((p, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: "#1a1a1a", marginBottom: "1rem" }}>{p}</p>
          ))}
        </div>
        <TechStack />
      </main>
    </div>
  );
}
