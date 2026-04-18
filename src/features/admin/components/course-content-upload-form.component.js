import React from "react";
import {
  Content,
  ContentIdBadge,
  ContentIdBadgeText,
  DeleteButton,
  DeleteButtonText,
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
} from "./course-content-upload.styles";

export const CourseContentUploadForm = ({
  courseDraft,
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
}) => (
  <Screen>
    <Content keyboardShouldPersistTaps="handled">
      <Inner>
        <Title>Upload Course Content</Title>
        <Subtitle>
          Add each part one by one with a title and one file (video/pdf/image).
        </Subtitle>

        <DraftCard>
          <DraftText>
            Course: {courseDraft?.title ?? "Untitled course"}
          </DraftText>
          <DraftText>
            Category: {courseDraft?.category?.categoryTitle ?? "Not selected"}
          </DraftText>
          <DraftText>
            Original Price: A${courseDraft?.originalPrice ?? "0.00"}
          </DraftText>
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
          <UploadButton onPress={onPickVideo}>
            <UploadButtonText>Upload Video</UploadButtonText>
          </UploadButton>
          <UploadButton onPress={onPickPdf}>
            <UploadButtonText>Upload PDF</UploadButtonText>
          </UploadButton>
          <UploadButton onPress={onPickImage}>
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

        <PrimaryButton onPress={onAddContentPart}>
          <PrimaryButtonText>Add Content Part</PrimaryButtonText>
        </PrimaryButton>

        <SectionTitle>Added Parts ({contentParts.length})</SectionTitle>
        {contentParts.map((part, index) => (
          <PartCard key={part.id}>
            <PartHeaderRow>
              <ContentIdBadge>
                <ContentIdBadgeText>
                  Content ID: {part.contentId ?? index + 1}
                </ContentIdBadgeText>
              </ContentIdBadge>
              <DeleteButton onPress={() => onDeleteContentPart?.(part.id)}>
                <DeleteButtonText>Delete</DeleteButtonText>
              </DeleteButton>
            </PartHeaderRow>
            <PartTitle>{part.title}</PartTitle>
            <PartMeta>Type: {part.asset.kind.toUpperCase()}</PartMeta>
            <PartMeta>File: {part.asset.name}</PartMeta>
          </PartCard>
        ))}

        <UploadCourseButton
          onPress={onUploadCourse}
          disabled={contentParts.length === 0}
        >
          <UploadCourseButtonText>Upload Course</UploadCourseButtonText>
        </UploadCourseButton>
      </Inner>
    </Content>
  </Screen>
);
