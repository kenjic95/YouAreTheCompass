import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: "hidden",
  },
  sheetContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: "center",
    width: 56,
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },
  footerSpacer: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A363A",
    marginBottom: 16,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contentNumber: {
    width: 38,
    fontSize: 24,
    fontWeight: "700",
    color: "#5E6A7E",
    marginRight: 10,
    textAlign: "center",
  },
  contentBody: {
    flex: 1,
    paddingRight: 10,
  },
  contentDuration: {
    fontSize: 14,
    color: "#5E6A7E",
    marginBottom: 2,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D2C34",
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E7F1F8",
    alignItems: "center",
    justifyContent: "center",
  },
});
