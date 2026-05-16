import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";

export default function ResultScreen() {
  const router = useRouter();
  const { score, correct, total } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.score}>{score} pts</Text>
      <Text style={styles.detail}>{correct}/{total} respuestas correctas</Text>
      <View style={styles.xpBox}>
        <Text style={styles.xpText}>+{Number(correct) * 10} XP ganados</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/play")}>
        <Text style={styles.buttonText}>Jugar de nuevo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.replace("/")}>
        <Text style={styles.buttonSecondaryText}>Ir al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  emoji: { fontSize: 60, marginBottom: spacing.md },
  score: { fontSize: 48, fontWeight: "800", color: colors.primary, marginBottom: spacing.sm },
  detail: { fontSize: 18, color: colors.textSecondary, marginBottom: spacing.lg },
  xpBox: { backgroundColor: colors.surface, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.xl, marginBottom: spacing.xl },
  xpText: { fontSize: 16, color: colors.xpBar, fontWeight: "700" },
  button: { backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xl * 2, borderRadius: radius.xl, marginBottom: spacing.md },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: "700" },
  buttonSecondary: { paddingVertical: spacing.sm },
  buttonSecondaryText: { color: colors.textSecondary, fontSize: 14 },
});
