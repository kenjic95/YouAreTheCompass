import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import {
  Action,
  ActionText,
  AddCategoryAction,
  AddCategoryActionText,
  AddCategoryInput,
  AddCategoryRow,
  AddCategoryChip,
  AddCategoryChipText,
  CategoryChip,
  CategoryChipText,
  CourseCard,
  CourseListHeading,
  CourseMeta,
  CourseTitle,
  Header,
  Row,
  Screen,
  Subtitle,
  Title,
  UploadButton,
  UploadButtonText,
} from "./manage-courses.styles";

export const ManageCoursesContent = ({
  canAccessCreator,
  subtitle,
  emptyMessage,
  visibleCourses,
  categoryGroups,
  onUploadPress,
  onAddCategory,
  onEditPress,
  onViewAnalyticsPress,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const filteredCourses = useMemo(() => {
    if (selectedCategoryId === "all") {
      return visibleCourses;
    }

    return (visibleCourses ?? []).filter(
      (course) => String(course?.categoryId) === String(selectedCategoryId)
    );
  }, [selectedCategoryId, visibleCourses]);

  if (!canAccessCreator) {
    return (
      <Screen>
        <Header>
          <Title>Course Creator</Title>
          <Subtitle>
            Access denied. This area is only for teacher/admin accounts.
          </Subtitle>
        </Header>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header>
        <Title>Course Creator</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>

      <UploadButton onPress={onUploadPress}>
        <UploadButtonText>Upload New Course</UploadButtonText>
      </UploadButton>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryListContent}
      >
        <AddCategoryChip
          activeOpacity={0.85}
          onPress={() => setIsAddingCategory((previous) => !previous)}
        >
          <AddCategoryChipText>+</AddCategoryChipText>
        </AddCategoryChip>
        <CategoryChip
          activeOpacity={0.85}
          isActive={selectedCategoryId === "all"}
          onPress={() => setSelectedCategoryId("all")}
        >
          <CategoryChipText isActive={selectedCategoryId === "all"}>
            All ({visibleCourses.length})
          </CategoryChipText>
        </CategoryChip>
        {(categoryGroups ?? []).map((category) => (
          <CategoryChip
            key={String(category.id)}
            activeOpacity={0.85}
            isActive={String(selectedCategoryId) === String(category.id)}
            onPress={() => setSelectedCategoryId(category.id)}
          >
            <CategoryChipText
              isActive={String(selectedCategoryId) === String(category.id)}
            >
              {category.title} ({category.count})
            </CategoryChipText>
          </CategoryChip>
        ))}
      </ScrollView>

      {isAddingCategory ? (
        <AddCategoryRow>
          <AddCategoryInput
            value={newCategoryTitle}
            onChangeText={setNewCategoryTitle}
            placeholder="New category title"
            placeholderTextColor="#8ba0b2"
          />
          <AddCategoryAction
            activeOpacity={0.85}
            onPress={() => {
              const didAdd = onAddCategory?.(newCategoryTitle);
              if (didAdd) {
                setNewCategoryTitle("");
                setIsAddingCategory(false);
              }
            }}
          >
            <AddCategoryActionText>Add</AddCategoryActionText>
          </AddCategoryAction>
          <AddCategoryAction
            variant="cancel"
            activeOpacity={0.85}
            onPress={() => {
              setNewCategoryTitle("");
              setIsAddingCategory(false);
            }}
          >
            <AddCategoryActionText variant="cancel">
              Cancel
            </AddCategoryActionText>
          </AddCategoryAction>
        </AddCategoryRow>
      ) : null}

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<CourseMeta>{emptyMessage}</CourseMeta>}
        ListHeaderComponent={
          <CourseListHeading>
            {selectedCategoryId === "all" ? "All Courses" : "Courses"}
          </CourseListHeading>
        }
        renderItem={({ item }) => (
          <CourseCard>
            <CourseTitle>{item.courseTitle}</CourseTitle>
            <CourseMeta>{item.author}</CourseMeta>
            <CourseMeta>Owner ID: {item.ownerId}</CourseMeta>
            <CourseMeta>{item.priceValue}</CourseMeta>
            <Row>
              <Action onPress={onEditPress}>
                <ActionText>Edit</ActionText>
              </Action>
              <Action onPress={onViewAnalyticsPress}>
                <ActionText>View Analytics</ActionText>
              </Action>
            </Row>
          </CourseCard>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  categoryListContent: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    alignItems: "center",
  },
});
