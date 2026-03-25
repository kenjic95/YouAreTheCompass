import React from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import { CategoryInfo } from "../components/category-card.components";

const categories = [
  {
    id: "health-wellness",
    categoryTitle: "Health & Wellness",
    noOfCourses: "17 Courses",
    categoryPhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
  },
  {
    id: "personal-development-lifestyle",
    categoryTitle: "Personal Development & Lifestyle",
    noOfCourses: "20 Courses",
    categoryPhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
  },
  {
    id: "creative-arts-media",
    categoryTitle: "Creative Arts & Media",
    noOfCourses: "16 Courses",
    categoryPhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
  },
  {
    id: "home-hobbies",
    categoryTitle: "Home & Hobbies",
    noOfCourses: "17 Courses",
    categoryPhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
  },
  {
    id: "language-education",
    categoryTitle: "Language & Education",
    noOfCourses: "10 Courses",
    categoryPhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
  },
  {
    id: "finance-investing",
    categoryTitle: "Finance & Investing",
    noOfCourses: "13 Courses",
    categoryPhoto:
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
  },
];

export const LearningsScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <View style={styles.search}>
        <Searchbar />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CategoryInfo category={item} />
          </View>
        )}
      />
    </SafeArea>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  search: {
    padding: 16,
  },
  list: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardWrapper: {
    width: "48%",
  },
});
