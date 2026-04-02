import React, { useMemo, useState } from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CategoryInfo } from "../components/category-card.components";
import { categoriesMockContext } from "../../../services/learnings/categories.mock";
import { LearningsSearch } from "../components/learnings-search.component";

export const LearningsScreen = () => {
  const navigation = useNavigation();
  const { categories } = categoriesMockContext;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) => {
      const title = category?.categoryTitle?.toLowerCase() ?? "";
      const coursesLabel = category?.noOfCourses?.toLowerCase() ?? "";
      return (
        title.includes(normalizedQuery) ||
        coursesLabel.includes(normalizedQuery)
      );
    });
  }, [categories, searchQuery]);

  return (
    <SafeAreaProvider>
      <SafeArea>
        <LearningsSearch
          placeholder="Search Categories"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No categories found.</Text>
          }
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Categories</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CategoryInfo
                category={item}
                onPress={() =>
                  navigation.navigate("Courses", {
                    category: item,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 12,
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
  emptyText: {
    fontSize: 16,
    color: "#DEDEDE",
    marginTop: 8,
  },
});
