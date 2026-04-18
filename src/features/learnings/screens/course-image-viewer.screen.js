import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";

export const CourseImageViewerScreen = ({ route }) => {
  const contentItem = route?.params?.contentItem ?? {};
  const imageUri =
    contentItem?.localUri ||
    contentItem?.imageUri ||
    contentItem?.uri ||
    contentItem?.url ||
    "";

  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <Text variant="label">
          {contentItem?.contentTitle ?? "Course Image"}
        </Text>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.emptyState}>
            <Text variant="caption">
              No image source is available for this content item.
            </Text>
          </View>
        )}
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F1720",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  image: {
    flex: 1,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
