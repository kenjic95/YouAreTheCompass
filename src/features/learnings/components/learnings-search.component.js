import React from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export const LearningsSearch = ({ placeholder, value, onChangeText }) => {
  return (
    <View style={styles.search}>
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    padding: 16,
  },
});
