import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../src/constants/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil</Text>
      <Text style={styles.subtitle}>Próximamente...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
});
