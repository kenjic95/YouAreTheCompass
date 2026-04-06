const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const parseDurationLabelToSeconds = (durationLabel) => {
  if (!durationLabel) {
    return 0;
  }

  const normalized = String(durationLabel).toLowerCase().trim();
  const colonMatch = normalized.match(/(\d+)\s*:\s*(\d+)/);
  if (colonMatch) {
    const minutes = toNumber(colonMatch[1]);
    const seconds = toNumber(colonMatch[2]);
    return minutes * 60 + seconds;
  }

  const hoursMatch = normalized.match(/(\d+)\s*h/);
  const minutesMatch = normalized.match(/(\d+)\s*m/);
  const secondsMatch = normalized.match(/(\d+)\s*s/);

  const hours = toNumber(hoursMatch?.[1]);
  const minutes = toNumber(minutesMatch?.[1]);
  const seconds = toNumber(secondsMatch?.[1]);

  if (hours || minutes || seconds) {
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};

export const sumCourseVideoDurationSeconds = (courseContent = []) =>
  courseContent.reduce((total, contentItem) => {
    const contentType = String(contentItem?.contentType ?? "").toLowerCase();
    if (contentType !== "video") {
      return total;
    }

    return (
      total + parseDurationLabelToSeconds(contentItem?.contentDuration ?? "")
    );
  }, 0);

export const formatDurationFromSeconds = (durationSeconds) => {
  const safeSeconds = Math.max(0, Math.round(durationSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const remainingAfterHours = safeSeconds % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = remainingAfterHours % 60;

  if (hours > 0) {
    return `${hours}hr ${String(minutes).padStart(2, "0")}min`;
  }

  if (seconds > 0) {
    return `${minutes}min ${seconds}sec`;
  }

  return `${minutes}min`;
};
