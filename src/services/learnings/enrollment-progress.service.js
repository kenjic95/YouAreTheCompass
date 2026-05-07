import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  parseDurationLabelToSeconds,
} from "./course-duration.utils";
import { auth, db, isFirebaseConfigured } from "../auth/firebase";

const normalizeViewedIds = (viewedContentIds = []) =>
  Array.from(
    new Set(
      (Array.isArray(viewedContentIds) ? viewedContentIds : [])
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    )
  );

const getContentDurationSeconds = (contentItem = {}) => {
  const explicitSeconds = Number(contentItem?.contentDurationSeconds) || 0;
  if (explicitSeconds > 0) {
    return explicitSeconds;
  }

  const parsedSeconds = parseDurationLabelToSeconds(contentItem?.contentDuration);
  return parsedSeconds > 0 ? parsedSeconds : 0;
};

export const syncEnrollmentProgress = async (course, viewedContentIds = []) => {
  const userId = String(auth?.currentUser?.uid ?? "").trim();
  const courseId = String(course?.id ?? "").trim();

  if (!isFirebaseConfigured || !db || !userId || !courseId) {
    return false;
  }

  const normalizedViewedIds = normalizeViewedIds(viewedContentIds);
  const courseContent = Array.isArray(course?.courseContent)
    ? course.courseContent
    : [];
  const totalContentCount = courseContent.length;
  const totalDurationSeconds = courseContent.reduce(
    (total, item) => total + getContentDurationSeconds(item),
    0
  );
  const viewedIdSet = new Set(normalizedViewedIds);
  const watchedDurationSeconds = courseContent.reduce((total, item) => {
    const contentId = String(item?.contentId ?? "").trim();
    if (!contentId || !viewedIdSet.has(contentId)) {
      return total;
    }

    return total + getContentDurationSeconds(item);
  }, 0);

  const completedContentCount = courseContent.filter((item) =>
    viewedIdSet.has(String(item?.contentId ?? "").trim())
  ).length;
  const progressPercent =
    totalContentCount > 0
      ? Math.min(100, Math.max(0, Math.round((completedContentCount / totalContentCount) * 100)))
      : 0;

  const enrollmentId = `${userId}_${courseId}`;

  await setDoc(
    doc(db, "enrollments", enrollmentId),
    {
      userId,
      courseId,
      status: "active",
      viewedContentIds: normalizedViewedIds,
      completedContentCount,
      totalContentCount,
      progressPercent,
      watchedDurationSeconds,
      totalDurationSeconds,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return true;
};

