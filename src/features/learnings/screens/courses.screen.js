import React, { useMemo, useState } from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CourseInfo } from "../components/course-card.components";
import { courseContentMockContext } from "../../../services/learnings/course-content.mock";
import { LearningsSearch } from "../components/learnings-search.component";
import { usePurchasedCourses } from "../../../services/learnings/purchased-courses.context";

export const CoursesScreen = ({ route }) => {
  const navigation = useNavigation();
  const selectedCategory = route?.params?.category;
  const headerTitle = selectedCategory?.categoryTitle ?? "Courses";
  const { courses } = courseContentMockContext;
  const { purchasedCourses, cartCourses, removeFromCart } = usePurchasedCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const purchasedCourseIds = useMemo(
    () => new Set(purchasedCourses.map((course) => course.id)),
    [purchasedCourses]
  );
  const cartCourseIds = useMemo(
    () => new Set(cartCourses.map((course) => course.id)),
    [cartCourses]
  );

  const data = useMemo(() => {
    const selectedCategoryId = selectedCategory?.id;
    const categoryCourses = selectedCategoryId
      ? courses.filter((course) => course?.categoryId === selectedCategoryId)
      : courses;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return categoryCourses;
    }

    return categoryCourses.filter((course) => {
      const title = course?.courseTitle?.toLowerCase() ?? "";
      const author = course?.author?.toLowerCase() ?? "";
      return (
        title.includes(normalizedQuery) || author.includes(normalizedQuery)
      );
    });
  }, [courses, searchQuery, selectedCategory?.id]);

  return (
    <SafeAreaProvider>
      <SafeArea>
        <LearningsSearch
          placeholder="Search Courses"
          value={searchQuery}
          onChangeText={setSearchQuery}
          myCourses={purchasedCourses}
          cartCourses={cartCourses}
          onNavigateMyCourse={(course) =>
            navigation.navigate("MyCourse", {
              course,
              category: selectedCategory,
            })
          }
          onNavigateCourse={(course) =>
            navigation.navigate("Course", {
              course,
              category: selectedCategory,
            })
          }
          onRemoveCartCourse={(course) => removeFromCart(course?.id)}
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
                isPurchased={purchasedCourseIds.has(item.id)}
                isInCart={cartCourseIds.has(item.id)}
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
