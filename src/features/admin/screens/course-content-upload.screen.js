import React, { useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { CourseContentUploadForm } from "../components/course-content-upload-form.component";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { useCategoryCatalog } from "../../../services/learnings/category-catalog.context";
import { useUserProfile } from "../../../services/auth/user-profile.context";
import { parseDurationLabelToSeconds } from "../../../services/learnings/course-duration.utils";

const getAssetName = (asset, fallbackName) =>
  asset?.name || asset?.fileName || fallbackName;

const formatVideoDurationLabel = (durationSeconds) => {
  const safeSeconds = Math.max(0, Math.round(Number(durationSeconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

const normalizeDurationToSeconds = (value) => {
  const numericValue = Number(value) || 0;
  if (numericValue <= 0) {
    return 0;
  }

  // Some pickers return milliseconds while others return seconds.
  if (numericValue > 1000) {
    return numericValue / 1000;
  }

  return numericValue;
};

const getContentTypeConfig = (kind, asset = {}) => {
  if (kind === "pdf") {
    return {
      contentType: "pdf",
      fileFormat: "pdf",
      fileSize: "Uploaded file",
    };
  }

  if (kind === "image") {
    return {
      contentType: "jpg",
      fileFormat: "jpg",
      fileSize: "Uploaded file",
    };
  }

  const durationSeconds =
    normalizeDurationToSeconds(asset?.durationSeconds) ||
    normalizeDurationToSeconds(asset?.duration) ||
    normalizeDurationToSeconds(asset?.durationMillis);
  const safeDurationSeconds = Math.max(0, Math.round(durationSeconds));

  return {
    contentType: "video",
    contentDuration:
      safeDurationSeconds > 0
        ? formatVideoDurationLabel(safeDurationSeconds)
        : "0m 0s",
    contentDurationSeconds: safeDurationSeconds,
  };
};

const toPriceLabel = (value) => {
  const normalized = Number(
    String(value ?? "")
      .replace(/[^0-9.]/g, "")
      .trim()
  );
  const safePrice = Number.isFinite(normalized) ? normalized : 0;
  return `A$${safePrice.toFixed(2)}`;
};

export const CourseContentUploadScreen = ({ route, navigation }) => {
  const courseDraft = route?.params?.courseDraft ?? {};
  const editCourseId = route?.params?.editCourseId;
  const { courses, addCourse, updateCourse } = useCourseCatalog();
  const { categories } = useCategoryCatalog();
  const { authUser, profile } = useUserProfile();
  const courseToEdit = (courses ?? []).find(
    (course) => String(course?.id) === String(editCourseId)
  );
  const isEditMode = Boolean(courseToEdit?.id);
  const [contentTitle, setContentTitle] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editingPartId, setEditingPartId] = useState(null);
  const [contentParts, setContentParts] = useState(() => {
    if (!isEditMode) {
      return [];
    }

    return (courseToEdit?.courseContent ?? []).map((part, index) => {
      const normalizedType = String(
        part?.contentType ?? part?.fileFormat ?? "video"
      ).toLowerCase();
      const inferredKind =
        normalizedType === "pdf"
          ? "pdf"
          : normalizedType === "jpg" ||
            normalizedType === "jpeg" ||
            normalizedType === "png" ||
            normalizedType === "webp"
          ? "image"
          : "video";

      return {
        id: `${courseToEdit.id}-${index + 1}-${Date.now()}`,
        contentId: Number(part?.contentId) || index + 1,
        title: part?.contentTitle || `Part ${index + 1}`,
        asset: {
          kind: inferredKind,
          uri: part?.localUri || "",
          name: part?.localFileName || `${inferredKind}-${index + 1}`,
          mimeType: "",
          durationSeconds:
            Number(part?.contentDurationSeconds) ||
            parseDurationLabelToSeconds(part?.contentDuration),
        },
      };
    });
  });

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission?.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library permission to choose a video."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    setSelectedAsset({
      kind: "video",
      uri: asset.uri,
      name: getAssetName(asset, `video-${Date.now()}.mp4`),
      mimeType: asset.mimeType || "video/mp4",
      durationSeconds:
        normalizeDurationToSeconds(asset?.duration) ||
        normalizeDurationToSeconds(asset?.durationMillis) ||
        normalizeDurationToSeconds(asset?.durationSeconds),
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission?.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library permission to choose an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    setSelectedAsset({
      kind: "image",
      uri: asset.uri,
      name: getAssetName(asset, `image-${Date.now()}.jpg`),
      mimeType: asset.mimeType || "image/jpeg",
    });
  };

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    setSelectedAsset({
      kind: "pdf",
      uri: asset.uri,
      name: getAssetName(asset, `document-${Date.now()}.pdf`),
      mimeType: asset.mimeType || "application/pdf",
    });
  };

  const handleAddContentPart = () => {
    const normalizedTitle = contentTitle.trim();

    if (!normalizedTitle) {
      Alert.alert(
        "Required fields",
        "Add content title before saving this part."
      );
      return;
    }

    if (!editingPartId && !selectedAsset) {
      Alert.alert(
        "Required fields",
        "Choose a file before adding a new content part."
      );
      return;
    }

    setContentParts((previous) => {
      if (editingPartId) {
        return previous.map((part) => {
          if (String(part.id) !== String(editingPartId)) {
            return part;
          }

          return {
            ...part,
            title: normalizedTitle,
            asset: selectedAsset || part.asset,
          };
        });
      }

      const nextContentId =
        previous.length > 0
          ? Math.max(...previous.map((part) => Number(part.contentId) || 0)) + 1
          : 1;

      return [
        ...previous,
        {
          id: `${Date.now()}-${previous.length + 1}`,
          contentId: nextContentId,
          title: normalizedTitle,
          asset: selectedAsset,
        },
      ];
    });

    setContentTitle("");
    setSelectedAsset(null);
    setEditingPartId(null);
  };

  const handleDeleteContentPart = (partId) => {
    setContentParts((previous) => {
      const filtered = previous.filter(
        (part) => String(part.id) !== String(partId)
      );

      return filtered.map((part, index) => ({
        ...part,
        contentId: index + 1,
      }));
    });

    if (String(editingPartId) === String(partId)) {
      setEditingPartId(null);
      setContentTitle("");
      setSelectedAsset(null);
    }
  };

  const handleStartEditContentPart = (part) => {
    if (!part?.id) {
      return;
    }

    setEditingPartId(part.id);
    setContentTitle(part.title ?? "");
    setSelectedAsset(part.asset ?? null);
  };

  const handleCancelEditPart = () => {
    setEditingPartId(null);
    setContentTitle("");
    setSelectedAsset(null);
  };

  const handleUploadCourse = async () => {
    if (isEditMode && !courseToEdit?.id) {
      Alert.alert(
        "Course not found",
        "The selected course no longer exists. Please go back and try again."
      );
      return;
    }

    const normalizedCourseTitle = String(courseDraft?.title ?? "").trim();
    const categoryId = courseDraft?.category?.id;

    if (!isEditMode && (!normalizedCourseTitle || !categoryId)) {
      Alert.alert(
        "Missing draft details",
        "Course title or category is missing. Please go back and complete the draft."
      );
      return;
    }

    if (contentParts.length === 0) {
      Alert.alert(
        "No content parts",
        "Add at least one content part before uploading the course."
      );
      return;
    }

    const mappedCourseContent = contentParts.map((part, index) => {
      const typeConfig = getContentTypeConfig(part?.asset?.kind, part?.asset);
      return {
        contentId: index + 1,
        contentTitle: part.title,
        ...typeConfig,
        localUri: part?.asset?.uri,
        localFileName: part?.asset?.name,
      };
    });

    if (isEditMode) {
      const updatedCourse = await updateCourse(courseToEdit.id, {
        courseContent: mappedCourseContent,
        courseDuration: `${mappedCourseContent.length} parts`,
      });

      if (!updatedCourse) {
        Alert.alert("Update failed", "Unable to update content right now.");
        return;
      }

      Alert.alert("Content saved", "Course content has been updated.");
      navigation.navigate("ManageCoursesHome");
      return;
    }

    const createdCourse = await addCourse({
      categoryId: String(categoryId),
      courseTitle: normalizedCourseTitle,
      author:
        profile?.displayName?.trim() ||
        authUser?.displayName?.trim() ||
        "Course Creator",
      courseDuration: `${mappedCourseContent.length} parts`,
      priceValue: toPriceLabel(courseDraft?.originalPrice),
      watchers: "0",
      rating: "New",
      coursePhoto:
        courseDraft?.coursePhotoUri ||
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      courseContent: mappedCourseContent,
      ownerId: authUser?.uid ?? "creator-local",
      isFoundationCourse: courseDraft?.courseType === "foundation",
      prerequisiteCourseId:
        courseDraft?.courseType === "prerequisite"
          ? courseDraft?.prerequisiteCourseId
          : null,
    });

    if (!createdCourse) {
      Alert.alert(
        "Upload failed",
        "Unable to create course right now. Please check Firestore rules and try again."
      );
      return;
    }

    Alert.alert(
      "Course uploaded",
      "Your new course is now available in the student course list."
    );
    navigation.navigate("ManageCoursesHome");
  };

  const courseInfo = isEditMode
    ? {
        title: courseToEdit?.courseTitle,
        categoryTitle:
          courseToEdit?.categoryTitle ||
          (categories ?? []).find(
            (category) =>
              String(category?.id) === String(courseToEdit?.categoryId)
          )?.categoryTitle,
        originalPrice: String(courseToEdit?.priceNumber ?? "0.00").replace(
          /[^0-9.]/g,
          ""
        ),
      }
    : {
        title: courseDraft?.title,
        categoryTitle: courseDraft?.category?.categoryTitle,
        originalPrice: courseDraft?.originalPrice,
      };

  return (
    <CourseContentUploadForm
      courseInfo={courseInfo}
      contentTitle={contentTitle}
      onChangeContentTitle={setContentTitle}
      selectedAsset={selectedAsset}
      onPickVideo={pickVideo}
      onPickPdf={pickPdf}
      onPickImage={pickImage}
      onAddContentPart={handleAddContentPart}
      contentParts={contentParts}
      onDeleteContentPart={handleDeleteContentPart}
      onUploadCourse={handleUploadCourse}
      onStartEditContentPart={handleStartEditContentPart}
      onCancelEditPart={handleCancelEditPart}
      editingPartId={editingPartId}
      heading={isEditMode ? "Edit Course Content" : "Upload Course Content"}
      subtitle={
        isEditMode
          ? "Update each part title/file. You can add and delete parts before saving."
          : "Add each part one by one with a title and one file (video/pdf/image)."
      }
      uploadCourseLabel={isEditMode ? "Save Content Changes" : "Upload Course"}
    />
  );
};
