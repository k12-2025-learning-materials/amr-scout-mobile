import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RISK_COLORS } from "../constants/theme";

interface RiskBadgeProps {
  level: string;
  size?: "small" | "large";
}

export default function RiskBadge({ level, size = "small" }: RiskBadgeProps) {
  const color = RISK_COLORS[level] || "#94A3B8";
  const isLarge = size === "large";

  return (
    <View style={[styles.badge, { backgroundColor: color }, isLarge && styles.large]}>
      <Text style={[styles.text, isLarge && styles.largeText]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  largeText: {
    fontSize: 18,
  },
});
