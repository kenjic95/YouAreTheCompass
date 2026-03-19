import React from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { CategoryInfo } from "../components/category-card.components";

export const LearningsScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <View style={styles.search}>
        <Searchbar />
      </View>
      <View style={styles.list}>
        <CategoryInfo />
      </View>
    </SafeArea>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  search: {
    padding: 16,
  },
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "blue",
  },
});
