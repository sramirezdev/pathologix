import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";
import { useUserStore } from "../../src/store/useUserStore";
import { canCreate, canModerate } from "../../src/services/auth";

const MODES = [
  {
    id: "rapido",
    icon: "⚡",
    title: "Modo Rápido",
    desc: "10 preguntas sin límite de tiempo",
    color: colors.primary,
  },
  {
    id: "contrarreloj",
    icon: "⏱️",
    title: "Contrarreloj",
    desc: "Máximas respuestas en 60 segundos",
    color: "#F59E0B",
  },
  {
    id: "especialidad",
    icon: "🎯",
    title: "Por especialidad",
    desc: "Elige una categoría y domínala",
    color: "#10B981",
  },
  {
    id: "muerte_subita",
    icon: "💀",
    title: "Muerte súbita",
    desc: "Un fallo y todo termina",
    color: "#EF4444",
  },
  {
    id: "duelo",
    icon: "⚔️",
    title: "Duelo 1v1",
    desc: "Reta a otro jugador",
    color: "#8B5CF6",
    comingSoon: true,
  },
];

const CATEGORIES = [
  { id: "cie10", label: "CIE-10/11", icon: "📋" },
  { id: "anatomia", label: "Anatomía", icon: "🫀" },
  { id: "farmacologia", label: "Farmacología", icon: "💊" },
  { id: "sintomas", label: "Signos y síntomas", icon: "🩺" },
  { id: "primeros_auxilios", label: "Primeros auxilios", icon: "🚑" },
];

export default function PlayTab() {
  const router = useRouter();
  const { user } = useUserStore();

  const handleMode = (mode: string, comingSoon?: boolean) => {
    if (comingSoon) return;
    if (mode === "especialidad") {
      // Mostrar selector de categoría — por ahora va directo con la primera
      router.push({ pathname: "/game/question", params: { mode } });
    } else {
      router.push({ pathname: "/game/question", params: { mode } });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿A qué jugamos? 🎮</Text>

      {/* Modos */}
      {MODES.map(m => (
        <TouchableOpacity
          key={m.id}
          style={[styles.card, m.comingSoon && styles.cardDisabled]}
          onPress={() => handleMode(m.id, m.comingSoon)}
          activeOpacity={m.comingSoon ? 1 : 0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: m.color + "22" }]}>
            <Text style={styles.modeIcon}>{m.icon}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{m.title}</Text>
            <Text style={styles.cardDesc}>{m.desc}</Text>
          </View>
          {m.comingSoon
            ? <View style={styles.soonBadge}><Text style={styles.soonText}>Próximo</Text></View>
            : <Text style={[styles.arrow, { color: m.color }]}>›</Text>
          }
        </TouchableOpacity>
      ))}

      {/* Categorías rápidas */}
      <Text style={styles.sectionTitle}>Jugar por categoría</Text>
      <View style={styles.catGrid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={styles.catCard}
            onPress={() => router.push({ pathname: "/game/question", params: { mode: "rapido", category: cat.id } })}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={styles.catLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Crear pregunta (solo creadores+) */}
      {user && canCreate(user.role) && (
        <TouchableOpacity style={styles.createBtn} onPress={() => router.push("/create/question")}>
          <Text style={styles.createBtnText}>✏️ Crear pregunta</Text>
        </TouchableOpacity>
      )}

      {/* Moderación (solo moderadores+) */}
      {user && canModerate(user.role) && (
        <TouchableOpacity style={styles.moderateBtn} onPress={() => router.push("/moderate")}>
          <Text style={styles.moderateBtnText}>🛡️ Panel de moderación</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: spacing.lg },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  cardDisabled: { opacity: 0.5 },
  iconBox: { width: 50, height: 50, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  modeIcon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  cardDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  arrow: { fontSize: 28, fontWeight: "300" },
  soonBadge: { backgroundColor: colors.border, borderRadius: radius.xl, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  soonText: { fontSize: 11, color: colors.textSecondary, fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  catCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: "center", borderWidth: 1, borderColor: colors.border, minWidth: "30%", flex: 1 },
  catIcon: { fontSize: 24, marginBottom: 4 },
  catLabel: { fontSize: 12, color: colors.textSecondary, textAlign: "center" },
  createBtn: { backgroundColor: colors.primary + "22", borderWidth: 1, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.md, alignItems: "center", marginBottom: spacing.sm },
  createBtnText: { color: colors.primary, fontWeight: "700", fontSize: 15 },
  moderateBtn: { backgroundColor: colors.warning + "22", borderWidth: 1, borderColor: colors.warning, borderRadius: radius.xl, padding: spacing.md, alignItems: "center" },
  moderateBtnText: { color: colors.warning, fontWeight: "700", fontSize: 15 },
});
