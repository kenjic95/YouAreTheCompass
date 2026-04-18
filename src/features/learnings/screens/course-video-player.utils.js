import { normalizeCoursePreviewType } from "../../../services/learnings/course-preview.mock";

export const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";
export const AUTO_HIDE_DELAY_MS = 2200;
export const HIDDEN_TRANSLATE_Y = 180;
export const MOCK_VIDEO_MODULES = [
  require("../../../../assets/TestVideo1.mp4"),
  require("../../../../assets/testvid2.mp4"),
];

export const formatClock = (seconds) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const getSelectedVideoModule = (course, contentItem) => {
  const uploadedVideoUri = contentItem?.localUri;
  if (
    typeof uploadedVideoUri === "string" &&
    uploadedVideoUri.trim().length > 0
  ) {
    return { uri: uploadedVideoUri };
  }

  const courseContent = course?.courseContent ?? [];
  const videoItems = courseContent.filter((item) => {
    const contentType = normalizeCoursePreviewType(
      item?.contentType ?? item?.fileFormat
    );
    return contentType === "video";
  });

  const currentVideoIndex = videoItems.findIndex(
    (item) => item?.contentId === contentItem?.contentId
  );
  const resolvedIndex =
    currentVideoIndex >= 0
      ? Math.min(currentVideoIndex, MOCK_VIDEO_MODULES.length - 1)
      : 0;

  return MOCK_VIDEO_MODULES[resolvedIndex];
};
