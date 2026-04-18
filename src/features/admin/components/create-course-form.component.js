import React from "react";
import { Platform } from "react-native";
import {
  CategoryButton,
  CategoryButtonText,
  CategoryList,
  CategoryRow,
  CategoryRowText,
  CategorySection,
  Content,
  Inner,
  KeyboardContainer,
  Label,
  PhotoMeta,
  PhotoPickerButton,
  PhotoPickerButtonText,
  PhotoPreview,
  PhotoPreviewCard,
  PrimaryButton,
  PrimaryButtonText,
  Screen,
  Subtitle,
  TextInput,
  Title,
  TypeOptionButton,
  TypeOptionText,
  TypeSelectorRow,
} from "./create-course.styles";

export const CreateCourseForm = ({
  title,
  onChangeTitle,
  selectedCategory,
  isCategoryOpen,
  onToggleCategory,
  categories,
  onSelectCategory,
  originalPrice,
  onChangeOriginalPrice,
  coursePhoto,
  onPickCoursePhoto,
  courseType,
  onSelectCourseType,
  selectedPrerequisiteCourse,
  isPrerequisiteOpen,
  onTogglePrerequisite,
  prerequisiteCourses,
  onSelectPrerequisiteCourse,
  onSubmit,
}) => (
  <Screen>
    <KeyboardContainer behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Content keyboardShouldPersistTaps="handled">
        <Inner>
          <Title>Create Course</Title>
          <Subtitle>
            Fill in the basic course details. Content upload fields will be
            added next.
          </Subtitle>

          <Label>Course Title</Label>
          <TextInput
            value={title}
            onChangeText={onChangeTitle}
            placeholder="e.g. Intro to Coastal Boating"
            placeholderTextColor="#8ba0b2"
          />

          <Label>Course Photo</Label>
          <PhotoPickerButton activeOpacity={0.85} onPress={onPickCoursePhoto}>
            <PhotoPickerButtonText>Upload Course Photo</PhotoPickerButtonText>
          </PhotoPickerButton>
          {coursePhoto?.uri ? (
            <PhotoPreviewCard>
              <PhotoPreview
                source={{ uri: coursePhoto.uri }}
                resizeMode="cover"
              />
              <PhotoMeta>{coursePhoto?.name ?? "Selected photo"}</PhotoMeta>
            </PhotoPreviewCard>
          ) : null}

          <Label>Course Type</Label>
          <TypeSelectorRow>
            <TypeOptionButton
              activeOpacity={0.85}
              isActive={courseType === "standard"}
              onPress={() => onSelectCourseType("standard")}
            >
              <TypeOptionText isActive={courseType === "standard"}>
                Standard
              </TypeOptionText>
            </TypeOptionButton>
            <TypeOptionButton
              activeOpacity={0.85}
              isActive={courseType === "foundation"}
              onPress={() => onSelectCourseType("foundation")}
            >
              <TypeOptionText isActive={courseType === "foundation"}>
                Foundation
              </TypeOptionText>
            </TypeOptionButton>
            <TypeOptionButton
              activeOpacity={0.85}
              isActive={courseType === "prerequisite"}
              onPress={() => onSelectCourseType("prerequisite")}
            >
              <TypeOptionText isActive={courseType === "prerequisite"}>
                Prerequisite
              </TypeOptionText>
            </TypeOptionButton>
          </TypeSelectorRow>

          {courseType === "prerequisite" ? (
            <CategorySection isOpen={isPrerequisiteOpen}>
              <Label>Prerequisite Course</Label>
              <CategoryButton
                activeOpacity={0.85}
                onPress={onTogglePrerequisite}
              >
                <CategoryButtonText isPlaceholder={!selectedPrerequisiteCourse}>
                  {selectedPrerequisiteCourse?.courseTitle ??
                    "Select prerequisite course"}
                </CategoryButtonText>
              </CategoryButton>

              {isPrerequisiteOpen ? (
                <CategoryList>
                  {prerequisiteCourses.map((item, index) => (
                    <CategoryRow
                      key={item.id}
                      activeOpacity={0.85}
                      onPress={() => onSelectPrerequisiteCourse(item)}
                      hasDivider={index < prerequisiteCourses.length - 1}
                    >
                      <CategoryRowText>{item.courseTitle}</CategoryRowText>
                    </CategoryRow>
                  ))}
                </CategoryList>
              ) : null}
            </CategorySection>
          ) : null}

          <CategorySection isOpen={isCategoryOpen}>
            <Label>Category</Label>
            <CategoryButton activeOpacity={0.85} onPress={onToggleCategory}>
              <CategoryButtonText isPlaceholder={!selectedCategory}>
                {selectedCategory?.categoryTitle ?? "Select a category"}
              </CategoryButtonText>
            </CategoryButton>

            {isCategoryOpen ? (
              <CategoryList>
                {categories.map((item, index) => (
                  <CategoryRow
                    key={item.id}
                    activeOpacity={0.85}
                    onPress={() => onSelectCategory(item)}
                    hasDivider={index < categories.length - 1}
                  >
                    <CategoryRowText>{item.categoryTitle}</CategoryRowText>
                  </CategoryRow>
                ))}
              </CategoryList>
            ) : null}
          </CategorySection>

          <Label>Original Price (AUD)</Label>
          <TextInput
            value={originalPrice}
            onChangeText={onChangeOriginalPrice}
            placeholder="e.g. 29.99"
            placeholderTextColor="#8ba0b2"
            keyboardType="decimal-pad"
          />

          <PrimaryButton activeOpacity={0.9} onPress={onSubmit}>
            <PrimaryButtonText>Create Course</PrimaryButtonText>
          </PrimaryButton>
        </Inner>
      </Content>
    </KeyboardContainer>
  </Screen>
);
