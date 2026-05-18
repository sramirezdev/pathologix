import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export type UserRole = "jugador" | "creador" | "moderador" | "admin";

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  profile: "estudiante" | "medico" | "curioso";
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate: string;
  achievements: string[];
  isPremium: boolean;
  weeklyScore: number;
  totalCorrect: number;
  totalAnswered: number;
}

export const signIn = async (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signUp = async (email: string, password: string, displayName: string) => {
  const cred = await auth().createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName });
  // Crear documento en Firestore
  await firestore().collection("users").doc(cred.user.uid).set({
    displayName,
    email,
    role: "jugador",
    profile: "curioso",
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayedDate: "",
    achievements: [],
    isPremium: false,
    weeklyScore: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return cred;
};

export const signOut = () => auth().signOut();

export const getAppUser = async (uid: string): Promise<AppUser | null> => {
  const doc = await firestore().collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return { uid, ...doc.data() } as AppUser;
};

export const canCreate = (role: UserRole) =>
  ["creador", "moderador", "admin"].includes(role);

export const canModerate = (role: UserRole) =>
  ["moderador", "admin"].includes(role);
