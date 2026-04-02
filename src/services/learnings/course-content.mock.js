const mindfulnessContent = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "5:35 min",
    contentTitle: "Welcome to the Course",
  },
  {
    contentId: 2,
    contentType: "jpg",
    fileFormat: "jpg",
    fileSize: "1.8 MB",
    contentTitle: "Meditation Posture Cheat Sheet",
  },
  {
    contentId: 3,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "3.9 MB",
    contentTitle: "Mindfulness Daily Workbook",
  },
  {
    contentId: 4,
    contentType: "video",
    contentDuration: "10:20 min",
    contentTitle: "Meditation Techniques",
  },
];

const breathworkContent = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "8:10 min",
    contentTitle: "Breathwork Foundations",
  },
  {
    contentId: 2,
    contentType: "png",
    fileFormat: "png",
    fileSize: "2.4 MB",
    contentTitle: "Breathing Cycle Diagram",
  },
  {
    contentId: 3,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "5.2 MB",
    contentTitle: "Breath Counting Exercise Sheet",
  },
];

const sleepYogaContent = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "12:42 min",
    contentTitle: "Wind-down Sequence",
  },
  {
    contentId: 2,
    contentType: "video",
    contentDuration: "9:04 min",
    contentTitle: "Evening Stretch Flow",
  },
  {
    contentId: 3,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "2.7 MB",
    contentTitle: "Sleep Checklist",
  },
];

export const coursesMock = [
  {
    id: "mindfulness-and-meditation",
    courseTitle: "Mindfulness and Meditation",
    author: "John Doe",
    courseDuration: "2hr 46min",
    priceValue: "$20",
    watchers: "18k",
    rating: "4.8",
    coursePhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
    courseContent: mindfulnessContent,
  },
  {
    id: "daily-breathwork-basics",
    courseTitle: "Daily Breathwork Basics",
    author: "Mia Park",
    courseDuration: "1hr 35min",
    priceValue: "$16",
    watchers: "11k",
    rating: "4.7",
    coursePhoto:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
    courseContent: breathworkContent,
  },
  {
    id: "yoga-for-better-sleep",
    courseTitle: "Yoga for Better Sleep",
    author: "Liam Chen",
    courseDuration: "3hr 05min",
    priceValue: "$24",
    watchers: "25k",
    rating: "4.9",
    coursePhoto:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
    courseContent: sleepYogaContent,
  },
  {
    id: "journaling-for-focus",
    courseTitle: "Journaling for Focus",
    author: "Ava Smith",
    courseDuration: "1hr 50min",
    priceValue: "$14",
    watchers: "9k",
    rating: "4.6",
    coursePhoto:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    courseContent: mindfulnessContent,
  },
  {
    id: "calm-anxiety-toolkit",
    courseTitle: "Calm Anxiety Toolkit",
    author: "Noah Wilson",
    courseDuration: "2hr 22min",
    priceValue: "$19",
    watchers: "15k",
    rating: "4.8",
    coursePhoto:
      "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=900&q=80",
    courseContent: breathworkContent,
  },
  {
    id: "morning-routine-reset",
    courseTitle: "Morning Routine Reset",
    author: "Emma Brown",
    courseDuration: "2hr 10min",
    priceValue: "$18",
    watchers: "13k",
    rating: "4.7",
    coursePhoto:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80",
    courseContent: sleepYogaContent,
  },
  {
    id: "digital-detox-practical",
    courseTitle: "Digital Detox Practical",
    author: "Ethan Taylor",
    courseDuration: "1hr 42min",
    priceValue: "$12",
    watchers: "8k",
    rating: "4.5",
    coursePhoto:
      "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=900&q=80",
    courseContent: mindfulnessContent,
  },
];

export const courseContentMockContext = {
  courses: coursesMock,
  isLoading: false,
  error: null,
};
