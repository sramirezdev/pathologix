import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";

const DEMO_QUESTION = {
  text: "¿Cuál es el código CIE-10 para Diabetes mellitus tipo 2?",
  options: ["E11", "E10", "E14", "E13"],
  correctIndex: 0,
  explanation: "E11 corresponde a Diabetes mellitus tipo 2. E10 es el código para tipo 1 (insulinodependiente).",
};

export default function QuestionScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.mode}>Modo: {mode}</Text>
      <Text style={styles.progress}>Pregunta 1 / 10</Text>
      <Text style={styles.question}>{DEMO_QUESTION.text}</Text>
      {DEMO_QUESTION.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={styles.option}
          onPress={() => router.push({ pathname: "/game/result", params: { score: 10, correct: 1, total: 10 } })}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: 60 },
  mode: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm, textTransform: "uppercase" },
  progress: { fontSize: 14, color: colors.primary, marginBottom: spacing.lg },
  question: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: spacing.xl, lineHeight: 28 },
  option: { backgroundColor: colors.surfaceAlt, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  optionText: { fontSize: 16, color: colors.text, fontWeight: "500" },
});
