import React from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import { CourseInfo } from "../components/course-card.components";

const courses = [
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
  },
];

export const CoursesScreen = ({ route }) => {
  const selectedCategory = route?.params?.category; // keep for next filtering step
  const data = courses;

  return (
    <SafeAreaProvider>
      <SafeArea>
        <View style={styles.search}>
          <Searchbar />
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CourseInfo course={item} />
            </View>
          )}
        />
      </SafeArea>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  search: {
    padding: 16,
  },
  list: {
    padding: 16,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 12,
  },
});
