import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Text } from "../../../../components/typography/text.component";
import { formatPercent } from "./student-progress.constants";

export const StudentProgressTable = ({
  filteredRows,
  isLoading,
  isRefreshing,
  onRefresh,
  studentNamesById,
  styles,
}) => (
  <FlatList
    data={filteredRows}
    keyExtractor={(item) => item.id}
    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    ListEmptyComponent={
      <Text variant="caption" style={styles.emptyText}>
        {isLoading
          ? "Loading student progress..."
          : "No students match this course/completion filter."}
      </Text>
    }
    contentContainerStyle={styles.listContent}
    ListHeaderComponent={
      filteredRows.length > 0 ? (
        <View style={styles.tableHeaderRow}>
          <Text variant="caption" style={[styles.tableHeaderText, styles.studentColumn]}>
            Student
          </Text>
          <Text variant="caption" style={[styles.tableHeaderText, styles.progressColumn]}>
            Progress
          </Text>
          <Text variant="caption" style={[styles.tableHeaderText, styles.statusColumn]}>
            Status
          </Text>
        </View>
      ) : null
    }
    renderItem={({ item }) => {
      const studentId = String(item?.userId ?? "");
      const studentName = studentNamesById?.[studentId] || studentId || "Unknown";
      const completed = Number(item?.completedContentCount ?? 0) || 0;
      const total = Number(item?.totalContentCount ?? 0) || 0;
      const progressPercent = Number(item?.progressPercent ?? 0) || 0;
      const statusLabel =
        progressPercent <= 0
          ? "Not Started"
          : progressPercent >= 100
          ? "Completed"
          : "In Progress";

      return (
        <View style={styles.tableRow}>
          <Text
            variant="caption"
            numberOfLines={1}
            style={[styles.tableCellText, styles.studentColumn]}
          >
            {studentName}
          </Text>
          <Text variant="caption" style={[styles.tableCellText, styles.progressColumn]}>
            {formatPercent(progressPercent)} ({completed}/{total})
          </Text>
          <Text variant="caption" style={[styles.tableCellText, styles.statusColumn]}>
            {statusLabel}
          </Text>
        </View>
      );
    }}
  />
);
