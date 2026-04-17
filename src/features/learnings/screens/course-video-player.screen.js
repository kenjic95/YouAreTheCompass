import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";

const bottomActions = [
  { id: "back", label: "Back", icon: "arrow-back" },
  { id: "rewind", label: "-10s", icon: "play-back" },
  { id: "playPause", label: "Play/Pause", icon: "pause-circle" },
  { id: "forward", label: "+10s", icon: "play-forward" },
  { id: "next", label: "Next", icon: "document-text-outline" },
];

export const CourseVideoPlayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const course = route?.params?.course;
  const contentItem = route?.params?.contentItem;

  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="videocam-outline" size={42} color="#F3F6F9" />
          <Text variant="label" style={styles.placeholderTitle}>
            {contentItem?.contentTitle ?? "Course Video"}
          </Text>
          <Text style={styles.placeholderSubtitle}>
            {course?.courseTitle ?? "Course"} video player area
          </Text>
        </View>

        <View style={styles.bottomBar}>
          {bottomActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.8}
              style={styles.actionButton}
              onPress={() => {
                if (action.id === "back") {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name={action.icon} size={22} color="#EAF4FB" />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#132029",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  videoPlaceholder: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: "#2B3D4A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  placeholderTitle: {
    color: "#F7FBFF",
    marginTop: 12,
    textAlign: "center",
  },
  placeholderSubtitle: {
    color: "#D6E4EF",
    marginTop: 6,
    textAlign: "center",
  },
  bottomBar: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: "#1E313E",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionLabel: {
    color: "#EAF4FB",
    fontSize: 11,
    marginTop: 4,
  },
});
