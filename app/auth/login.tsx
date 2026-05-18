import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";
import { signIn, getAppUser } from "../../src/services/auth";
import { useUserStore } from "../../src/store/useUserStore";

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useUserStore(s => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return Alert.alert("Error", "Completa todos los campos.");
    setLoading(true);
    try {
      const cred = await signIn(email.trim(), password);
      const appUser = await getAppUser(cred.user.uid);
      if (appUser) setUser(appUser);
      router.replace("/(tabs)");
    } catch (e: any) {
      const msg = e.code === "auth/wrong-password" || e.code === "auth/user-not-found"
        ? "Email o contraseña incorrectos."
        : "Error al iniciar sesión. Intenta de nuevo.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Bienvenido de nuevo 👋</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar tu progreso</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="tu@correo.com"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
          <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.primaryBtnText}>Iniciar sesión</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate gratis</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: 60 },
  back: { marginBottom: spacing.xl },
  backText: { color: colors.primary, fontSize: 15 },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  label: { fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: spacing.sm, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 15, marginBottom: spacing.md },
  passwordRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  eyeBtn: { position: "absolute", right: spacing.md, padding: spacing.sm },
  eyeIcon: { fontSize: 18 },
  primaryBtn: { backgroundColor: colors.primary, padding: spacing.md + 2, borderRadius: radius.xl, alignItems: "center", marginTop: spacing.sm, marginBottom: spacing.lg },
  primaryBtnText: { color: colors.text, fontWeight: "800", fontSize: 17 },
  linkText: { color: colors.textSecondary, textAlign: "center", fontSize: 14 },
  linkHighlight: { color: colors.primary, fontWeight: "600" },
});
