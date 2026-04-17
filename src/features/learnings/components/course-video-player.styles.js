import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#132029",
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#0D1116",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  loadingText: {
    color: "#DDE8F3",
  },
  errorContainer: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  errorText: {
    color: "#FFB4B4",
    fontSize: 12,
  },
  controlsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  timelineWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "rgba(12, 20, 28, 0.42)",
  },
  timeLabel: {
    width: "100%",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 12,
  },
  progressTrack: {
    width: "100%",
    height: 5,
    borderRadius: 6,
    backgroundColor: "#70757C",
    overflow: "hidden",
    justifyContent: "center",
  },
  progressTouchArea: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: 8,
  },
  progressFill: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  progressThumb: {
    position: "absolute",
    marginLeft: -5,
    width: 10,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#F0F3F6",
  },
  bottomBar: {
    backgroundColor: "#B5D1E8",
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  actionButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F1F2F4",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  actionButtonPrimary: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#6DAFDE",
    marginHorizontal: 6,
  },
});
