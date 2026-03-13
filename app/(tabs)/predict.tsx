import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS, RISK_COLORS } from "../../constants/theme";
import { predictAMR, predictARG, AMRPredictionResult, ARGPredictionResult } from "../../services/api";
import RiskBadge from "../../components/RiskBadge";

export default function PredictScreen() {
  const [bacterialCount, setBacterialCount] = useState("500");
  const [pH, setPH] = useState("7.0");
  const [temperature, setTemperature] = useState("15.0");
  const [turbidity, setTurbidity] = useState("10.0");
  const [dissolvedOxygen, setDissolvedOxygen] = useState("7.0");
  const [sampleType, setSampleType] = useState<"Water" | "Soil" | "Sediment">("Water");
  const [loading, setLoading] = useState(false);
  const [amrResult, setAmrResult] = useState<AMRPredictionResult | null>(null);
  const [argResult, setArgResult] = useState<ARGPredictionResult | null>(null);

  const getInput = () => ({
    bacterial_count: parseFloat(bacterialCount) || 0,
    pH: parseFloat(pH) || 7.0,
    temperature: parseFloat(temperature) || 15.0,
    turbidity: parseFloat(turbidity) || 5.0,
    dissolved_oxygen: parseFloat(dissolvedOxygen) || 7.0,
    sample_type: sampleType,
  });

  const handlePredictAMR = async () => {
    setLoading(true);
    setAmrResult(null);
    setArgResult(null);
    try {
      const result = await predictAMR(getInput());
      setAmrResult(result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handlePredictARG = async () => {
    setLoading(true);
    setArgResult(null);
    try {
      const result = await predictARG(getInput());
      setArgResult(result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sample Parameters</Text>

        <InputField label="Bacterial Count (CFU/mL)" value={bacterialCount} onChange={setBacterialCount} />
        <InputField label="pH Level" value={pH} onChange={setPH} />
        <InputField label="Temperature (°C)" value={temperature} onChange={setTemperature} />
        <InputField label="Turbidity (NTU)" value={turbidity} onChange={setTurbidity} />
        <InputField label="Dissolved Oxygen (mg/L)" value={dissolvedOxygen} onChange={setDissolvedOxygen} />

        <Text style={styles.label}>Sample Type</Text>
        <View style={styles.typeRow}>
          {(["Water", "Soil", "Sediment"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, sampleType === type && styles.typeBtnActive]}
              onPress={() => setSampleType(type)}
            >
              <Text style={[styles.typeBtnText, sampleType === type && styles.typeBtnTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.predictBtn} onPress={handlePredictAMR} disabled={loading}>
            <Text style={styles.predictBtnText}>Predict AMR Risk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.predictBtn, styles.predictBtnAlt]}
            onPress={handlePredictARG}
            disabled={loading}
          >
            <Text style={styles.predictBtnText}>Predict ARGs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Analyzing sample...</Text>
        </View>
      )}

      {amrResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>AMR Risk Assessment</Text>
          <View style={styles.riskDisplay}>
            <RiskBadge level={amrResult.risk_level} size="large" />
            <Text style={styles.confidence}>
              Confidence: {(amrResult.confidence * 100).toFixed(1)}%
            </Text>
          </View>

          <Text style={styles.probTitle}>Risk Probabilities</Text>
          {Object.entries(amrResult.probabilities).map(([level, prob]) => (
            <View key={level} style={styles.probRow}>
              <Text style={styles.probLabel}>{level}</Text>
              <View style={styles.probBarBg}>
                <View
                  style={[
                    styles.probBar,
                    {
                      width: `${(prob as number) * 100}%`,
                      backgroundColor: RISK_COLORS[level] || "#94A3B8",
                    },
                  ]}
                />
              </View>
              <Text style={styles.probValue}>{((prob as number) * 100).toFixed(1)}%</Text>
            </View>
          ))}

          <View style={styles.recommendation}>
            <Text style={styles.recTitle}>Recommendation</Text>
            <Text style={styles.recText}>{amrResult.recommendation}</Text>
          </View>
        </View>
      )}

      {argResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>ARG Detection Results</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {argResult.summary.total_detected}/{argResult.summary.total_tested} genes detected
            </Text>
            <RiskBadge level={argResult.summary.arg_risk_level} />
          </View>
          {argResult.summary.multi_drug_resistance && (
            <View style={styles.mdrWarning}>
              <Text style={styles.mdrText}>Multi-Drug Resistance Detected</Text>
            </View>
          )}

          {Object.entries(argResult.genes).map(([gene, info]) => (
            <View key={gene} style={[styles.geneRow, info.detected && styles.geneDetected]}>
              <View style={styles.geneHeader}>
                <Text style={[styles.geneName, info.detected && styles.geneNameDetected]}>
                  {gene}
                </Text>
                <Text style={[styles.geneStatus, { color: info.detected ? COLORS.danger : COLORS.success }]}>
                  {info.detected ? "DETECTED" : "Not Detected"}
                </Text>
              </View>
              <Text style={styles.geneDesc}>{info.description}</Text>
              <View style={styles.geneProbRow}>
                <View style={styles.probBarBg}>
                  <View
                    style={[
                      styles.probBar,
                      {
                        width: `${info.probability * 100}%`,
                        backgroundColor: info.detected ? COLORS.danger : COLORS.success,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.probValue}>{(info.probability * 100).toFixed(0)}%</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  typeBtnText: { fontWeight: "600", color: COLORS.textLight },
  typeBtnTextActive: { color: COLORS.primaryDark },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  predictBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  predictBtnAlt: { backgroundColor: "#7C3AED" },
  predictBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  loadingCard: {
    alignItems: "center",
    padding: 24,
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  loadingText: { marginTop: 12, color: COLORS.textLight, fontSize: 15 },
  resultCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginBottom: 16 },
  riskDisplay: { alignItems: "center", marginBottom: 20 },
  confidence: { marginTop: 8, fontSize: 16, color: COLORS.textLight },
  probTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  probRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 8 },
  probLabel: { width: 60, fontSize: 13, color: COLORS.textLight },
  probBarBg: { flex: 1, height: 12, backgroundColor: "#F1F5F9", borderRadius: 6 },
  probBar: { height: 12, borderRadius: 6 },
  probValue: { width: 45, fontSize: 12, color: COLORS.textLight, textAlign: "right" },
  recommendation: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  recTitle: { fontWeight: "bold", color: COLORS.text, marginBottom: 4 },
  recText: { color: COLORS.textLight, lineHeight: 20 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryText: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  mdrWarning: {
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  mdrText: { color: "#DC2626", fontWeight: "bold", textAlign: "center" },
  geneRow: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  geneDetected: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA" },
  geneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  geneName: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  geneNameDetected: { color: COLORS.danger },
  geneStatus: { fontSize: 12, fontWeight: "700" },
  geneDesc: { fontSize: 12, color: COLORS.textLight, marginBottom: 6 },
  geneProbRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});
