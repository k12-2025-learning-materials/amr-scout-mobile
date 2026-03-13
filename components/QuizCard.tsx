import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
import { QuizQuestion } from "../constants/quizData";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    onAnswer(index === question.correctIndex);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question.question}</Text>
      {question.options.map((option, index) => {
        let optionStyle = styles.option;
        let textStyle = styles.optionText;

        if (answered) {
          if (index === question.correctIndex) {
            optionStyle = { ...styles.option, ...styles.correct };
            textStyle = { ...styles.optionText, color: "#FFFFFF" };
          } else if (index === selected && index !== question.correctIndex) {
            optionStyle = { ...styles.option, ...styles.wrong };
            textStyle = { ...styles.optionText, color: "#FFFFFF" };
          }
        } else if (index === selected) {
          optionStyle = { ...styles.option, ...styles.selected };
        }

        return (
          <TouchableOpacity
            key={index}
            style={optionStyle}
            onPress={() => handleSelect(index)}
            disabled={answered}
          >
            <Text style={textStyle}>
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        );
      })}
      {answered && (
        <View style={styles.explanation}>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 26,
  },
  option: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  correct: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  wrong: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
  },
  explanation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F0FDFA",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});
