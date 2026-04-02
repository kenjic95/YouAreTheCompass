import React from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { MyCoursesBar } from "./my-courses-bar.component";

export const LearningsSearch = ({ placeholder, value, onChangeText }) => {
  return (
    <View style={styles.searchContainer}>
      <MyCoursesBar />
      <View style={styles.searchInput}>
        <Searchbar
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.searchBar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: "#EAF2F8",
  },
});
