import { useState, useEffect } from "react";

export interface BIPDataPoint {
  year: string;
  value: number;
}

export interface BIPData {
  timeseries: BIPDataPoint[];
  latestGDP: number;
  latestYear: string;
  perCap: number;
  growth: number;
  population: number;
  loading: boolean;
  error: string | null;
}

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

export function useBIPData(): BIPData {
  const [data, setData] = useState<BIPData>({
    timeseries: [],
    latestGDP: 0,
    latestYear: "",
    perCap: 0,
    growth: 0,
    population: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [gdpJson, perCapJson, popJson] = await Promise.all([
          fetchJSON("https://api.worldbank.org/v2/country/CH/indicator/NY.GDP.MKTP.CD?format=json&per_page=60&mrv=60"),
          fetchJSON("https://api.worldbank.org/v2/country/CH/indicator/NY.GDP.PCAP.CD?format=json&per_page=5&mrv=5"),
          fetchJSON("https://api.worldbank.org/v2/country/CH/indicator/SP.POP.TOTL?format=json&per_page=5&mrv=5"),
        ]);

        const series: BIPDataPoint[] = gdpJson[1]
          .filter((d: { value: number | null }) => d.value !== null)
          .sort((a: { date: string }, b: { date: string }) => parseInt(a.date) - parseInt(b.date))
          .map((d: { date: string; value: number }) => ({ year: d.date, value: d.value }));

        const latest = series[series.length - 1];
        const prev = series[series.length - 2];
        const growth = ((latest.value - prev.value) / prev.value) * 100;
        const perCap = perCapJson[1].filter((d: { value: number | null }) => d.value !== null)[0].value;
        const pop = popJson[1].filter((d: { value: number | null }) => d.value !== null)[0].value;

        setData({
          timeseries: series,
          latestGDP: latest.value,
          latestYear: latest.year,
          perCap,
          growth,
          population: pop,
          loading: false,
          error: null,
        });
      } catch (e) {
        setData(prev => ({ ...prev, loading: false, error: String(e) }));
      }
    }
    load();
  }, []);

  return data;
}
