import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F3FAFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F3342",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#4A6780",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#142636",
    marginBottom: 6,
  },
  courseMeta: {
    fontSize: 15,
    color: "#587086",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 15,
    color: "#4C6378",
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F3342",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0E79C8",
  },
  infoBox: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#E6F4FF",
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#4A6780",
    lineHeight: 18,
  },
  placeOrderButton: {
    marginTop: "auto",
    marginBottom: 18,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
