import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { LearningsScreen } from "../../features/learnings/screens/learnings.screen";
import { CoursesScreen } from "../../features/learnings/screens/courses.screen";
import { CoursePreviewScreen } from "../../features/learnings/screens/course-preview.screen";
import { MyCoursePreviewScreen } from "../../features/learnings/screens/my-course-preview.screen";
import { CourseCheckoutScreen } from "../../features/learnings/screens/course-checkout.screen";
import { CourseVideoPlayerScreen } from "../../features/learnings/screens/course-video-player.screen";
import { CourseImageViewerScreen } from "../../features/learnings/screens/course-image-viewer.screen";
import { CoursePdfViewerScreen } from "../../features/learnings/screens/course-pdf-viewer.screen";
import { PurchasedCoursesProvider } from "../../services/learnings/purchased-courses.context";

const LearningsStack = createStackNavigator();

export const LearningsNavigator = () => {
  return (
    <PurchasedCoursesProvider>
      <LearningsStack.Navigator>
        <LearningsStack.Screen name="Create" component={LearningsScreen} />
        <LearningsStack.Screen name="Courses" component={CoursesScreen} />
        <LearningsStack.Screen name="Course" component={CoursePreviewScreen} />
        <LearningsStack.Screen
          name="MyCourse"
          component={MyCoursePreviewScreen}
        />
        <LearningsStack.Screen
          name="Checkout"
          component={CourseCheckoutScreen}
        />
        <LearningsStack.Screen
          name="CoursePlayer"
          component={CourseVideoPlayerScreen}
          options={{ headerShown: false }}
        />
        <LearningsStack.Screen
          name="CourseImageViewer"
          component={CourseImageViewerScreen}
          options={{ title: "Image Viewer" }}
        />
        <LearningsStack.Screen
          name="CoursePdfViewer"
          component={CoursePdfViewerScreen}
          options={{ title: "PDF Viewer" }}
        />
      </LearningsStack.Navigator>
    </PurchasedCoursesProvider>
  );
};
