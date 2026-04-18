import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CreateCourseForm } from "../components/create-course-form.component";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { useCategoryCatalog } from "../../../services/learnings/category-catalog.context";

export const CreateCourseScreen = ({ navigation }) => {
  const { categories } = useCategoryCatalog();
  const { courses } = useCourseCatalog();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originalPrice, setOriginalPrice] = useState("");
  const [coursePhoto, setCoursePhoto] = useState(null);
  const [courseType, setCourseType] = useState("standard");
  const [selectedPrerequisiteCourse, setSelectedPrerequisiteCourse] =
    useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPrerequisiteOpen, setIsPrerequisiteOpen] = useState(false);

  const orderedCategories = useMemo(
    () =>
      [...(categories ?? [])].sort((a, b) =>
        String(a?.categoryTitle ?? "").localeCompare(
          String(b?.categoryTitle ?? "")
        )
      ),
    [categories]
  );

  const orderedPrerequisiteCourses = useMemo(
    () =>
      [...(courses ?? [])].sort((a, b) =>
        String(a?.courseTitle ?? "").localeCompare(String(b?.courseTitle ?? ""))
      ),
    [courses]
  );

  const handlePickCoursePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission?.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library permission to choose a course photo."
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

    setCoursePhoto({
      uri: resolvedImageUri,
      name: asset.fileName || asset.name || `course-photo-${Date.now()}.jpg`,
    });
  };

  const handleSubmit = () => {
    const normalizedTitle = title.trim();
    const normalizedPrice = originalPrice.trim();

    if (!normalizedTitle || !selectedCategory || !normalizedPrice) {
      Alert.alert("Required fields", "Please fill out all required fields.");
      return;
    }

    if (courseType === "prerequisite" && !selectedPrerequisiteCourse?.id) {
      Alert.alert(
        "Required fields",
        "Select a prerequisite course for this prerequisite type."
      );
      return;
    }

    navigation.navigate("CourseContentUpload", {
      courseDraft: {
        title: normalizedTitle,
        category: selectedCategory,
        originalPrice: normalizedPrice,
        coursePhotoUri: coursePhoto?.uri ?? "",
        coursePhotoName: coursePhoto?.name ?? "",
        courseType,
        prerequisiteCourseId:
          courseType === "prerequisite" ? selectedPrerequisiteCourse?.id : null,
      },
    });
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
      coursePhoto={coursePhoto}
      onPickCoursePhoto={handlePickCoursePhoto}
      courseType={courseType}
      onSelectCourseType={(nextType) => {
        setCourseType(nextType);
        if (nextType !== "prerequisite") {
          setSelectedPrerequisiteCourse(null);
          setIsPrerequisiteOpen(false);
        }
      }}
      selectedPrerequisiteCourse={selectedPrerequisiteCourse}
      isPrerequisiteOpen={isPrerequisiteOpen}
      onTogglePrerequisite={() =>
        setIsPrerequisiteOpen((previous) => !previous)
      }
      prerequisiteCourses={orderedPrerequisiteCourses}
      onSelectPrerequisiteCourse={(course) => {
        setSelectedPrerequisiteCourse(course);
        setIsPrerequisiteOpen(false);
      }}
      onSubmit={handleSubmit}
    />
  );
};
