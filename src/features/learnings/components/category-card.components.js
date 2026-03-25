import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

export const CategoryInfo = ({ category } = {}) => {
  const {
    categoryTitle = "Health and Wellness",
    noOfCourses = "17 Courses",
    categoryPhoto = [
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
    ],
  } = category ?? {};
  const coverPhoto = Array.isArray(categoryPhoto)
    ? categoryPhoto[0]
    : categoryPhoto;
  return (
    <Card elevation={5} style={styles.card}>
      <Card.Cover
        key={categoryTitle}
        style={styles.cover}
        source={{ uri: coverPhoto }}
      />
      <Text>{categoryTitle}</Text>
      <Text>{noOfCourses}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "white" },
  cover: { padding: 20, backgroundColor: "white" },
  title: { padding: 16 },
});
