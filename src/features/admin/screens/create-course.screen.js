import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import { categoriesMockContext } from "../../../services/learnings/categories.mock";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #f6fbff;
`;

const KeyboardContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Inner = styled.View`
  padding: 20px 18px 28px;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 24px;
  color: #1e4565;
`;

const Subtitle = styled.Text`
  margin-top: 6px;
  margin-bottom: 20px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #4b6780;
`;

const Label = styled.Text`
  margin-top: 14px;
  margin-bottom: 8px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 14px;
  color: #2b4f6d;
`;

const TextInput = styled.TextInput`
  border-radius: 12px;
  padding: 12px 14px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 15px;
  color: #173851;
`;

const CategoryButton = styled.TouchableOpacity`
  border-radius: 12px;
  padding: 12px 14px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
`;

const CategoryButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 15px;
  color: ${(props) => (props.isPlaceholder ? "#6d8295" : "#173851")};
`;

const CategorySection = styled.View`
  margin-bottom: ${(props) => (props.isOpen ? "8px" : "0px")};
`;

const CategoryList = styled.View`
  margin-top: 10px;
  border-radius: 12px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  overflow: hidden;
`;

const CategoryRow = styled.TouchableOpacity`
  padding: 12px 14px;
  border-bottom-width: ${(props) => (props.hasDivider ? "1px" : "0px")};
  border-bottom-color: #edf3f8;
`;

const CategoryRowText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #23455f;
`;

const PrimaryButton = styled.TouchableOpacity`
  margin-top: 26px;
  border-radius: 14px;
  padding: 14px;
  align-items: center;
  background-color: #4f9fe2;
`;

const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
`;

export const CreateCourseScreen = () => {
  const { categories } = categoriesMockContext;
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originalPrice, setOriginalPrice] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const orderedCategories = useMemo(
    () =>
      [...(categories ?? [])].sort((a, b) =>
        String(a?.categoryTitle ?? "").localeCompare(
          String(b?.categoryTitle ?? "")
        )
      ),
    [categories]
  );

  const handleSubmit = () => {
    const normalizedTitle = title.trim();
    const normalizedPrice = originalPrice.trim();

    if (!normalizedTitle || !selectedCategory || !normalizedPrice) {
      Alert.alert("Required fields", "Please fill out all required fields.");
      return;
    }

    Alert.alert(
      "Course draft captured",
      "This form is ready. Save/upload integration will be added next."
    );
  };

  return (
    <Screen>
      <KeyboardContainer
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
              onChangeText={setTitle}
              placeholder="e.g. Intro to Coastal Boating"
              placeholderTextColor="#8ba0b2"
            />

            <CategorySection isOpen={isCategoryOpen}>
              <Label>Category</Label>
              <CategoryButton
                activeOpacity={0.85}
                onPress={() => setIsCategoryOpen((previous) => !previous)}
              >
                <CategoryButtonText isPlaceholder={!selectedCategory}>
                  {selectedCategory?.categoryTitle ?? "Select a category"}
                </CategoryButtonText>
              </CategoryButton>

              {isCategoryOpen ? (
                <CategoryList>
                  {orderedCategories.map((item, index) => (
                    <CategoryRow
                      key={item.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedCategory(item);
                        setIsCategoryOpen(false);
                      }}
                      hasDivider={index < orderedCategories.length - 1}
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
              onChangeText={setOriginalPrice}
              placeholder="e.g. 29.99"
              placeholderTextColor="#8ba0b2"
              keyboardType="decimal-pad"
            />

            <PrimaryButton activeOpacity={0.9} onPress={handleSubmit}>
              <PrimaryButtonText>Create Course</PrimaryButtonText>
            </PrimaryButton>
          </Inner>
        </Content>
      </KeyboardContainer>
    </Screen>
  );
};
