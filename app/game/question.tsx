import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";
import { fetchQuestions, Question } from "../../src/services/questions";
import { useGameSession } from "../../src/hooks/useGameSession";

export default function QuestionScreen() {
  const router = useRouter();
  const { mode, category } = useLocalSearchParams<{ mode: string; category?: string }>();
  const [loading, setLoading] = useState(true);
  const { state, loadQuestions, answerQuestion, nextQuestion, getResult } = useGameSession(mode as any);

  useEffect(() => {
    fetchQuestions(category, 10)
      .then(qs => {
        if (qs.length === 0) {
          // Sin preguntas aún — usar demo
          loadQuestions([{
            id: "demo",
            text: "¿Cuál es el código CIE-10 para Diabetes mellitus tipo 2?",
            options: ["E11", "E10", "E14", "E13"],
            correctIndex: 0,
            explanation: "E11 corresponde a Diabetes mellitus tipo 2. E10 es el código para tipo 1 (insulinodependiente).",
            category: "cie10",
            difficulty: "facil",
            status: "aprobada",
            authorId: "system",
            authorName: "Sistema",
            votes: { up: 0, down: 0 },
            reportCount: 0,
            createdAt: null,
          }]);
        } else {
          loadQuestions(qs);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (state.isFinished) {
      const result = getResult();
      router.replace({
        pathname: "/game/result",
        params: {
          score: result.score,
          correct: result.correct,
          total: result.total,
          xpEarned: result.xpEarned,
          maxCombo: result.maxCombo,
        },
      });
    }
  }, [state.isFinished]);

  if (loading || state.questions.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  const current = state.questions[state.currentIndex];
  const progress = (state.currentIndex + 1) / state.questions.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{state.currentIndex + 1} / {state.questions.length}</Text>
        <Text style={styles.score}>⭐ {state.score}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Combo badge */}
      {state.combo >= 3 && (
        <View style={styles.comboBadge}>
          <Text style={styles.comboText}>🔥 Combo x{state.combo}</Text>
        </View>
      )}

      {/* Pregunta */}
      <Text style={styles.category}>{current.category.toUpperCase()} · {current.difficulty}</Text>
      <Text style={styles.question}>{current.text}</Text>

      {/* Opciones */}
      {current.options.map((opt, i) => {
        let bgColor = colors.surfaceAlt;
        let borderColor = colors.border;
        if (state.selectedIndex !== null) {
          if (i === current.correctIndex) { bgColor = colors.success + "33"; borderColor = colors.success; }
          else if (i === state.selectedIndex && i !== current.correctIndex) { bgColor = colors.error + "33"; borderColor = colors.error; }
        }
        return (
          <TouchableOpacity
            key={i}
            style={[styles.option, { backgroundColor: bgColor, borderColor }]}
            onPress={() => state.selectedIndex === null && answerQuestion(i)}
            disabled={state.selectedIndex !== null}
          >
            <Text style={styles.optionLetter}>{["A", "B", "C", "D"][i]}</Text>
            <Text style={styles.optionText}>{opt}</Text>
            {state.selectedIndex !== null && i === current.correctIndex && (
              <Text style={styles.optionIcon}>✓</Text>
            )}
            {state.selectedIndex === i && i !== current.correctIndex && (
              <Text style={styles.optionIcon}>✗</Text>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Explicación */}
      {state.showExplanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>
            {state.selectedIndex === current.correctIndex ? "✅ ¡Correcto!" : "❌ Incorrecto"}
          </Text>
          <Text style={styles.explanationText}>{current.explanation}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
            <Text style={styles.nextBtnText}>
              {state.currentIndex === state.questions.length - 1 ? "Ver resultado →" : "Siguiente →"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 50 },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.textSecondary, marginTop: spacing.md },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  backBtn: { color: colors.textSecondary, fontSize: 18 },
  counter: { color: colors.textSecondary, fontSize: 14 },
  score: { color: colors.xpBar, fontWeight: "700" },
  progressBg: { height: 4, backgroundColor: colors.surface, borderRadius: 2, marginBottom: spacing.md },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  comboBadge: { backgroundColor: colors.warning + "22", borderWidth: 1, borderColor: colors.warning, borderRadius: radius.xl, paddingVertical: 4, paddingHorizontal: spacing.md, alignSelf: "flex-start", marginBottom: spacing.sm },
  comboText: { color: colors.warning, fontWeight: "700", fontSize: 13 },
  category: { fontSize: 11, color: colors.textSecondary, letterSpacing: 1, marginBottom: spacing.sm },
  question: { fontSize: 20, fontWeight: "700", color: colors.text, lineHeight: 28, marginBottom: spacing.lg },
  option: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1.5 },
  optionLetter: { color: colors.textSecondary, fontWeight: "700", marginRight: spacing.md, fontSize: 14 },
  optionText: { flex: 1, color: colors.text, fontSize: 15 },
  optionIcon: { fontSize: 18, marginLeft: spacing.sm },
  explanationBox: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border },
  explanationTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  explanationText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  nextBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  nextBtnText: { color: colors.text, fontWeight: "700", fontSize: 15 },
});
