import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import {
  formatDurationFromSeconds,
  sumCourseVideoDurationSeconds,
} from "../../../services/learnings/course-duration.utils";

import {
  AuthorText,
  CourseCard,
  CourseCardImage,
  CourseCardImageWrap,
  CourseCardLayout,
  CourseTitle,
  CourseBadge,
  CourseBadgeText,
  DurationText,
  DurationValueText,
  BoughtBadge,
  BoughtText,
  CartBadge,
  CartText,
  PriceValue,
  PriceRow,
  ProgressSection,
  ProgressLabel,
  ProgressTrack,
  ProgressFill,
  ProgressMeta,
  Info,
  StatItem,
  StatText,
  StatsRow,
} from "./course-card.styles";

export const CourseInfo = ({
  course,
  onPress,
  isPurchased = false,
  isInCart = false,
  progress,
  showDuration = true,
  showStats = true,
} = {}) => {
  const theme = useTheme();

  const {
    courseTitle = "Mindfulness and Meditation",
    author = "John Doe",
    courseDuration = "2hr 46min",
    priceValue = "$20",
    price,
    watchers = "18k",
    rating = "4.8",
    coursePhoto = [
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
    ],
    isFoundationCourse = false,
    prerequisiteCourseId = null,
  } = course ?? {};

  const coverPhoto = Array.isArray(coursePhoto) ? coursePhoto[0] : coursePhoto;
  const totalVideoDurationSeconds = sumCourseVideoDurationSeconds(
    course?.courseContent ?? [],
  );
  const durationLabel =
    totalVideoDurationSeconds > 0
      ? formatDurationFromSeconds(totalVideoDurationSeconds)
      : courseDuration;
  const displayPriceValue = priceValue ?? price ?? "$20";
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(progress?.percent ?? 0)),
  );
  const hasProgress = Boolean(progress);
  const badgeVariant = prerequisiteCourseId
    ? "prerequisite"
    : isFoundationCourse
      ? "foundation"
      : null;
  const badgeLabel =
    badgeVariant === "prerequisite"
      ? "Prerequisite"
      : badgeVariant === "foundation"
        ? "Foundation"
        : null;
  const infoJustifyContent =
    hasProgress && !showDuration && !showStats ? "flex-start" : "space-between";
  const authorBottomSpacing = hasProgress ? 20 : 0;

  return (
    <CourseCard elevation={5} onPress={onPress}>
      <CourseCardLayout>
        <Info $justifyContent={infoJustifyContent}>
          <CourseTitle>{courseTitle}</CourseTitle>
          <AuthorText style={{ marginBottom: authorBottomSpacing }}>
            By: {author}
          </AuthorText>
          {showDuration ? (
            <DurationText>
              {"Class Duration\n"}
              <DurationValueText>{durationLabel}</DurationValueText>
            </DurationText>
          ) : null}
          {hasProgress ? (
            <ProgressSection>
              <ProgressLabel>{progressPercent}% Complete</ProgressLabel>
              <ProgressTrack>
                <ProgressFill style={{ width: `${progressPercent}%` }} />
              </ProgressTrack>
              <ProgressMeta>
                Total: {progress?.totalDurationLabel ?? "0min"}
              </ProgressMeta>
              <ProgressMeta>
                Watched: {progress?.watchedDurationLabel ?? "0min"}
              </ProgressMeta>
              <ProgressMeta>
                Remaining: {progress?.remainingDurationLabel ?? "0min"}
              </ProgressMeta>
            </ProgressSection>
          ) : (
            <PriceRow>
              <PriceValue>{displayPriceValue}</PriceValue>
              {isPurchased ? (
                <BoughtBadge>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={theme.colors.text.success}
                  />
                  <BoughtText>Bought</BoughtText>
                </BoughtBadge>
              ) : isInCart ? (
                <CartBadge>
                  <Ionicons name="cart" size={14} color="#2A6DA8" />
                  <CartText>In Cart</CartText>
                </CartBadge>
              ) : null}
            </PriceRow>
          )}
          {showStats ? (
            <StatsRow>
              <StatItem>
                <Ionicons
                  name="people"
                  size={14}
                  color={theme.colors.ui.secondary}
                />
                <StatText>{watchers}</StatText>
              </StatItem>
              <StatItem>
                <Ionicons
                  name="star"
                  size={14}
                  color={theme.colors.ui.secondary}
                />
                <StatText>{rating}</StatText>
              </StatItem>
            </StatsRow>
          ) : null}
        </Info>
        <CourseCardImageWrap>
          <CourseCardImage source={{ uri: coverPhoto }} resizeMode="cover" />
          {badgeVariant ? (
            <CourseBadge $variant={badgeVariant}>
              <CourseBadgeText $variant={badgeVariant}>
                {badgeLabel}
              </CourseBadgeText>
            </CourseBadge>
          ) : null}
        </CourseCardImageWrap>
      </CourseCardLayout>
    </CourseCard>
  );
};
