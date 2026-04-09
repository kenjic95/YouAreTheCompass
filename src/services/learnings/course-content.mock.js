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

const boatingFoundationContent = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "11:18 min",
    contentTitle: "Boat Safety Essentials",
  },
  {
    contentId: 2,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "4.1 MB",
    contentTitle: "Pre-Departure Safety Checklist",
  },
  {
    contentId: 3,
    contentType: "video",
    contentDuration: "14:07 min",
    contentTitle: "Basic Navigation Markers",
  },
];

const coastalFishingContent = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "9:54 min",
    contentTitle: "Coastal Fishing Rig Setup",
  },
  {
    contentId: 2,
    contentType: "jpg",
    fileFormat: "jpg",
    fileSize: "2.0 MB",
    contentTitle: "Knot Reference Guide",
  },
  {
    contentId: 3,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "3.6 MB",
    contentTitle: "Tide and Weather Planning Worksheet",
  },
];

export const coursesMock = [
  {
    id: "mindfulness-and-meditation",
    categoryId: 1,
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
    categoryId: 1,
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
    categoryId: 1,
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
    categoryId: 2,
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
    categoryId: 2,
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
    categoryId: 2,
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
    categoryId: 2,
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
  {
    id: "beginner-watercolor-essentials",
    categoryId: 3,
    courseTitle: "Beginner Watercolor Essentials",
    author: "Sophie Rivera",
    courseDuration: "2hr 12min",
    priceValue: "$17",
    watchers: "7k",
    rating: "4.6",
    coursePhoto:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
    courseContent: mindfulnessContent,
  },
  {
    id: "smartphone-photography-lighting",
    categoryId: 3,
    courseTitle: "Smartphone Photography Lighting",
    author: "Marcus Lee",
    courseDuration: "1hr 58min",
    priceValue: "$15",
    watchers: "10k",
    rating: "4.7",
    coursePhoto:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    courseContent: breathworkContent,
  },
  {
    id: "urban-balcony-gardening",
    categoryId: 4,
    courseTitle: "Urban Balcony Gardening",
    author: "Nina Patel",
    courseDuration: "2hr 05min",
    priceValue: "$13",
    watchers: "6k",
    rating: "4.5",
    coursePhoto:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80",
    courseContent: sleepYogaContent,
  },
  {
    id: "home-coffee-brewing-lab",
    categoryId: 4,
    courseTitle: "Home Coffee Brewing Lab",
    author: "Daniel Cruz",
    courseDuration: "1hr 44min",
    priceValue: "$14",
    watchers: "9k",
    rating: "4.8",
    coursePhoto:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    courseContent: breathworkContent,
  },
  {
    id: "practical-spanish-for-travel",
    categoryId: 5,
    courseTitle: "Practical Spanish for Travel",
    author: "Lucia Gomez",
    courseDuration: "2hr 30min",
    priceValue: "$21",
    watchers: "14k",
    rating: "4.9",
    coursePhoto:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    courseContent: mindfulnessContent,
  },
  {
    id: "public-speaking-english-confidence",
    categoryId: 5,
    courseTitle: "Public Speaking English Confidence",
    author: "Ryan Walker",
    courseDuration: "2hr 08min",
    priceValue: "$18",
    watchers: "12k",
    rating: "4.7",
    coursePhoto:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80",
    courseContent: sleepYogaContent,
  },
  {
    id: "investing-fundamentals-101",
    categoryId: 6,
    courseTitle: "Investing Fundamentals 101",
    author: "Olivia Reed",
    courseDuration: "2hr 18min",
    priceValue: "$23",
    watchers: "19k",
    rating: "4.8",
    coursePhoto:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    courseContent: mindfulnessContent,
  },
  {
    id: "budgeting-and-cashflow-starter",
    categoryId: 6,
    courseTitle: "Budgeting and Cashflow Starter",
    author: "Harper Kim",
    courseDuration: "1hr 40min",
    priceValue: "$12",
    watchers: "8k",
    rating: "4.6",
    coursePhoto:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    courseContent: breathworkContent,
  },
  {
    id: "nautibuoy-boating-foundation",
    categoryId: 7,
    courseTitle: "Nautibuoy Boating Foundation",
    author: "Captain Morgan",
    courseDuration: "2hr 05min",
    priceValue: "$22",
    watchers: "6k",
    rating: "4.8",
    coursePhoto:
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80",
    isFoundationCourse: true,
    prerequisiteCourseId: null,
    courseContent: boatingFoundationContent,
  },
  {
    id: "nautibuoy-coastal-fishing-prerequisite",
    categoryId: 7,
    courseTitle: "Coastal Fishing Setup and Strategy",
    author: "Captain Morgan",
    courseDuration: "1hr 52min",
    priceValue: "$19",
    watchers: "4k",
    rating: "4.7",
    coursePhoto:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
    isFoundationCourse: false,
    prerequisiteCourseId: "nautibuoy-boating-foundation",
    courseContent: coastalFishingContent,
  },
];

export const courseContentMockContext = {
  courses: coursesMock,
  isLoading: false,
  error: null,
};
