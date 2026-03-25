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
    price: "$20",
    watchers: "18k",
    rating: "4.8",
    coursePhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
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
  },
});
