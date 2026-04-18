import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";

export const CoursePdfViewerScreen = ({ route }) => {
  const contentItem = route?.params?.contentItem ?? {};
  const pdfUri =
    contentItem?.localUri ||
    contentItem?.pdfUri ||
    contentItem?.uri ||
    contentItem?.url ||
    "";

  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <Text variant="label">{contentItem?.contentTitle ?? "Course PDF"}</Text>
        {pdfUri ? (
          <WebView
            source={{ uri: pdfUri }}
            style={styles.webview}
            originWhitelist={["*"]}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text variant="caption">
              No PDF source is available for this content item.
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
  webview: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
