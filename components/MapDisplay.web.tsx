import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RISK_COLORS } from "../constants/theme";
import { SamplePoint } from "../constants/sampleData";

interface MapDisplayProps {
  samples: SamplePoint[];
  onMarkerPress: (sample: SamplePoint) => void;
  mapRef: React.RefObject<any>;
}

export default function MapDisplay({ samples, onMarkerPress }: MapDisplayProps) {
  return (
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapTitle}>AMR Sampling Map — Rapid City, SD</Text>
      <Text style={styles.mapCoords}>44.08°N, 103.23°W</Text>
      {samples.map((sample) => {
        const x = ((sample.longitude + 103.3) / 0.15) * 100;
        const y = ((44.12 - sample.latitude) / 0.08) * 100;
        return (
          <TouchableOpacity
            key={sample.id}
            style={[
              styles.mapPin,
              {
                left: `${Math.max(5, Math.min(90, x))}%` as any,
                top: `${Math.max(10, Math.min(85, y))}%` as any,
                backgroundColor: RISK_COLORS[sample.riskLevel],
              },
            ]}
            onPress={() => onMarkerPress(sample)}
          >
            <Text style={styles.pinText}>{sample.id.split("-")[1]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function animateToSample(_mapRef: React.RefObject<any>, _sample: SamplePoint) {
  // No-op on web
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#E0F2FE",
    position: "relative",
  },
  mapTitle: {
    position: "absolute",
    top: 12,
    left: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#0369A1",
    zIndex: 10,
  },
  mapCoords: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 11,
    color: "#0369A1",
    zIndex: 10,
  },
  mapPin: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    zIndex: 5,
  },
  pinText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
});
