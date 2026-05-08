import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6FBFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: "#1e4565",
    marginBottom: 6,
  },
  subtitle: {
    color: "#4b6780",
  },
  refreshButton: {
    backgroundColor: "#E5F0FB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#D7E6F3",
  },
  refreshButtonText: {
    color: "#31628A",
  },
  filtersWrap: {
    marginBottom: 10,
  },
  inlineDropdownRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  inlineDropdownItem: {
    flex: 1,
  },
  sectionLabel: {
    color: "#1f4d72",
    marginBottom: 8,
  },
  dropdownButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E6F3",
    borderRadius: 10,
    minHeight: 42,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    color: "#2D5675",
    flex: 1,
    marginRight: 10,
  },
  dropdownChevron: {
    color: "#5E7F99",
    fontSize: 14,
  },
  completionFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E5F0FB",
  },
  filterChipActive: {
    backgroundColor: "#4F9FE2",
  },
  filterChipText: {
    color: "#31628A",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  errorText: {
    color: "#b53b3b",
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyText: {
    color: "#526f86",
    marginTop: 12,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#D7E6F3",
    backgroundColor: "#EDF6FF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeaderText: {
    color: "#29516f",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E3EEF8",
    backgroundColor: "#FFFFFF",
  },
  tableCellText: {
    color: "#355971",
  },
  studentColumn: {
    flex: 1.4,
    marginRight: 8,
  },
  progressColumn: {
    flex: 1.2,
    marginRight: 8,
  },
  statusColumn: {
    flex: 1,
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dropdownPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: "70%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D7E6F3",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F9",
  },
  dropdownOptionText: {
    color: "#2D5675",
  },
});
