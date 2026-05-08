import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/typography/text.component";
import { StudentProgressDropdownModal } from "./student-progress/student-progress-dropdown-modal.component";
import { StudentProgressFilters } from "./student-progress/student-progress-filters.component";
import { styles } from "./student-progress/student-progress.styles";
import { StudentProgressTable } from "./student-progress/student-progress-table.component";
import { useStudentProgressData } from "./student-progress/use-student-progress-data.hook";

export const StudentProgressScreen = () => {
  const {
    completionFilter,
    filteredRows,
    isLoading,
    isRefreshing,
    loadError,
    onRefresh,
    roleLabel,
    selectableCategories,
    selectableCourses,
    selectedCategoryLabel,
    selectedCourseLabel,
    setCompletionFilter,
    setSelectedCategoryId,
    setSelectedCourseId,
    studentNamesById,
  } = useStudentProgressData();

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text variant="title" style={styles.title}>
            Student Progress
          </Text>
          <Text variant="caption" style={styles.subtitle}>
            {roleLabel === "admin"
              ? "Showing all student enrollments and progress."
              : "Showing student progress for your courses."}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} onPress={onRefresh} style={styles.refreshButton}>
          <Text variant="caption" style={styles.refreshButtonText}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>

      {loadError ? (
        <Text variant="caption" style={styles.errorText}>
          {loadError}
        </Text>
      ) : null}

      <StudentProgressFilters
        completionFilter={completionFilter}
        onOpenCategory={() => setIsCategoryDropdownOpen(true)}
        onOpenCourse={() => setIsCourseDropdownOpen(true)}
        onSetCompletionFilter={setCompletionFilter}
        selectedCategoryLabel={selectedCategoryLabel}
        selectedCourseLabel={selectedCourseLabel}
        styles={styles}
      />

      <StudentProgressTable
        filteredRows={filteredRows}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        studentNamesById={studentNamesById}
        styles={styles}
      />

      <StudentProgressDropdownModal
        allLabel="All Categories"
        onClose={() => setIsCategoryDropdownOpen(false)}
        onSelect={(id) => {
          setSelectedCategoryId(id);
          setSelectedCourseId("all");
          setIsCategoryDropdownOpen(false);
        }}
        options={selectableCategories}
        styles={styles}
        visible={isCategoryDropdownOpen}
      />

      <StudentProgressDropdownModal
        allLabel="All Courses"
        onClose={() => setIsCourseDropdownOpen(false)}
        onSelect={(id) => {
          setSelectedCourseId(id);
          setIsCourseDropdownOpen(false);
        }}
        options={selectableCourses}
        styles={styles}
        visible={isCourseDropdownOpen}
      />
    </View>
  );
};
