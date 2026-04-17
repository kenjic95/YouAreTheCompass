import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import {
  AddToCartToggleButton,
  AddToCartBar,
  LearningsSearchRow,
  MyCoursesBar,
  MyCoursesToggleButton,
} from "./my-courses-bar.component";

export const LearningsSearch = ({
  placeholder,
  value,
  onChangeText,
  myCourses = [],
  cartCourses = [],
  onNavigateCourse,
  onNavigateMyCourse,
  onNavigateCartCourse,
  onRemoveCartCourse,
}) => {
  const [isMyCoursesOpen, setIsMyCoursesOpen] = useState(false);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);

  return (
    <View>
      <View style={styles.searchContainer}>
        <LearningsSearchRow>
          <MyCoursesToggleButton
            isActive={isMyCoursesOpen}
            onPress={() => {
              setIsMyCoursesOpen((previous) => !previous);
              setIsAddToCartOpen(false);
            }}
          />
          <AddToCartToggleButton
            isActive={isAddToCartOpen}
            onPress={() => {
              setIsAddToCartOpen((previous) => !previous);
              setIsMyCoursesOpen(false);
            }}
          />
          <View style={styles.searchInput}>
            <Searchbar
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              style={styles.searchBar}
            />
          </View>
        </LearningsSearchRow>
      </View>
      {isMyCoursesOpen ? (
        <MyCoursesBar
          courses={myCourses}
          onNavigateCourse={onNavigateMyCourse ?? onNavigateCourse}
        />
      ) : null}
      {isAddToCartOpen ? (
        <AddToCartBar
          courses={cartCourses}
          onNavigateCourse={onNavigateCartCourse ?? onNavigateCourse}
          onRemoveCourse={onRemoveCartCourse}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
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
