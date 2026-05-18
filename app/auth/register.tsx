import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../src/constants/theme";
import { signUp, signInWithGoogle, getAppUser } from "../../src/services/auth";
import { GoogleSignInButton } from "../../src/components/GoogleSignInButton";
import { useUserStore } from "../../src/store/useUserStore";

const PROFILES = [
  { id: "estudiante", label: "Estudiante de medicina", icon: "📚" },
  { id: "medico", label: "Médico / Enfermera", icon: "🩺" },
  { id: "curioso", label: "Curioso de salud", icon: "🔬" },
];

export default function RegisterScreen() {
  const router = useRouter();
  const setUser = useUserStore(s => s.setUser);
  const [step, setStep] = useState<"form" | "profile">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const cred = await signInWithGoogle();
      const appUser = await getAppUser(cred.user.uid);
      if (appUser) setUser(appUser);
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Error", "No se pudo continuar con Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleNext = () => {
    if (!name.trim()) return Alert.alert("Error", "Ingresa tu nombre.");
    if (!email.trim()) return Alert.alert("Error", "Ingresa tu correo.");
    if (password.length < 6) return Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
    setStep("profile");
  };

  const handleRegister = async () => {
    if (!profile) return Alert.alert("Error", "Selecciona tu perfil.");
    setLoading(true);
    try {
      const cred = await signUp(email.trim(), password, name.trim());
      const appUser = await getAppUser(cred.user.uid);
      if (appUser) setUser({ ...appUser, profile: profile as any });
      router.replace("/(tabs)");
    } catch (e: any) {
      const msg = e.code === "auth/email-already-in-use"
        ? "Este correo ya está registrado."
        : "Error al crear cuenta. Intenta de nuevo.";
      Alert.alert("Error", msg);
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (step === "profile") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>¿Cuál es tu perfil? 🎯</Text>
        <Text style={styles.subtitle}>Personalizamos las preguntas según tus intereses</Text>
        <View style={styles.profileList}>
          {PROFILES.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.profileCard, profile === p.id && styles.profileCardActive]}
              onPress={() => setProfile(p.id)}
            >
              <Text style={styles.profileIcon}>{p.icon}</Text>
              <Text style={styles.profileLabel}>{p.label}</Text>
              {profile === p.id && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.primaryBtnText}>¡Empezar a jugar! 🚀</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Crea tu cuenta 🧬</Text>
        <Text style={styles.subtitle}>Guarda tu progreso y compite en el ranking</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} placeholder="Tu nombre" placeholderTextColor={colors.textSecondary} value={name} onChangeText={setName} />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput style={styles.input} placeholder="tu@correo.com" placeholderTextColor={colors.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Mínimo 6 caracteres" placeholderTextColor={colors.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
            <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryBtnText}>Continuar →</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>
        <GoogleSignInButton onPress={handleGoogle} loading={googleLoading} />
        <View style={{ height: spacing.md }} />
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia sesión</Text></Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileList: { gap: spacing.md, marginBottom: spacing.xl },
  profileCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, gap: spacing.md },
  profileCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + "15" },
  profileIcon: { fontSize: 28 },
  profileLabel: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.text },
  checkIcon: { color: colors.primary, fontSize: 18, fontWeight: "700" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textSecondary, marginHorizontal: spacing.md, fontSize: 13 },
});
