import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";

export const CoursePreviewScreen = ({ route }) => {
  const course = route?.params?.course;

  return (
    <SafeAreaProvider>
      <SafeArea>
        <View style={styles.container}>
          <CourseInfo course={course} />
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
