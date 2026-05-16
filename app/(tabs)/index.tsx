import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Pathologix</Text>
      <Text style={styles.subtitle}>Quiz médico gamificado</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🔥 0</Text>
          <Text style={styles.statLabel}>Racha</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>⭐ 1</Text>
          <Text style={styles.statLabel}>Nivel</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🏆 —</Text>
          <Text style={styles.statLabel}>Ranking</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={() => router.push("/play")}>
        <Text style={styles.playButtonText}>⚡ Jugar ahora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  logo: { fontSize: 36, fontWeight: "800", color: colors.primary, marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: spacing.xl },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  statBox: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, alignItems: "center", minWidth: 90 },
  statValue: { fontSize: 18, fontWeight: "700", color: colors.text },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  playButton: { backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xl * 2, borderRadius: radius.xl },
  playButtonText: { color: colors.text, fontSize: 18, fontWeight: "700" },
});
