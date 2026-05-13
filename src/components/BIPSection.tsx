import { useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useBIPData } from "../hooks/useBIPData";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

function KPICard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: "#f5f5f3", borderRadius: 8, padding: "0.85rem 1rem",
    }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function BIPSection() {
  const data = useBIPData();
  const [fromYear, setFromYear] = useState("2000");
  const [toYear, setToYear] = useState("");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [unit, setUnit] = useState<"bn" | "tr">("bn");
  const initialized = useRef(false);

  useEffect(() => {
    if (data.timeseries.length && !initialized.current) {
      setToYear(data.timeseries[data.timeseries.length - 1].year);
      initialized.current = true;
    }
  }, [data.timeseries]);

  const divisor = unit === "bn" ? 1e9 : 1e12;
  const unitLabel = unit === "bn" ? " Mrd." : " Bio.";

  const allLabels = data.timeseries.map(d => d.year);
  const allValues = data.timeseries.map(d => parseFloat((d.value / 1e9).toFixed(1)));

  const filtered = data.timeseries.filter(
    d => parseInt(d.year) >= parseInt(fromYear) && parseInt(d.year) <= parseInt(toYear || "9999")
  );
  const filteredLabels = filtered.map(d => d.year);
  const filteredValues = filtered.map(d => parseFloat((d.value / divisor).toFixed(unit === "bn" ? 1 : 3)));

  const chartOptions = (yLabel: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c: { parsed: { y: number } }) => ` ${c.parsed.y.toFixed(unit === "bn" ? 1 : 3)}${unitLabel} USD` } },
    },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 10, font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" } },
      y: { ticks: { font: { size: 11 }, callback: (v: number | string) => `${v}${yLabel}` }, grid: { color: "rgba(0,0,0,0.05)" } },
    },
  });

  if (data.loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#888", fontSize: 14 }}>
        Lade Daten von der Weltbank…
      </div>
    );
  }

  if (data.error) {
    return (
      <div style={{ padding: "2rem", color: "#c0392b", fontSize: 14 }}>
        Fehler beim Laden: {data.error}
      </div>
    );
  }

  const years = data.timeseries.map(d => d.year);

  return (
    <div style={{ padding: "2rem 2rem 0" }}>

      {/* Titel */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Schweizer Volkswirtschaft</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: "1.5rem" }}>
        Daten live von der Weltbank API · Indikator: NY.GDP.MKTP.CD
      </p>

      {/* KPI Karten */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <KPICard
          label="BIP aktuell"
          value={`${(data.latestGDP / 1e9).toFixed(1)} Mrd. USD`}
          sub={data.latestYear}
        />
        <KPICard
          label="BIP pro Kopf"
          value={`${Math.round(data.perCap).toLocaleString("de-CH")} USD`}
        />
        <KPICard
          label="Wachstum"
          value={`${data.growth > 0 ? "+" : ""}${data.growth.toFixed(1)}%`}
          sub="gegenüber Vorjahr"
        />
        <KPICard
          label="Einwohner"
          value={`${(data.population / 1e6).toFixed(2)} Mio.`}
        />
      </div>

      {/* Statische Grafik */}
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>BIP Zeitreihe (statisch)</h3>
      <p style={{ fontSize: 12, color: "#888", marginBottom: "1rem" }}>Bruttoinlandprodukt in Mrd. USD · Quelle: Weltbank</p>
      <div style={{ height: 240, marginBottom: "0.5rem" }}>
        <Line
          data={{
            labels: allLabels,
            datasets: [{
              label: "BIP (Mrd. USD)",
              data: allValues,
              borderColor: "#185FA5",
              backgroundColor: "rgba(24,95,165,0.08)",
              borderWidth: 2,
              pointRadius: 2,
              fill: true,
              tension: 0.3,
            }],
          }}
          options={chartOptions(" Mrd.") as Parameters<typeof Line>[0]["options"]}
        />
      </div>
      <p style={{ fontSize: 11, color: "#aaa", marginBottom: "2rem" }}>
        Weltbank, NY.GDP.MKTP.CD · Letzter Datenpunkt: {data.latestYear}
      </p>

      {/* Interaktive Grafik */}
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>BIP interaktiv erkunden</h3>
      <p style={{ fontSize: 12, color: "#888", marginBottom: "1rem" }}>Passe Zeitraum und Darstellung an</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: "1rem", padding: "0.75rem 1rem", background: "#f5f5f3", borderRadius: 8 }}>
        {[
          { label: "Von", el: <select value={fromYear} onChange={e => setFromYear(e.target.value)} style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd" }}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select> },
          { label: "Bis", el: <select value={toYear} onChange={e => setToYear(e.target.value)} style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd" }}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select> },
          { label: "Darstellung", el: <select value={chartType} onChange={e => setChartType(e.target.value as "line" | "bar")} style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd" }}><option value="line">Linie</option><option value="bar">Balken</option></select> },
          { label: "Einheit", el: <select value={unit} onChange={e => setUnit(e.target.value as "bn" | "tr")} style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd" }}><option value="bn">Mrd. USD</option><option value="tr">Bio. USD</option></select> },
        ].map(({ label, el }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, color: "#888" }}>{label}</label>
            {el}
          </div>
        ))}
      </div>

      <div style={{ height: 240, marginBottom: "0.5rem" }}>
        {chartType === "line" ? (
          <Line
            data={{
              labels: filteredLabels,
              datasets: [{
                label: "BIP",
                data: filteredValues,
                borderColor: "#0F6E56",
                backgroundColor: "rgba(15,110,86,0.08)",
                borderWidth: 2,
                pointRadius: 3,
                fill: true,
                tension: 0.3,
              }],
            }}
            options={chartOptions(unitLabel) as Parameters<typeof Line>[0]["options"]}
          />
        ) : (
          <Bar
            data={{
              labels: filteredLabels,
              datasets: [{
                label: "BIP",
                data: filteredValues,
                backgroundColor: "rgba(15,110,86,0.65)",
                borderWidth: 0,
              }],
            }}
            options={chartOptions(unitLabel) as Parameters<typeof Bar>[0]["options"]}
          />
        )}
      </div>
      <p style={{ fontSize: 11, color: "#aaa", marginBottom: "2rem" }}>
        {filtered.length} Datenpunkte · Weltbank, NY.GDP.MKTP.CD
      </p>

      {/* Lorem ipsum */}
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem" }}>Hintergrund und Kontext</h3>
      {[
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum semper, sem tortor aliquam nisi, quis egestas quam neque ut quam.",
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in, egestas eget quam.",
      ].map((p, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: "#1a1a1a", marginBottom: "1rem" }}>{p}</p>
      ))}

    </div>
  );
}
