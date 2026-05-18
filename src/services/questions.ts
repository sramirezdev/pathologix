import firestore from "@react-native-firebase/firestore";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: "facil" | "medio" | "dificil";
  status: "pendiente" | "aprobada" | "rechazada";
  authorId: string;
  authorName: string;
  rejectionReason?: string;
  votes: { up: number; down: number };
  reportCount: number;
  createdAt: any;
}

export const CATEGORIES = [
  { id: "cie10", label: "CIE-10/11", icon: "📋" },
  { id: "anatomia", label: "Anatomía", icon: "🫀" },
  { id: "farmacologia", label: "Farmacología", icon: "💊" },
  { id: "sintomas", label: "Signos y síntomas", icon: "🩺" },
  { id: "primeros_auxilios", label: "Primeros auxilios", icon: "🚑" },
];

// Obtener preguntas aprobadas para jugar
export const fetchQuestions = async (category?: string, count: number = 10): Promise<Question[]> => {
  let query = firestore().collection("questions").where("status", "==", "aprobada");
  if (category) query = (query as any).where("category", "==", category);
  const snapshot = await query.get();
  const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Question));
  return all.sort(() => Math.random() - 0.5).slice(0, count);
};

// Crear pregunta (rol creador+)
export const submitQuestion = async (
  data: Omit<Question, "id" | "status" | "votes" | "reportCount" | "createdAt" | "rejectionReason">,
) => {
  await firestore().collection("questions").add({
    ...data,
    status: "pendiente",
    votes: { up: 0, down: 0 },
    reportCount: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// Aprobar pregunta (moderador+)
export const approveQuestion = async (questionId: string, moderatorId: string) => {
  await firestore().collection("questions").doc(questionId).update({
    status: "aprobada",
    reviewedAt: firestore.FieldValue.serverTimestamp(),
    reviewedBy: moderatorId,
  });
  // Dar XP al autor
  const doc = await firestore().collection("questions").doc(questionId).get();
  const authorId = doc.data()?.authorId;
  if (authorId) {
    await firestore().collection("users").doc(authorId).update({
      xp: firestore.FieldValue.increment(30),
    });
  }
};

// Rechazar pregunta (moderador+)
export const rejectQuestion = async (questionId: string, moderatorId: string, reason: string) => {
  await firestore().collection("questions").doc(questionId).update({
    status: "rechazada",
    rejectionReason: reason,
    reviewedAt: firestore.FieldValue.serverTimestamp(),
    reviewedBy: moderatorId,
  });
};

// Obtener preguntas pendientes (moderador+)
export const fetchPendingQuestions = async (): Promise<Question[]> => {
  const snapshot = await firestore()
    .collection("questions")
    .where("status", "==", "pendiente")
    .orderBy("createdAt", "asc")
    .get();
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Question));
};

// Reportar pregunta
export const reportQuestion = async (questionId: string, userId: string, reason: string) => {
  const ref = firestore().collection("questions").doc(questionId);
  await ref.update({
    reportCount: firestore.FieldValue.increment(1),
    [`reports.${userId}`]: reason,
  });
  const doc = await ref.get();
  if ((doc.data()?.reportCount || 0) >= 5) {
    await ref.update({ status: "pendiente" });
  }
};
