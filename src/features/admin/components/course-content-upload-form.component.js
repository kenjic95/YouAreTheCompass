import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
  Content,
  ContentIdBadge,
  ContentIdBadgeText,
  DeleteButton,
  DeleteButtonText,
  EditButton,
  EditButtonText,
  DraftCard,
  DraftText,
  Inner,
  Label,
  PartCard,
  PartHeaderRow,
  PartMeta,
  PartTitle,
  PrimaryButton,
  PrimaryButtonText,
  Screen,
  SectionTitle,
  SelectedFileCard,
  SelectedFileText,
  Subtitle,
  TextInput,
  Title,
  UploadCourseButton,
  UploadCourseButtonText,
  UploadButton,
  UploadButtonText,
  UploadButtonsRow,
  UploadingCard,
  UploadingMessage,
  UploadingOverlay,
  UploadingTitle,
  ProgressTrack,
  ProgressFill,
  ProgressPercent,
} from "./course-content-upload.styles";

export const CourseContentUploadForm = ({
  courseInfo,
  contentTitle,
  onChangeContentTitle,
  selectedAsset,
  onPickVideo,
  onPickPdf,
  onPickImage,
  onAddContentPart,
  contentParts,
  onDeleteContentPart,
  onUploadCourse,
  onStartEditContentPart,
  onCancelEditPart,
  editingPartId,
  isUploading = false,
  uploadProgressPercent = 0,
  uploadProgressMessage = "",
  heading = "Upload Course Content",
  subtitle = "Add each part one by one with a title and one file (video/pdf/image).",
  uploadCourseLabel = "Upload Course",
}) => (
  <Screen>
    <Content keyboardShouldPersistTaps="handled">
      <Inner>
        <Title>{heading}</Title>
        <Subtitle>{subtitle}</Subtitle>

        <DraftCard>
          <DraftText>Course: {courseInfo?.title ?? "Untitled course"}</DraftText>
          <DraftText>
            Category: {courseInfo?.categoryTitle ?? "Not selected"}
          </DraftText>
          <DraftText>Original Price: A${courseInfo?.originalPrice ?? "0.00"}</DraftText>
        </DraftCard>

        <Label>Content Title</Label>
        <TextInput
          value={contentTitle}
          onChangeText={onChangeContentTitle}
          placeholder="e.g. Welcome to the Course"
          placeholderTextColor="#8ba0b2"
        />

        <Label>Upload File</Label>
        <UploadButtonsRow>
          <UploadButton onPress={onPickVideo} disabled={isUploading}>
            <UploadButtonText>Upload Video</UploadButtonText>
          </UploadButton>
          <UploadButton onPress={onPickPdf} disabled={isUploading}>
            <UploadButtonText>Upload PDF</UploadButtonText>
          </UploadButton>
          <UploadButton onPress={onPickImage} disabled={isUploading}>
            <UploadButtonText>Upload Image</UploadButtonText>
          </UploadButton>
        </UploadButtonsRow>

        {selectedAsset ? (
          <SelectedFileCard>
            <SelectedFileText>
              Type: {selectedAsset.kind.toUpperCase()}
            </SelectedFileText>
            <SelectedFileText>Name: {selectedAsset.name}</SelectedFileText>
          </SelectedFileCard>
        ) : null}

        <PrimaryButton onPress={onAddContentPart} disabled={isUploading}>
          <PrimaryButtonText>
            {editingPartId ? "Save Content Part" : "Add Content Part"}
          </PrimaryButtonText>
        </PrimaryButton>
        {editingPartId ? (
          <UploadButton onPress={onCancelEditPart} disabled={isUploading}>
            <UploadButtonText>Cancel Edit</UploadButtonText>
          </UploadButton>
        ) : null}

        <SectionTitle>Added Parts ({contentParts.length})</SectionTitle>
        {contentParts.map((part, index) => (
          <PartCard key={part.id}>
            <PartHeaderRow>
              <ContentIdBadge>
                <ContentIdBadgeText>
                  Content ID: {part.contentId ?? index + 1}
                </ContentIdBadgeText>
              </ContentIdBadge>
              <View style={{ flexDirection: "row" }}>
                <EditButton
                  onPress={() => onStartEditContentPart?.(part)}
                  disabled={isUploading}
                >
                  <EditButtonText>Edit</EditButtonText>
                </EditButton>
                <DeleteButton
                  onPress={() => onDeleteContentPart?.(part.id)}
                  disabled={isUploading}
                >
                  <DeleteButtonText>Delete</DeleteButtonText>
                </DeleteButton>
              </View>
            </PartHeaderRow>
            <PartTitle>{part.title}</PartTitle>
            <PartMeta>Type: {part.asset.kind.toUpperCase()}</PartMeta>
            <PartMeta>File: {part.asset.name}</PartMeta>
          </PartCard>
        ))}

        <UploadCourseButton
          onPress={onUploadCourse}
          disabled={contentParts.length === 0 || isUploading}
        >
          <UploadCourseButtonText>{uploadCourseLabel}</UploadCourseButtonText>
        </UploadCourseButton>
      </Inner>
    </Content>
    {isUploading ? (
      <UploadingOverlay>
        <UploadingCard>
          <UploadingTitle>Uploading Course...</UploadingTitle>
          <UploadingMessage>
            {uploadProgressMessage || "Preparing upload..."}
          </UploadingMessage>
          <ProgressTrack>
            <ProgressFill style={{ width: `${uploadProgressPercent}%` }} />
          </ProgressTrack>
          <ProgressPercent>{uploadProgressPercent}%</ProgressPercent>
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator size="small" color="#2f7fc2" />
          </View>
        </UploadingCard>
      </UploadingOverlay>
    ) : null}
  </Screen>
);
