import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS, RISK_COLORS } from "../../constants/theme";
import { SAMPLE_POINTS, SamplePoint } from "../../constants/sampleData";
import RiskBadge from "../../components/RiskBadge";
import MapDisplay, { animateToSample } from "../../components/MapDisplay";

const { width } = Dimensions.get("window");

export default function MapScreen() {
  const [selectedSample, setSelectedSample] = useState<SamplePoint | null>(null);
  const mapRef = useRef(null);

  const handleMarkerPress = (sample: SamplePoint) => {
    setSelectedSample(sample);
    animateToSample(mapRef, sample);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.mapWrap}>
        <MapDisplay
          samples={SAMPLE_POINTS}
          onMarkerPress={handleMarkerPress}
          mapRef={mapRef}
        />
      </View>

      {/* Legend overlay */}
      <View style={styles.legendOverlay}>
        {(["Low", "Medium", "High", "Critical"] as const).map((level) => (
          <View key={level} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: RISK_COLORS[level] }]} />
            <Text style={styles.legendText}>{level}</Text>
          </View>
        ))}
      </View>

      {/* Bottom sample list (scrollable) */}
      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>
          Sampling Sites ({SAMPLE_POINTS.length})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScroller}
        >
          {SAMPLE_POINTS.map((sample) => (
            <TouchableOpacity
              key={sample.id}
              style={[
                styles.sampleCard,
                { borderTopColor: RISK_COLORS[sample.riskLevel] },
                selectedSample?.id === sample.id && styles.sampleCardActive,
              ]}
              onPress={() => handleMarkerPress(sample)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.sampleId}>{sample.id}</Text>
                <RiskBadge level={sample.riskLevel} />
              </View>
              <Text style={styles.sampleName} numberOfLines={1}>
                {sample.name}
              </Text>
              <Text style={styles.sampleMeta}>
                {sample.bacterialCount} CFU/mL · pH {sample.pH}
              </Text>
              {sample.argsDetected.length > 0 && (
                <Text style={styles.argCount}>
                  {sample.argsDetected.length} ARG{sample.argsDetected.length > 1 ? "s" : ""} detected
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Detail Modal */}
      <Modal
        visible={selectedSample !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSample(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSample && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedSample.name}</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedSample(null)}
                    style={styles.closeBtnWrap}
                  >
                    <Text style={styles.closeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.riskRow}>
                  <RiskBadge level={selectedSample.riskLevel} size="large" />
                  <Text style={styles.sampleIdModal}>{selectedSample.id}</Text>
                </View>

                <View style={styles.detailGrid}>
                  <DetailRow label="Date" value={selectedSample.date} />
                  <DetailRow label="Type" value={selectedSample.sampleType} />
                  <DetailRow label="Bacteria" value={`${selectedSample.bacterialCount} CFU/mL`} />
                  <DetailRow label="pH" value={selectedSample.pH.toString()} />
                  <DetailRow label="Temperature" value={`${selectedSample.temperature}°C`} />
                  <DetailRow label="Turbidity" value={`${selectedSample.turbidity} NTU`} />
                  <DetailRow label="Dissolved O₂" value={`${selectedSample.dissolvedOxygen} mg/L`} />
                  <DetailRow
                    label="Coordinates"
                    value={`${selectedSample.latitude.toFixed(4)}°N, ${Math.abs(selectedSample.longitude).toFixed(4)}°W`}
                  />
                </View>

                <Text style={styles.argsTitle}>
                  Resistance Genes ({selectedSample.argsDetected.length}/7)
                </Text>
                {selectedSample.argsDetected.length > 0 ? (
                  <View style={styles.argsList}>
                    {selectedSample.argsDetected.map((arg) => (
                      <View key={arg} style={styles.argTag}>
                        <Text style={styles.argTagText}>{arg}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noArgs}>
                    No ARGs detected — clean sample ✓
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapWrap: { flex: 1 },

  // Legend
  legendOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, color: COLORS.textLight, fontWeight: "600" },

  // Bottom sheet
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 14,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cardScroller: { paddingHorizontal: 12 },
  sampleCard: {
    backgroundColor: "#FFF",
    width: width * 0.42,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sampleCardActive: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sampleId: { fontSize: 11, fontWeight: "700", color: COLORS.primary },
  sampleName: { fontSize: 13, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  sampleMeta: { fontSize: 11, color: COLORS.textLight },
  argCount: { fontSize: 11, color: COLORS.danger, fontWeight: "600", marginTop: 4 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text, flex: 1, marginRight: 8 },
  closeBtnWrap: { padding: 4 },
  closeBtn: { fontSize: 20, color: COLORS.textLight },
  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sampleIdModal: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  detailGrid: { marginBottom: 16 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailLabel: { fontSize: 13, color: COLORS.textLight },
  detailValue: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  argsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  argsList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  argTag: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  argTagText: { color: "#DC2626", fontWeight: "600", fontSize: 13 },
  noArgs: { color: COLORS.success, fontSize: 14, fontStyle: "italic" },
});
