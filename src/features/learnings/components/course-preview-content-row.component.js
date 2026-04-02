import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  coursePreviewTypeConfig,
  normalizeCoursePreviewType,
} from "../../../services/learnings/course-preview.mock";
import { styles } from "./course-preview.styles";

export const CoursePreviewContentRow = ({ item, index }) => {
  const contentType = normalizeCoursePreviewType(
    item?.contentType ?? item?.fileFormat
  );
  const typeConfig =
    coursePreviewTypeConfig[contentType] ?? coursePreviewTypeConfig.video;
  const rowId = item?.contentId ?? index + 1;
  const formatLabel = item?.fileFormat
    ? String(item.fileFormat).toUpperCase()
    : typeConfig.label.toUpperCase();
  const helperText =
    contentType === "video"
      ? item?.contentDuration ?? "Video"
      : item?.fileSize ?? formatLabel;

  return (
    <View style={styles.contentRow}>
      <Text style={styles.contentId}>{rowId}</Text>
      <View style={styles.contentBody}>
        <Text style={styles.contentDuration}>{helperText}</Text>
        <Text style={styles.contentTitle}>{item.contentTitle}</Text>
        <View style={styles.typePill}>
          <Ionicons
            name={typeConfig.icon}
            size={14}
            color="#496074"
            style={styles.typeIcon}
          />
          <Text style={styles.typePillText}>{typeConfig.label}</Text>
        </View>
      </View>
      <View style={styles.playButton}>
        <Ionicons name={typeConfig.actionIcon} size={24} color="#A9D4F4" />
      </View>
    </View>
  );
};
