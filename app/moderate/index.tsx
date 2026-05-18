import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";
import { fetchPendingQuestions, approveQuestion, rejectQuestion, Question } from "../../src/services/questions";
import { useUserStore } from "../../src/store/useUserStore";
import { canModerate } from "../../src/services/auth";

export default function ModerateScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!user || !canModerate(user.role)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🔒</Text>
        <Text style={styles.errorText}>Solo moderadores pueden acceder aquí.</Text>
      </View>
    );
  }

  useEffect(() => {
    fetchPendingQuestions().then(qs => { setQuestions(qs); setLoading(false); });
  }, []);

  const handleApprove = async () => {
    const q = questions[current];
    await approveQuestion(q.id, user.uid);
    Alert.alert("✅ Aprobada", "La pregunta fue aprobada y el autor recibió +30 XP.");
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else setQuestions([]);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return Alert.alert("Error", "Escribe el motivo del rechazo.");
    const q = questions[current];
    await rejectQuestion(q.id, user.uid, rejectReason);
    setRejectReason(""); setShowRejectInput(false);
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else setQuestions([]);
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color={colors.primary} /></View>;

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🎉</Text>
        <Text style={styles.emptyText}>No hay preguntas pendientes</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backLink}>← Volver</Text></TouchableOpacity>
      </View>
    );
  }

  const q = questions[current];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>← Volver</Text></TouchableOpacity>
        <Text style={styles.counter}>Pendientes: {questions.length - current}</Text>
      </View>

      <Text style={styles.label}>DE: {q.authorName} · {q.category} · {q.difficulty}</Text>
      <Text style={styles.question}>{q.text}</Text>

      {q.options.map((opt, i) => (
        <View key={i} style={[styles.option, i === q.correctIndex && styles.optionCorrect]}>
          <Text style={styles.optionLetter}>{["A","B","C","D"][i]}</Text>
          <Text style={styles.optionText}>{opt}</Text>
          {i === q.correctIndex && <Text>✓</Text>}
        </View>
      ))}

      <View style={styles.explanationBox}>
        <Text style={styles.explanationTitle}>Explicación:</Text>
        <Text style={styles.explanationText}>{q.explanation}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
          <Text style={styles.approveBtnText}>✅ Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => setShowRejectInput(true)}>
          <Text style={styles.rejectBtnText}>❌ Rechazar</Text>
        </TouchableOpacity>
      </View>

      {showRejectInput && (
        <View style={styles.rejectBox}>
          <Text style={styles.label}>Motivo del rechazo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Explica por qué se rechaza..."
            placeholderTextColor={colors.textSecondary}
            value={rejectReason}
            onChangeText={setRejectReason}
            multiline
          />
          <TouchableOpacity style={styles.rejectConfirmBtn} onPress={handleReject}>
            <Text style={styles.rejectBtnText}>Confirmar rechazo</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 50 },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  errorText: { fontSize: 18, fontWeight: "700", color: colors.text, textAlign: "center" },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: spacing.md },
  backLink: { color: colors.primary, fontSize: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  backBtn: { color: colors.primary, fontSize: 15 },
  counter: { color: colors.warning, fontWeight: "700" },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm, textTransform: "uppercase" },
  question: { fontSize: 20, fontWeight: "700", color: colors.text, lineHeight: 28, marginBottom: spacing.lg },
  option: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.success + "22" },
  optionLetter: { color: colors.textSecondary, fontWeight: "700", marginRight: spacing.md },
  optionText: { flex: 1, color: colors.text, fontSize: 15 },
  explanationBox: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  explanationTitle: { fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  explanationText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  approveBtn: { flex: 1, backgroundColor: colors.success, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  approveBtnText: { color: colors.text, fontWeight: "700", fontSize: 15 },
  rejectBtn: { flex: 1, backgroundColor: colors.error + "22", padding: spacing.md, borderRadius: radius.md, alignItems: "center", borderWidth: 1, borderColor: colors.error },
  rejectBtnText: { color: colors.error, fontWeight: "700", fontSize: 15 },
  rejectBox: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text, marginBottom: spacing.md, minHeight: 60 },
  rejectConfirmBtn: { backgroundColor: colors.error, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
});
