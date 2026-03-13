import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";
import { QUIZ_QUESTIONS, FUN_FACTS, BADGES } from "../../constants/quizData";
import QuizCard from "../../components/QuizCard";

export default function LearnScreen() {
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) setScore((s) => s + 1);
      setAnswered((a) => {
        const newAnswered = a + 1;
        if (newAnswered >= QUIZ_QUESTIONS.length) {
          setQuizComplete(true);
        }
        return newAnswered;
      });
    },
    []
  );

  const resetQuiz = () => {
    setScore(0);
    setAnswered(0);
    setQuizStarted(false);
    setQuizComplete(false);
  };

  const nextFact = () => {
    setCurrentFactIndex((i) => (i + 1) % FUN_FACTS.length);
  };

  const earnedBadge = BADGES.filter((b) => score >= b.threshold).pop();

  return (
    <ScrollView style={styles.container}>
      {/* Fun Facts Carousel */}
      <View style={styles.factCard}>
        <Text style={styles.factLabel}>Did You Know?</Text>
        <Text style={styles.factText}>{FUN_FACTS[currentFactIndex]}</Text>
        <TouchableOpacity style={styles.factBtn} onPress={nextFact}>
          <Text style={styles.factBtnText}>Next Fact</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AMR Knowledge Quiz</Text>
        <Text style={styles.sectionSubtitle}>
          Test your knowledge about antimicrobial resistance!
        </Text>

        {!quizStarted ? (
          <View style={styles.startCard}>
            <Text style={styles.startEmoji}>🧪</Text>
            <Text style={styles.startTitle}>{QUIZ_QUESTIONS.length} Questions</Text>
            <Text style={styles.startDesc}>
              Learn about AMR, resistance genes, water quality, and how AI helps fight superbugs!
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => setQuizStarted(true)}>
              <Text style={styles.startBtnText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(answered / QUIZ_QUESTIONS.length) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {answered}/{QUIZ_QUESTIONS.length} | Score: {score}
              </Text>
            </View>

            {/* Quiz Cards */}
            {QUIZ_QUESTIONS.map((q) => (
              <QuizCard key={q.id} question={q} onAnswer={handleAnswer} />
            ))}

            {/* Results */}
            {quizComplete && (
              <View style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>Quiz Complete!</Text>
                <Text style={styles.scoreText}>
                  {score}/{QUIZ_QUESTIONS.length}
                </Text>
                <Text style={styles.percentText}>
                  {((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}% Correct
                </Text>

                {earnedBadge && (
                  <View style={styles.badgeEarned}>
                    <Text style={styles.badgeEmoji}>🏆</Text>
                    <Text style={styles.badgeName}>{earnedBadge.name}</Text>
                    <Text style={styles.badgeDesc}>{earnedBadge.description}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.retryBtn} onPress={resetQuiz}>
                  <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges to Earn</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((badge) => {
            const earned = score >= badge.threshold;
            return (
              <View key={badge.name} style={[styles.badgeCard, earned && styles.badgeCardEarned]}>
                <Text style={styles.badgeCardEmoji}>{earned ? "🏆" : "🔒"}</Text>
                <Text style={[styles.badgeCardName, earned && styles.badgeCardNameEarned]}>
                  {badge.name}
                </Text>
                <Text style={styles.badgeCardDesc}>{badge.description}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  factCard: {
    backgroundColor: "#EFF6FF",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  factLabel: { fontSize: 12, fontWeight: "700", color: "#3B82F6", marginBottom: 8, textTransform: "uppercase" },
  factText: { fontSize: 16, color: COLORS.text, lineHeight: 24, marginBottom: 12 },
  factBtn: { alignSelf: "flex-end", paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#3B82F6", borderRadius: 8 },
  factBtnText: { color: "#FFF", fontWeight: "600", fontSize: 13 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.text, marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  startCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startEmoji: { fontSize: 48, marginBottom: 12 },
  startTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.text, marginBottom: 8 },
  startDesc: { fontSize: 15, color: COLORS.textLight, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  startBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  startBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  progressContainer: { marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: "#E2E8F0", borderRadius: 4, marginBottom: 6 },
  progressFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  progressText: { fontSize: 13, color: COLORS.textLight, textAlign: "right" },
  resultsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultsTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.text, marginBottom: 8 },
  scoreText: { fontSize: 48, fontWeight: "bold", color: COLORS.primary },
  percentText: { fontSize: 18, color: COLORS.textLight, marginBottom: 16 },
  badgeEarned: {
    backgroundColor: "#FEF9C3",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  badgeEmoji: { fontSize: 40, marginBottom: 8 },
  badgeName: { fontSize: 18, fontWeight: "bold", color: "#92400E" },
  badgeDesc: { fontSize: 14, color: "#A16207" },
  retryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  retryBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    width: "47%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeCardEarned: { borderColor: "#F59E0B", backgroundColor: "#FFFBEB" },
  badgeCardEmoji: { fontSize: 28, marginBottom: 6 },
  badgeCardName: { fontSize: 14, fontWeight: "bold", color: COLORS.textLight, textAlign: "center" },
  badgeCardNameEarned: { color: "#92400E" },
  badgeCardDesc: { fontSize: 11, color: COLORS.textLight, textAlign: "center", marginTop: 4 },
});
