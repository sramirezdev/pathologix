import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";

export default function ResultScreen() {
  const router = useRouter();
  const { score, correct, total, xpEarned, maxCombo } = useLocalSearchParams<{
    score: string; correct: string; total: string; xpEarned: string; maxCombo: string;
  }>();

  const pct = Math.round((Number(correct) / Number(total)) * 100);
  const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚";
  const msg = pct === 100 ? "¡Perfecto!" : pct >= 70 ? "¡Muy bien!" : pct >= 40 ? "¡Sigue practicando!" : "¡A estudiar más!";

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.msg}>{msg}</Text>

      <View style={styles.statsBox}>
        <Stat label="Puntaje" value={score} highlight />
        <Stat label="Correctas" value={`${correct}/${total}`} />
        <Stat label="Precisión" value={`${pct}%`} />
        <Stat label="Mejor combo" value={`x${maxCombo}`} />
        <Stat label="XP ganado" value={`+${xpEarned}`} highlight />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Jugar de nuevo 🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.secondaryBtnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 80, marginBottom: spacing.md },
  msg: { fontSize: 30, fontWeight: "800", color: colors.text, marginBottom: spacing.xl },
  statsBox: { width: "100%", backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md, marginBottom: spacing.xl },
  stat: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statLabel: { fontSize: 15, color: colors.textSecondary },
  statValue: { fontSize: 18, fontWeight: "700", color: colors.text },
  statValueHighlight: { color: colors.xpBar },
  actions: { width: "100%", gap: spacing.md },
  primaryBtn: { backgroundColor: colors.primary, padding: spacing.md + 2, borderRadius: radius.xl, alignItems: "center" },
  primaryBtnText: { color: colors.text, fontWeight: "800", fontSize: 17 },
  secondaryBtn: { backgroundColor: colors.surface, padding: spacing.md + 2, borderRadius: radius.xl, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { color: colors.text, fontWeight: "600", fontSize: 17 },
});
