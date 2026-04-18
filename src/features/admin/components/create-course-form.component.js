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
  PrimaryButton,
  PrimaryButtonText,
  Screen,
  Subtitle,
  TextInput,
  Title,
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
