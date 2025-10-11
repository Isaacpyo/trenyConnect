import { db } from "./firebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where, serverTimestamp } from "firebase/firestore";

export const createConsignment = async (payload: any) => {
  const col = collection(db, "consignments");
  const docRef = await addDoc(col, { ...payload, status: "CREATED", createdAt: serverTimestamp() });
  return docRef.id;
};

export const getConsignmentByRef = async (trackingRef: string) => {
  const q = query(collection(db, "consignments"), where("trackingRef", "==", trackingRef));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))[0] || null;
};

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const updateConsignmentStatus = async (id: string, status: string) => {
  const ref = doc(db, "consignments", id);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
};
