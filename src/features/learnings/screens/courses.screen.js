import React, { useMemo, useState } from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CourseInfo } from "../components/course-card.components";
import { courseContentMockContext } from "../../../services/learnings/course-content.mock";
import { LearningsSearch } from "../components/learnings-search.component";

export const CoursesScreen = ({ route }) => {
  const navigation = useNavigation();
  const selectedCategory = route?.params?.category;
  const headerTitle = selectedCategory?.categoryTitle ?? "Courses";
  const { courses } = courseContentMockContext;
  const [searchQuery, setSearchQuery] = useState("");

  const data = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return courses;
    }

    return courses.filter((course) => {
      const title = course?.courseTitle?.toLowerCase() ?? "";
      const author = course?.author?.toLowerCase() ?? "";
      return (
        title.includes(normalizedQuery) || author.includes(normalizedQuery)
      );
    });
  }, [courses, searchQuery]);

  return (
    <SafeAreaProvider>
      <SafeArea>
        <LearningsSearch
          placeholder="Search Courses"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No courses found.</Text>
          }
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>{headerTitle}</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CourseInfo
                course={item}
                onPress={() =>
                  navigation.navigate("Course", {
                    course: item,
                    category: selectedCategory,
                  })
                }
              />
            </View>
          )}
        />
      </SafeArea>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 12,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 8,
  },
});
