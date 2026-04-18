import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import { categoriesMockContext } from "../../../services/learnings/categories.mock";
import { CreateCourseForm } from "../components/create-course-form.component";

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
    <CreateCourseForm
      title={title}
      onChangeTitle={setTitle}
      selectedCategory={selectedCategory}
      isCategoryOpen={isCategoryOpen}
      onToggleCategory={() => setIsCategoryOpen((previous) => !previous)}
      categories={orderedCategories}
      onSelectCategory={(category) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);
      }}
      originalPrice={originalPrice}
      onChangeOriginalPrice={setOriginalPrice}
      onSubmit={handleSubmit}
    />
  );
};
