import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";
import { submitQuestion, CATEGORIES } from "../../src/services/questions";
import { useUserStore } from "../../src/store/useUserStore";
import { canCreate } from "../../src/services/auth";

const DIFFICULTIES = [
  { id: "facil", label: "Fácil", color: colors.success },
  { id: "medio", label: "Medio", color: colors.warning },
  { id: "dificil", label: "Difícil", color: colors.error },
];

export default function CreateQuestionScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"facil" | "medio" | "dificil">("facil");

  if (!user || !canCreate(user.role)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🔒</Text>
        <Text style={styles.errorText}>No tienes permiso para crear preguntas.</Text>
        <Text style={styles.errorSub}>Solo los usuarios con rol Creador o superior pueden hacerlo.</Text>
      </View>
    );
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return Alert.alert("Error", "Escribe la pregunta.");
    if (options.some(o => !o.trim())) return Alert.alert("Error", "Completa todas las opciones.");
    if (correctIndex === null) return Alert.alert("Error", "Selecciona la respuesta correcta.");
    if (!explanation.trim()) return Alert.alert("Error", "Agrega una explicación.");
    if (!category) return Alert.alert("Error", "Selecciona una categoría.");

    setLoading(true);
    try {
      await submitQuestion({
        text: text.trim(),
        options: options.map(o => o.trim()),
        correctIndex,
        explanation: explanation.trim(),
        category,
        difficulty,
        authorId: user.uid,
        authorName: user.displayName,
      });
      Alert.alert("¡Enviada!", "Tu pregunta fue enviada para revisión. Recibirás +30 XP si es aprobada.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert("Error", "No se pudo enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva pregunta</Text>
      </View>

      {/* Pregunta */}
      <Text style={styles.label}>Pregunta *</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe la pregunta aquí..."
        placeholderTextColor={colors.textSecondary}
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={3}
      />

      {/* Opciones */}
      <Text style={styles.label}>Opciones * <Text style={styles.labelHint}>(toca el círculo para marcar la correcta)</Text></Text>
      {options.map((opt, i) => (
        <View key={i} style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.radioBtn, correctIndex === i && styles.radioBtnActive]}
            onPress={() => setCorrectIndex(i)}
          >
            {correctIndex === i && <View style={styles.radioDot} />}
          </TouchableOpacity>
          <TextInput
            style={[styles.optionInput, correctIndex === i && styles.optionInputCorrect]}
            placeholder={`Opción ${["A", "B", "C", "D"][i]}`}
            placeholderTextColor={colors.textSecondary}
            value={opt}
            onChangeText={v => updateOption(i, v)}
          />
        </View>
      ))}

      {/* Explicación */}
      <Text style={styles.label}>Explicación * <Text style={styles.labelHint}>(se muestra al responder)</Text></Text>
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        placeholder="¿Por qué esa es la respuesta correcta?"
        placeholderTextColor={colors.textSecondary}
        value={explanation}
        onChangeText={setExplanation}
        multiline
      />

      {/* Categoría */}
      <Text style={styles.label}>Categoría *</Text>
      <View style={styles.chipsRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, category === cat.id && styles.chipActive]}
            onPress={() => setCategory(cat.id)}
          >
            <Text style={styles.chipText}>{cat.icon} {cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dificultad */}
      <Text style={styles.label}>Dificultad *</Text>
      <View style={styles.chipsRow}>
        {DIFFICULTIES.map(d => (
          <TouchableOpacity
            key={d.id}
            style={[styles.chip, difficulty === d.id && { borderColor: d.color, backgroundColor: d.color + "22" }]}
            onPress={() => setDifficulty(d.id as any)}
          >
            <Text style={[styles.chipText, difficulty === d.id && { color: d.color }]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Info XP */}
      <View style={styles.xpInfo}>
        <Text style={styles.xpInfoText}>💡 Recibirás +30 XP si tu pregunta es aprobada por un moderador.</Text>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.submitText}>Enviar para revisión →</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 50, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  errorText: { fontSize: 18, fontWeight: "700", color: colors.text, textAlign: "center" },
  errorSub: { fontSize: 14, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm },
  header: { marginBottom: spacing.lg },
  backBtn: { color: colors.primary, fontSize: 15, marginBottom: spacing.sm },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  label: { fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.md, textTransform: "uppercase", letterSpacing: 0.5 },
  labelHint: { fontSize: 11, fontWeight: "400", textTransform: "none" },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 15, minHeight: 50 },
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  radioBtn: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, marginRight: spacing.sm, alignItems: "center", justifyContent: "center" },
  radioBtnActive: { borderColor: colors.success },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success },
  optionInput: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 15 },
  optionInputCorrect: { borderColor: colors.success + "88" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, paddingVertical: 6, paddingHorizontal: spacing.md },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
  chipText: { color: colors.text, fontSize: 13 },
  xpInfo: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.border },
  xpInfoText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  submitBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.xl, alignItems: "center", marginTop: spacing.lg },
  submitText: { color: colors.text, fontWeight: "700", fontSize: 16 },
});
