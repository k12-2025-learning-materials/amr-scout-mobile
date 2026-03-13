import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🔬</Text>
        <Text style={styles.heroTitle}>AMR-Scout</Text>
        <Text style={styles.heroSubtitle}>
          AI-Powered Multi-Platform System for Mapping, Predicting, and Teaching
          Antimicrobial Resistance in South Dakota
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About This Project</Text>
        <Text style={styles.cardText}>
          AMR-Scout was developed as a K-12 science fair project to address
          antimicrobial resistance (AMR) in Rapid City, SD waterways. The system
          uses machine learning (Random Forest) to predict AMR risk levels and
          antibiotic resistance gene (ARG) presence from environmental samples.
        </Text>
        <Text style={styles.cardText}>
          In January 2026, our team collected soil and water samples from parks,
          waterways, and urban areas on a biweekly schedule, learning aseptic
          sampling, GPS georeferencing, and proper sample preservation.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Components</Text>
        <View style={styles.component}>
          <Text style={styles.componentIcon}>📱</Text>
          <View style={styles.componentInfo}>
            <Text style={styles.componentName}>Mobile App (This App)</Text>
            <Text style={styles.componentDesc}>
              Interactive AMR map, Random Forest prediction tool, and gamified learning module
            </Text>
          </View>
        </View>
        <View style={styles.component}>
          <Text style={styles.componentIcon}>🌐</Text>
          <View style={styles.componentInfo}>
            <Text style={styles.componentName}>Decision Support Tool</Text>
            <Text style={styles.componentDesc}>
              Web dashboard with visualizations, data explorer, and educational resources
            </Text>
          </View>
        </View>
        <View style={styles.component}>
          <Text style={styles.componentIcon}>🤖</Text>
          <View style={styles.componentInfo}>
            <Text style={styles.componentName}>AI Prediction Model</Text>
            <Text style={styles.componentDesc}>
              Python/Flask API with Random Forest models for AMR risk and ARG prediction
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Sources</Text>
        <DataSourceItem
          name="EPA NRSA 2013-2014 ARG Dataset"
          desc="Antimicrobial resistance gene data from national rivers and streams"
          url="https://catalog.data.gov/dataset/nrsa-2013-2014-arg-dataset"
        />
        <DataSourceItem
          name="NCBI NDARO"
          desc="National Database of Antibiotic Resistant Organisms"
          url="https://www.ncbi.nlm.nih.gov/pathogens/antimicrobial-resistance/"
        />
        <DataSourceItem
          name="CARD Database"
          desc="Comprehensive Antibiotic Resistance Database"
          url="https://card.mcmaster.ca/"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricBox label="Bacterial Abundance" unit="CFU/mL" />
          <MetricBox label="ARG Concentration" unit="gene copies/mL" />
          <MetricBox label="Prediction Accuracy" unit="%" />
          <MetricBox label="Genes Tested" unit="7 ARGs" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Engineering Category</Text>
        <Text style={styles.category}>Materials and Bioengineering</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function DataSourceItem({ name, desc, url }: { name: string; desc: string; url: string }) {
  return (
    <TouchableOpacity style={styles.dataSource} onPress={() => Linking.openURL(url)}>
      <Text style={styles.dsName}>{name}</Text>
      <Text style={styles.dsDesc}>{desc}</Text>
      <Text style={styles.dsLink}>View Source</Text>
    </TouchableOpacity>
  );
}

function MetricBox({ label, unit }: { label: string; unit: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricUnit}>{unit}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    backgroundColor: COLORS.primary,
    padding: 32,
    alignItems: "center",
  },
  heroEmoji: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: "bold", color: "#FFF", marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: "#CCFBF1", textAlign: "center", lineHeight: 20 },
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text, marginBottom: 12 },
  cardText: { fontSize: 14, color: COLORS.textLight, lineHeight: 22, marginBottom: 8 },
  component: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  componentIcon: { fontSize: 28, marginRight: 12, marginTop: 2 },
  componentInfo: { flex: 1 },
  componentName: { fontSize: 15, fontWeight: "600", color: COLORS.text, marginBottom: 2 },
  componentDesc: { fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  dataSource: {
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  dsName: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  dsDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  dsLink: { fontSize: 12, color: COLORS.primary, marginTop: 4, fontWeight: "600" },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricBox: {
    width: "47%",
    backgroundColor: "#F0FDFA",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  metricUnit: { fontSize: 16, fontWeight: "bold", color: COLORS.primary, marginBottom: 4 },
  metricLabel: { fontSize: 12, color: COLORS.textLight, textAlign: "center" },
  category: { fontSize: 16, color: COLORS.primary, fontWeight: "600", fontStyle: "italic" },
});
