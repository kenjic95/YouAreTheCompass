import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Action,
  ActionText,
  AccessMessage,
  AddCategoryAction,
  AddCategoryActionText,
  AddCategoryInput,
  AddCategoryPhotoButton,
  AddCategoryPhotoButtonText,
  AddCategoryPhotoPreview,
  AddCategoryRow,
  AddCategoryChip,
  AddCategoryChipText,
  CategoryChip,
  CategoryDeleteButton,
  CategoryDeleteButtonText,
  CategoryChipText,
  ControlsContainer,
  CourseCard,
  CourseListHeading,
  CourseMeta,
  CourseTitle,
  Row,
  Screen,
  UploadButton,
  UploadButtonText,
} from "./manage-courses.styles";

export const ManageCoursesContent = ({
  canAccessCreator,
  emptyMessage,
  visibleCourses,
  categoryGroups,
  onUploadPress,
  onAddCategory,
  onEditPress,
  onEditContentPress,
  onDeletePress,
  onDeleteCategory,
}) => {
  const coursesListRef = useRef(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [deleteArmedCategoryId, setDeleteArmedCategoryId] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryPhoto, setNewCategoryPhoto] = useState(null);

  const filteredCourses = useMemo(() => {
    if (selectedCategoryId === "all") {
      return visibleCourses;
    }

    return (visibleCourses ?? []).filter(
      (course) => String(course?.categoryId) === String(selectedCategoryId)
    );
  }, [selectedCategoryId, visibleCourses]);

  useEffect(() => {
    coursesListRef.current?.scrollToOffset?.({
      offset: 0,
      animated: false,
    });
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedCategoryId === "all") {
      return;
    }

    const isSelectedCategoryAvailable = (categoryGroups ?? []).some(
      (category) => String(category?.id) === String(selectedCategoryId)
    );

    if (!isSelectedCategoryAvailable) {
      setSelectedCategoryId("all");
    }
  }, [categoryGroups, selectedCategoryId]);

  const handlePickCategoryPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission?.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library permission to choose a category photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    const resolvedImageUri = asset?.base64
      ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
      : asset.uri;

    setNewCategoryPhoto({
      uri: resolvedImageUri,
      name: asset.fileName || asset.name || "Selected category photo",
    });
  };

  if (!canAccessCreator) {
    return (
      <Screen>
        <AccessMessage>
          Access denied. This area is only for teacher/admin accounts.
        </AccessMessage>
      </Screen>
    );
  }

  return (
    <Screen>
      <ControlsContainer>
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
            onPress={() => {
              setDeleteArmedCategoryId(null);
              setSelectedCategoryId("all");
            }}
          >
            <CategoryChipText isActive={selectedCategoryId === "all"}>
              All ({visibleCourses.length})
            </CategoryChipText>
          </CategoryChip>
          {(categoryGroups ?? []).map((category) => {
            const isActive = String(selectedCategoryId) === String(category.id);
            const isDeleteArmed =
              String(deleteArmedCategoryId) === String(category.id);

            return (
              <CategoryChip
                key={String(category.id)}
                activeOpacity={0.85}
                disabled={isDeleteArmed}
                isActive={isActive}
                onLongPress={() => setDeleteArmedCategoryId(category.id)}
                onPress={() => {
                  setDeleteArmedCategoryId(null);
                  setSelectedCategoryId(category.id);
                }}
              >
                <CategoryChipText isActive={isActive}>
                  {category.title} ({category.count})
                </CategoryChipText>
                {isDeleteArmed ? (
                  <CategoryDeleteButton
                    activeOpacity={0.85}
                    isActive={isActive}
                    onPress={() => {
                      setDeleteArmedCategoryId(null);
                      onDeleteCategory?.(category);
                    }}
                  >
                    <CategoryDeleteButtonText isActive={isActive}>
                      ✕
                    </CategoryDeleteButtonText>
                  </CategoryDeleteButton>
                ) : null}
              </CategoryChip>
            );
          })}
        </ScrollView>

        {isAddingCategory ? (
          <>
            <AddCategoryPhotoButton
              activeOpacity={0.85}
              onPress={handlePickCategoryPhoto}
            >
              <AddCategoryPhotoButtonText>
                {newCategoryPhoto?.uri
                  ? "Change Category Photo"
                  : "Attach Category Photo"}
              </AddCategoryPhotoButtonText>
            </AddCategoryPhotoButton>
            {newCategoryPhoto?.uri ? (
              <AddCategoryPhotoPreview
                source={{ uri: newCategoryPhoto.uri }}
                resizeMode="cover"
              />
            ) : null}

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
                  const didAdd = onAddCategory?.(
                    newCategoryTitle,
                    newCategoryPhoto?.uri
                  );
                  if (didAdd) {
                    setNewCategoryTitle("");
                    setNewCategoryPhoto(null);
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
                  setNewCategoryPhoto(null);
                  setIsAddingCategory(false);
                }}
              >
                <AddCategoryActionText variant="cancel">
                  Cancel
                </AddCategoryActionText>
              </AddCategoryAction>
            </AddCategoryRow>
          </>
        ) : null}

        <CourseListHeading>
          {selectedCategoryId === "all" ? "All Courses" : "Courses"}
        </CourseListHeading>
      </ControlsContainer>

      <FlatList
        key={`course-list-${selectedCategoryId}`}
        ref={coursesListRef}
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<CourseMeta>{emptyMessage}</CourseMeta>}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CourseCard>
            <CourseTitle>{item.courseTitle}</CourseTitle>
            <CourseMeta>{item.author}</CourseMeta>
            <CourseMeta>Owner ID: {item.ownerId}</CourseMeta>
            <CourseMeta>{item.priceValue}</CourseMeta>
            <Row>
              <Action onPress={() => onEditPress?.(item)}>
                <ActionText>Edit</ActionText>
              </Action>
              <Action onPress={() => onEditContentPress?.(item)}>
                <ActionText>Edit Content</ActionText>
              </Action>
              <Action variant="danger" onPress={() => onDeletePress?.(item)}>
                <ActionText variant="danger">Delete</ActionText>
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
    paddingTop: 4,
    paddingBottom: 6,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 12,
  },
});
