const API_BASE = "https://amrscout-api.bicbioeng.org";

export interface AMRPredictionInput {
  bacterial_count: number;
  pH: number;
  temperature: number;
  turbidity: number;
  dissolved_oxygen: number;
  sample_type: "Water" | "Soil" | "Sediment";
}

export interface AMRPredictionResult {
  risk_level: string;
  confidence: number;
  probabilities: Record<string, number>;
  recommendation: string;
}

export interface ARGGeneResult {
  detected: boolean;
  probability: number;
  estimated_concentration: number;
  unit: string;
  description: string;
  clinical_relevance: string;
}

export interface ARGPredictionResult {
  genes: Record<string, ARGGeneResult>;
  summary: {
    total_detected: number;
    total_tested: number;
    arg_risk_level: string;
    multi_drug_resistance: boolean;
  };
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    throw new Error("API unavailable");
  }
}

export async function predictAMR(input: AMRPredictionInput): Promise<AMRPredictionResult> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/predict/amr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("API error");
    return await response.json();
  } catch {
    return mockAMRPrediction(input);
  }
}

export async function predictARG(input: AMRPredictionInput): Promise<ARGPredictionResult> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/predict/arg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("API error");
    return await response.json();
  } catch {
    return mockARGPrediction(input);
  }
}

// Mock predictions when API is unavailable (demo mode)
function mockAMRPrediction(input: AMRPredictionInput): AMRPredictionResult {
  const score =
    (input.bacterial_count / 1000) * 0.3 +
    (14 - input.pH) * 0.1 +
    (input.turbidity / 50) * 0.2 +
    ((10 - input.dissolved_oxygen) / 10) * 0.2 +
    (input.temperature / 30) * 0.1 +
    (input.sample_type === "Sediment" ? 0.1 : input.sample_type === "Soil" ? 0.05 : 0);

  let risk_level: string;
  if (score > 0.7) risk_level = "Critical";
  else if (score > 0.45) risk_level = "High";
  else if (score > 0.2) risk_level = "Medium";
  else risk_level = "Low";

  const recommendations: Record<string, string> = {
    Low: "Water quality appears safe. Continue routine monitoring.",
    Medium: "Some resistance detected. Increase monitoring frequency.",
    High: "Significant AMR detected. Avoid recreational use. Notify health dept.",
    Critical: "CRITICAL: High multi-drug resistance. Contact public health authorities.",
  };

  return {
    risk_level,
    confidence: 0.75 + Math.random() * 0.2,
    probabilities: { Low: 0.1, Medium: 0.25, High: 0.35, Critical: 0.3 },
    recommendation: recommendations[risk_level],
  };
}

function mockARGPrediction(input: AMRPredictionInput): ARGPredictionResult {
  const riskFactor = input.bacterial_count / 5000 + input.turbidity / 100;
  const genes = ["intI1", "sul1", "tetW", "blaTEM", "vanA", "mcr-1", "blaKPC"];
  const thresholds = [0.2, 0.25, 0.3, 0.35, 0.5, 0.6, 0.55];
  const descriptions = [
    "Class 1 integron (pollution marker)",
    "Sulfonamide resistance",
    "Tetracycline resistance",
    "Beta-lactam resistance",
    "Vancomycin resistance",
    "Colistin resistance (last resort)",
    "Carbapenem resistance",
  ];

  const result: Record<string, ARGGeneResult> = {};
  let detected = 0;

  genes.forEach((gene, i) => {
    const prob = Math.min(0.99, riskFactor / thresholds[i]);
    const isDetected = prob > 0.5;
    if (isDetected) detected++;
    result[gene] = {
      detected: isDetected,
      probability: Math.round(prob * 100) / 100,
      estimated_concentration: isDetected ? Math.round(riskFactor * 100 * (1 - thresholds[i])) : 0,
      unit: "molecules/mL",
      description: descriptions[i],
      clinical_relevance: i >= 4 ? "HIGH" : i >= 3 ? "MODERATE" : "STANDARD",
    };
  });

  return {
    genes: result,
    summary: {
      total_detected: detected,
      total_tested: 7,
      arg_risk_level: detected >= 5 ? "Critical" : detected >= 3 ? "High" : detected >= 1 ? "Medium" : "Low",
      multi_drug_resistance: detected >= 3,
    },
  };
}
