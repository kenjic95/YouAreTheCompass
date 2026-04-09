import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import {
  coursePreviewTypeConfig,
  normalizeCoursePreviewType,
} from "../../../services/learnings/course-preview.mock";
import { styles } from "./course-preview.styles";

export const CoursePreviewContentRow = ({
  item,
  index,
  isViewed,
  onPress,
  isLocked = false,
}) => {
  const contentType = normalizeCoursePreviewType(
    item?.contentType ?? item?.fileFormat,
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
    <TouchableOpacity
      style={[styles.contentRow, isLocked ? styles.contentRowLocked : null]}
      activeOpacity={isLocked ? 1 : 0.85}
      onPress={onPress}
      disabled={isLocked}
    >
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
      <View style={[styles.playButton, isViewed ? styles.playButtonViewed : null]}>
        <Ionicons
          name={isLocked ? "lock-closed" : isViewed ? "checkmark" : typeConfig.actionIcon}
          size={24}
          color={isLocked ? "#7D8A97" : isViewed ? "#5EA6DF" : "#A9D4F4"}
        />
      </View>
    </TouchableOpacity>
  );
};
