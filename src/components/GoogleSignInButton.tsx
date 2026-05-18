import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius } from "../constants/theme";

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export function GoogleSignInButton({ onPress, loading }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} disabled={loading}>
      {loading
        ? <ActivityIndicator color={colors.text} />
        : <>
            <Text style={styles.icon}>G</Text>
            <Text style={styles.text}>Continuar con Google</Text>
          </>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: spacing.md + 2,
    borderRadius: radius.xl,
    gap: spacing.md,
  },
  icon: { fontSize: 18, fontWeight: "900", color: "#4285F4" },
  text: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
});
