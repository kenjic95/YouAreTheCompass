import React, { useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { CourseContentUploadForm } from "../components/course-content-upload-form.component";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { useUserProfile } from "../../../services/auth/user-profile.context";

const getAssetName = (asset, fallbackName) =>
  asset?.name || asset?.fileName || fallbackName;

const getContentTypeConfig = (kind) => {
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

  return {
    contentType: "video",
    contentDuration: "Uploaded video",
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
  const { addCourse } = useCourseCatalog();
  const { authUser, profile } = useUserProfile();
  const [contentTitle, setContentTitle] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [contentParts, setContentParts] = useState([]);

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

    if (!normalizedTitle || !selectedAsset) {
      Alert.alert(
        "Required fields",
        "Add content title and choose a file before adding the part."
      );
      return;
    }

    setContentParts((previous) => {
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
  };

  const handleUploadCourse = () => {
    const normalizedCourseTitle = String(courseDraft?.title ?? "").trim();
    const categoryId = courseDraft?.category?.id;

    if (!normalizedCourseTitle || !categoryId) {
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
      const typeConfig = getContentTypeConfig(part?.asset?.kind);
      return {
        contentId: index + 1,
        contentTitle: part.title,
        ...typeConfig,
        localUri: part?.asset?.uri,
        localFileName: part?.asset?.name,
      };
    });

    const createdCourse = addCourse({
      categoryId,
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
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      courseContent: mappedCourseContent,
      ownerId: authUser?.uid ?? "creator-local",
    });

    if (!createdCourse) {
      Alert.alert("Upload failed", "Unable to create course right now.");
      return;
    }

    Alert.alert(
      "Course uploaded",
      "Your new course is now available in the student course list."
    );
    navigation.navigate("ManageCoursesHome");
  };

  return (
    <CourseContentUploadForm
      courseDraft={courseDraft}
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
    />
  );
};
