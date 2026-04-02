import React from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CourseInfo } from "../components/course-card.components";
import { courseContentMockContext } from "../../../services/learnings/course-content.mock";

export const CoursesScreen = ({ route }) => {
  const navigation = useNavigation();
  const selectedCategory = route?.params?.category;
  const headerTitle = selectedCategory?.categoryTitle ?? "Courses";
  const { courses } = courseContentMockContext;
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
  search: {
    padding: 16,
  },
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
});
