import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { borough, pollutant, imdDecile, monitorCount, clusterType, population, unmeasuredRadius, mode, clusterSummary } = req.body || {};

    let prompt = "";
    if (mode === "borough_critique") {
      prompt = `You are a critical data visualization scholar specializing in urban sensing, critical data studies, and uncertainty visualization (referencing Johanna Drucker, Catherine D'Ignazio, and Helen Kennedy).
Provide a concise, academically grounded, and deeply perceptive critique (3-4 bullet points or short paragraphs, around 150 words) regarding air quality missingness in London's borough: "${borough}".
Context:
- Pollutant analyzed: ${pollutant}
- Active Monitors: ${monitorCount}
- Index of Multiple Deprivation (IMD) Decile: ${imdDecile} (1 = most deprived, 10 = least deprived)
- Estimated Population in Unmeasured Zone: ${population ? population.toLocaleString() : "N/A"}
- Distance to Nearest Active Monitor: ${unmeasuredRadius || "N/A"} km
- Cluster Classification: ${clusterType || "Unmonitored Zone"}

Analyze:
1. Is this missingness Missing Not At Random (MNAR) or Missing At Random (MAR)?
2. How does the spatial absence intersect with socio-economic deprivation (IMD)?
3. Why does the "smooth interpolated map" create an illusion of authoritative knowledge (Drucker's 'capta'), and what lived realities are erased?
Please respond in clear, insightful language (bilingual English and Chinese summary if helpful).`;
    } else if (mode === "clustering_analysis") {
      prompt = `You are an expert data scientist and critical urban visualization researcher.
Analyze the correlation and clustering findings of London's Air Quality Network (LAQN) missingness across 33 boroughs.
Context Cluster Data:
${JSON.stringify(clusterSummary || {}, null, 2)}

Provide a synthesis (around 180 words) covering:
1. The statistical correlation between Borough Deprivation (IMD) and Monitor Density.
2. Why roadside-centric monitoring creates a systematic bias away from residential interiors.
3. Policy & ethical recommendations to address data blind spots rather than hiding them through spatial interpolation.
Please respond in clear, insightful language with markdown formatting.`;
    } else {
      prompt = `Analyze the missingness of ${pollutant} air quality data in London. Provide 3 key critical observations regarding spatial sampling bias and uncertainty representation.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Error generating AI insight:", error);
    return res.status(500).json({
      error: "Failed to generate AI insight",
      message: error?.message || "Unknown error",
    });
  }
}
