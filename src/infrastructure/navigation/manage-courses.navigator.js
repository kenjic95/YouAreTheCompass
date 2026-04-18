import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ManageCoursesScreen } from "../../features/admin/screens/manage-courses.screen";
import { CreateCourseScreen } from "../../features/admin/screens/create-course.screen";
import { CourseContentUploadScreen } from "../../features/admin/screens/course-content-upload.screen";

const ManageCoursesStack = createNativeStackNavigator();

export const ManageCoursesNavigator = () => (
  <ManageCoursesStack.Navigator>
    <ManageCoursesStack.Screen
      name="ManageCoursesHome"
      component={ManageCoursesScreen}
      options={{ title: "Course Creator" }}
    />
    <ManageCoursesStack.Screen
      name="CreateCourse"
      component={CreateCourseScreen}
      options={{ title: "Create Course" }}
    />
    <ManageCoursesStack.Screen
      name="CourseContentUpload"
      component={CourseContentUploadScreen}
      options={{ title: "Course Content" }}
    />
  </ManageCoursesStack.Navigator>
);
