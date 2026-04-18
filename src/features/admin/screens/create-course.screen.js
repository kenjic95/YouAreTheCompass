import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CreateCourseForm } from "../components/create-course-form.component";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { useCategoryCatalog } from "../../../services/learnings/category-catalog.context";

const normalizePriceInput = (value) => String(value ?? "").replace(/[^0-9.]/g, "");

export const CreateCourseScreen = ({ navigation, route }) => {
  const { categories } = useCategoryCatalog();
  const { courses, updateCourse } = useCourseCatalog();
  const editCourseId = route?.params?.editCourseId;
  const courseToEdit = useMemo(
    () => (editCourseId ? courses.find((course) => course?.id === editCourseId) : null),
    [courses, editCourseId]
  );
  const isEditMode = Boolean(courseToEdit?.id);
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
      [...(courses ?? [])]
        .filter((course) => course?.id !== courseToEdit?.id)
        .sort((a, b) =>
          String(a?.courseTitle ?? "").localeCompare(String(b?.courseTitle ?? ""))
        ),
    [courses, courseToEdit]
  );

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const matchedCategory = (categories ?? []).find(
      (category) => String(category?.id) === String(courseToEdit?.categoryId)
    );
    const matchedPrerequisiteCourse = (courses ?? []).find(
      (course) =>
        String(course?.id) === String(courseToEdit?.prerequisiteCourseId)
    );

    setTitle(courseToEdit?.courseTitle ?? "");
    setSelectedCategory(matchedCategory ?? null);
    setOriginalPrice(
      normalizePriceInput(courseToEdit?.priceNumber ?? courseToEdit?.priceValue ?? "")
    );
    setCoursePhoto(
      courseToEdit?.photoUrl
        ? { uri: courseToEdit.photoUrl, name: courseToEdit.photoName || "Course photo" }
        : null
    );
    if (courseToEdit?.isFoundationCourse) {
      setCourseType("foundation");
    } else if (courseToEdit?.prerequisiteCourseId) {
      setCourseType("prerequisite");
    } else {
      setCourseType("standard");
    }
    setSelectedPrerequisiteCourse(matchedPrerequisiteCourse ?? null);
  }, [categories, courses, courseToEdit, isEditMode]);

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

    if (isEditMode) {
      const updatedCourse = updateCourse(courseToEdit.id, {
        courseTitle: normalizedTitle,
        categoryId: selectedCategory.id,
        categoryTitle: selectedCategory.categoryTitle,
        priceValue: `$${normalizedPrice}`,
        priceNumber: Number(normalizedPrice),
        photoUrl: coursePhoto?.uri ?? "",
        photoName: coursePhoto?.name ?? "",
        isFoundationCourse: courseType === "foundation",
        prerequisiteCourseId:
          courseType === "prerequisite" ? selectedPrerequisiteCourse?.id : null,
      });

      if (!updatedCourse) {
        Alert.alert("Update failed", "Course could not be updated.");
        return;
      }

      navigation.goBack();
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
      heading={isEditMode ? "Edit Course" : "Create Course"}
      subtitle={
        isEditMode
          ? "Update course details and save changes."
          : "Fill in the basic course details. Content upload fields will be added next."
      }
      submitLabel={isEditMode ? "Save Changes" : "Create Course"}
    />
  );
};
