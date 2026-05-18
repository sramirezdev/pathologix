import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.logo}>🧬</Text>
        <Text style={styles.appName}>Pathologix</Text>
        <Text style={styles.tagline}>Aprende medicina jugando</Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: "⚡", text: "5 modos de juego" },
          { icon: "🏆", text: "Ranking semanal global" },
          { icon: "🔥", text: "Rachas y logros" },
          { icon: "⚔️", text: "Duelos 1 vs 1" },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/auth/register")}>
          <Text style={styles.primaryBtnText}>Crear cuenta gratis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/auth/login")}>
          <Text style={styles.secondaryBtnText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.guestText}>Continuar sin cuenta →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: "space-between", paddingTop: 80, paddingBottom: 50 },
  top: { alignItems: "center" },
  logo: { fontSize: 72, marginBottom: spacing.sm },
  appName: { fontSize: 36, fontWeight: "900", color: colors.text, letterSpacing: -1 },
  tagline: { fontSize: 16, color: colors.textSecondary, marginTop: spacing.sm },
  features: { gap: spacing.md },
  featureRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  featureIcon: { fontSize: 22 },
  featureText: { fontSize: 16, color: colors.text, fontWeight: "500" },
  actions: { gap: spacing.md },
  primaryBtn: { backgroundColor: colors.primary, padding: spacing.md + 2, borderRadius: radius.xl, alignItems: "center" },
  primaryBtnText: { color: colors.text, fontWeight: "800", fontSize: 17 },
  secondaryBtn: { backgroundColor: colors.surface, padding: spacing.md + 2, borderRadius: radius.xl, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { color: colors.text, fontWeight: "600", fontSize: 17 },
  guestText: { color: colors.textSecondary, textAlign: "center", fontSize: 14, paddingVertical: spacing.sm },
});
