import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../../../../components/typography/text.component";
import { COMPLETION_FILTERS } from "./student-progress.constants";

export const StudentProgressFilters = ({
  completionFilter,
  onOpenCategory,
  onOpenCourse,
  onSetCompletionFilter,
  selectedCategoryLabel,
  selectedCourseLabel,
  styles,
}) => (
  <View style={styles.filtersWrap}>
    <View style={styles.inlineDropdownRow}>
      <View style={styles.inlineDropdownItem}>
        <Text variant="label" style={styles.sectionLabel}>
          Category
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenCategory}
          style={styles.dropdownButton}
        >
          <Text
            variant="caption"
            style={styles.dropdownButtonText}
            numberOfLines={1}
          >
            {selectedCategoryLabel}
          </Text>
          <Text variant="caption" style={styles.dropdownChevron}>
            ▾
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inlineDropdownItem}>
        <Text variant="label" style={styles.sectionLabel}>
          Course
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenCourse}
          style={styles.dropdownButton}
        >
          <Text
            variant="caption"
            style={styles.dropdownButtonText}
            numberOfLines={1}
          >
            {selectedCourseLabel}
          </Text>
          <Text variant="caption" style={styles.dropdownChevron}>
            ▾
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    <Text variant="label" style={styles.sectionLabel}>
      Completion
    </Text>
    <View style={styles.completionFilterRow}>
      {COMPLETION_FILTERS.map((filter) => {
        const isActive = completionFilter === filter.id;
        return (
          <TouchableOpacity
            key={filter.id}
            activeOpacity={0.85}
            onPress={() => onSetCompletionFilter(filter.id)}
            style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
          >
            <Text
              variant="caption"
              style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);
