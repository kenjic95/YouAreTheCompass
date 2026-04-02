export const coursePreviewMock = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "5:35 min",
    contentTitle: "Welcome to the Course",
  },
  {
    contentId: 2,
    contentType: "image",
    fileFormat: "png",
    fileSize: "2.1 MB",
    contentTitle: "Meditation Posture Guide",
  },
  {
    contentId: 3,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "4.9 MB",
    contentTitle: "Breathing Patterns Workbook",
  },
  {
    contentId: 4,
    contentType: "video",
    contentDuration: "10:20 min",
    contentTitle: "Meditation Techniques",
  },
  {
    contentId: 5,
    contentType: "image",
    fileFormat: "jpg",
    fileSize: "1.4 MB",
    contentTitle: "Daily Meditation Checklist",
  },
  {
    contentId: 6,
    contentType: "video",
    contentDuration: "3:40 min",
    contentTitle: "Music for Meditation",
  },
];

export const coursePreviewMockContext = {
  courseContent: coursePreviewMock,
  isLoading: false,
  error: null,
};

export const coursePreviewTypeConfig = {
  video: {
    label: "Video",
    icon: "play",
    actionIcon: "play",
  },
  image: {
    label: "Image",
    icon: "image-outline",
    actionIcon: "image-outline",
  },
  pdf: {
    label: "PDF",
    icon: "document-text-outline",
    actionIcon: "document-text-outline",
  },
};

export const normalizeCoursePreviewType = (type) => {
  if (!type) {
    return "video";
  }
  const lowered = String(type).toLowerCase();
  if (lowered === "jpg" || lowered === "jpeg" || lowered === "png") {
    return "image";
  }
  if (lowered === "pdf") {
    return "pdf";
  }
  return lowered;
};
