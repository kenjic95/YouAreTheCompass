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
});
