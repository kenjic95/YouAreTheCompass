import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export const MyCoursesBar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <TouchableOpacity
      style={styles.iconButton}
      activeOpacity={0.8}
      onPress={() => setIsActive((previous) => !previous)}
    >
      <Ionicons
        name={isActive ? "school" : "school-outline"}
        size={22}
        color="#757575"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EAF2F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
