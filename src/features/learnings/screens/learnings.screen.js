import React from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CategoryInfo } from "../components/category-card.components";
import { categoriesMockContext } from "../../../services/learnings/categories.mock";

export const LearningsScreen = () => {
  const navigation = useNavigation();
  const { categories } = categoriesMockContext;

  return (
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
  search: {
    padding: 16,
  },
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
});
