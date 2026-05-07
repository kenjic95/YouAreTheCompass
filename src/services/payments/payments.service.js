import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../auth/firebase";

const wait = (durationMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });

const createTransactionId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const toSafeAmount = (value) => {
  const normalized = Number(value) || 0;
  return Number(normalized.toFixed(2));
};

const persistPaymentRecord = async (paymentData = {}) => {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const paymentRef = doc(collection(db, "payments"));
  await setDoc(paymentRef, {
    ...paymentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return paymentRef.id;
};

export const startMockPremiumCheckout = async ({ userId, amount = 9.99 }) => {
  const normalizedUserId = String(userId ?? auth?.currentUser?.uid ?? "").trim();
  if (!normalizedUserId) {
    throw new Error("payment-user-required");
  }

  await wait(1200);

  const transactionId = createTransactionId("mock-premium");
  const paidAmount = toSafeAmount(amount);
  const paymentId = await persistPaymentRecord({
    userId: normalizedUserId,
    type: "premium",
    status: "succeeded",
    provider: "mock",
    transactionId,
    amount: paidAmount,
    currency: "AUD",
  });

  return {
    status: "success",
    transactionId,
    paymentId,
    amount: paidAmount,
    currency: "AUD",
    provider: "mock",
    paidAt: new Date().toISOString(),
  };
};

export const startMockCourseCheckout = async ({
  userId,
  courseId,
  amount,
  currency = "AUD",
}) => {
  const normalizedUserId = String(userId ?? auth?.currentUser?.uid ?? "").trim();
  const normalizedCourseId = String(courseId ?? "").trim();
  if (!normalizedUserId) {
    throw new Error("payment-user-required");
  }
  if (!normalizedCourseId) {
    throw new Error("payment-course-required");
  }

  await wait(1200);

  const transactionId = createTransactionId("mock-course");
  const paidAmount = toSafeAmount(amount);
  const paymentId = await persistPaymentRecord({
    userId: normalizedUserId,
    courseId: normalizedCourseId,
    type: "course",
    status: "succeeded",
    provider: "mock",
    transactionId,
    amount: paidAmount,
    currency: String(currency ?? "AUD").toUpperCase(),
  });

  return {
    status: "success",
    transactionId,
    paymentId,
    amount: paidAmount,
    currency: String(currency ?? "AUD").toUpperCase(),
    provider: "mock",
    paidAt: new Date().toISOString(),
  };
};

