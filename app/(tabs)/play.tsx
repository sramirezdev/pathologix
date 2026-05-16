import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";

const MODES = [
  { id: "rapido", icon: "⚡", title: "Modo Rápido", description: "10 preguntas, a tu ritmo", color: colors.primary },
  { id: "contrarreloj", icon: "⏱️", title: "Contrarreloj", description: "60 segundos, máximas respuestas", color: colors.warning },
  { id: "especialidad", icon: "🎯", title: "Por Especialidad", description: "Elige tu categoría", color: colors.success },
  { id: "muerte_subita", icon: "💀", title: "Muerte Súbita", description: "Falla una y pierdes", color: colors.error },
  { id: "duelo", icon: "⚔️", title: "Duelo", description: "Reta a un amigo", color: "#9B59B6" },
];

export default function PlayScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Modos de Juego</Text>
      {MODES.map(mode => (
        <TouchableOpacity
          key={mode.id}
          style={[styles.modeCard, { borderLeftColor: mode.color }]}
          onPress={() => router.push({ pathname: "/game/question", params: { mode: mode.id } })}
        >
          <Text style={styles.modeIcon}>{mode.icon}</Text>
          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeDesc}>{mode.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: spacing.lg },
  modeCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, flexDirection: "row", alignItems: "center", borderLeftWidth: 4 },
  modeIcon: { fontSize: 28, marginRight: spacing.md },
  modeInfo: { flex: 1 },
  modeTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  modeDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
