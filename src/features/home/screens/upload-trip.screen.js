import React, { useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useTripCatalog } from "../../../services/connect-trips/trip-catalog.context";
import { auth, isFirebaseConfigured } from "../../../services/auth/firebase";

const Screen = styled.View`
  flex: 1;
  background-color: #f5fbff;
`;

const HeaderSafeArea = styled(SafeAreaView).attrs({
  edges: ["top"],
})`
  background-color: #ffffff;
`;

const Header = styled.View`
  min-height: 56px;
  border-bottom-width: 1px;
  border-bottom-color: #e8edf2;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 8px;
  padding: 8px;
`;

const BackIcon = styled(MaterialIcons).attrs({
  name: "chevron-left",
  size: 28,
})`
  color: #2f2f2f;
`;

const HeaderTitle = styled.Text`
  font-size: 17px;
  line-height: 22px;
  color: #2f2f2f;
  font-weight: 700;
  text-align: center;
`;
const Content = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: 14,
    paddingBottom: 28,
  },
  showsVerticalScrollIndicator: false,
})``;

const Label = styled.Text`
  margin-top: 10px;
  margin-bottom: 8px;
  color: #234f74;
  font-size: 15px;
  font-weight: 500;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d2e3f2;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 11px 12px;
  font-size: 14px;
  color: #20394f;
`;

const MultilineInput = styled(Input)`
  min-height: 105px;
  text-align-vertical: top;
`;

const UploadPhotoButton = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: #e5f0fb;
  padding: 10px;
  align-items: center;
`;

const UploadPhotoText = styled.Text`
  color: #2e628f;
  font-size: 14px;
  font-weight: 600;
`;

const DateRangeRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DatePickerButton = styled.TouchableOpacity`
  width: 48.5%;
  border-width: 1px;
  border-color: #d2e3f2;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 11px 12px;
`;

const DatePickerText = styled.Text`
  font-size: 14px;
  color: #20394f;
`;

const CurrencyRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const CurrencyButton = styled.TouchableOpacity`
  margin-right: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${(props) => (props.isActive ? "#3d98de" : "#d2e3f2")};
  background-color: ${(props) => (props.isActive ? "#e7f4ff" : "#ffffff")};
  border-radius: 10px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
`;

const CurrencyButtonText = styled.Text`
  color: ${(props) => (props.isActive ? "#1f6da8" : "#20394f")};
  font-size: 14px;
  font-weight: 600;
`;

const SubmitButton = styled.TouchableOpacity`
  margin-top: 18px;
  border-radius: 10px;
  background-color: ${(props) => (props.disabled ? "#8dbde1" : "#3d98de")};
  padding: 12px;
  align-items: center;
`;

const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
`;

const defaultImage =
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80";

const parseStoredDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const currencyOptions = ["AUD"];
const legacyCurrencyPrefixes = ["$", "€", "£", "₹", "AED", "AUD"];

const parseStoredPrice = (value) => {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return {
      symbol: "AUD",
      amount: "",
    };
  }

  const knownSymbol = legacyCurrencyPrefixes.find((option) =>
    rawValue.startsWith(option)
  );

  if (knownSymbol) {
    return {
      symbol: "AUD",
      amount: rawValue.slice(knownSymbol.length).trim(),
    };
  }

  return {
    symbol: "AUD",
    amount: rawValue,
  };
};

const formatDateLabel = (value) => {
  if (!value) {
    return "Select date";
  }

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTotalTripDays = (start, end) => {
  if (!start || !end) {
    return null;
  }

  const startOfDay = new Date(start);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(end);
  endOfDay.setHours(0, 0, 0, 0);

  const diffMs = endOfDay.getTime() - startOfDay.getTime();
  if (diffMs < 0) {
    return null;
  }

  // Inclusive day count so same-day start/end equals 1 day.
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
};

const getUploadErrorMessage = (error) => {
  const code = error?.code || "unknown";

  switch (code) {
    case "permission-denied":
    case "firestore/permission-denied":
      return "Firestore rejected the write. Check that your published rules allow authenticated users to write to /trips.";
    case "storage/unauthorized":
      return "Firebase Storage rejected the image upload. Check your Storage rules for the connect-trips path.";
    case "auth/no-current-user":
      return "Firebase Auth has no current user on this screen. Sign out, sign back in, then try again.";
    case "unavailable":
      return "Firebase is temporarily unavailable. Check your connection and try again.";
    default:
      return `${error?.message || "Unknown Firebase error"}\n\nCode: ${code}`;
  }
};

export const UploadTripScreen = ({ navigation, route }) => {
  const { trips, addTrip, updateTrip } = useTripCatalog();
  const editTripId = route?.params?.tripId;
  const editingTrip = useMemo(
    () => trips.find((trip) => trip.id === editTripId),
    [trips, editTripId]
  );

  const initialPrice = parseStoredPrice(editingTrip?.price);
  const initialStartDate = parseStoredDate(editingTrip?.startDate);
  const initialEndDate = parseStoredDate(editingTrip?.endDate);
  const [title, setTitle] = useState(editingTrip?.title || "");
  const [image, setImage] = useState(editingTrip?.image || "");
  const [description, setDescription] = useState(
    editingTrip?.description || ""
  );
  const [location, setLocation] = useState(editingTrip?.location || "");
  const [currencySymbol, setCurrencySymbol] = useState(initialPrice.symbol);
  const [priceAmount, setPriceAmount] = useState(initialPrice.amount);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [url, setUrl] = useState(editingTrip?.link || "");
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission?.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to choose a trip image."
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

    const selectedAsset = result.assets?.[0];
    if (selectedAsset?.uri) {
      setImage(selectedAsset.uri);
    }
  };

  const saveTrip = async () => {
    if (isSaving) {
      return;
    }

    if (isFirebaseConfigured && !auth?.currentUser?.uid) {
      Alert.alert(
        "Sign in required",
        "Please sign in with a Firebase account before uploading trips."
      );
      return;
    }

    const cleanedTitle = title.trim();
    const cleanedDescription = description.trim();
    const cleanedLocation = location.trim();
    const cleanedPrice = priceAmount.trim();
    const cleanedUrl = url.trim();

    if (!cleanedTitle || !cleanedDescription || !cleanedLocation) {
      Alert.alert(
        "Missing details",
        "Please provide title, description, and location."
      );
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert(
        "Missing trip dates",
        "Please select both start and end dates for this trip."
      );
      return;
    }

    if (endDate.getTime() < startDate.getTime()) {
      Alert.alert(
        "Invalid date range",
        "End date cannot be earlier than start date."
      );
      return;
    }

    const totalDays = getTotalTripDays(startDate, endDate) || 0;
    const duration = `${formatDateLabel(startDate)} - ${formatDateLabel(
      endDate
    )} (${totalDays} ${totalDays === 1 ? "day" : "days"})`;

    const payload = {
      title: cleanedTitle,
      image: image || defaultImage,
      description: cleanedDescription,
      location: cleanedLocation,
      price: cleanedPrice
        ? `${currencySymbol}${cleanedPrice}`
        : `${currencySymbol}0`,
      link: cleanedUrl || "https://www.youarethecompass.com/",
      duration,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      travelDate: {
        day: String(startDate.getDate()).padStart(2, "0"),
        month: String(startDate.getMonth() + 1).padStart(2, "0"),
        year: String(startDate.getFullYear()),
      },
    };

    setIsSaving(true);

    try {
      if (editingTrip?.id) {
        const updatedTrip = await updateTrip(editingTrip.id, payload);
        setIsSaving(false);

        if (updatedTrip) {
          navigation.goBack();
          return;
        }

        Alert.alert(
          "Unable to save trip",
          "The trip was not saved. Please try again."
        );
        return;
      }

      const newTrip = await addTrip(payload);
      setIsSaving(false);

      if (newTrip) {
        navigation.goBack();
        return;
      }

      Alert.alert(
        "Unable to upload trip",
        "The trip was not uploaded. Please try again."
      );
    } catch (error) {
      setIsSaving(false);
      Alert.alert("Unable to upload trip", getUploadErrorMessage(error));
    }
  };

  return (
    <Screen>
      <HeaderSafeArea>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackIcon />
          </BackButton>
          <HeaderTitle>
            {editingTrip?.id ? "Edit Trip" : "Upload New Trip"}
          </HeaderTitle>
        </Header>
      </HeaderSafeArea>

      <Content>
        <Label>Title of the Trip</Label>
        <Input value={title} onChangeText={setTitle} />

        <Label>Trip Photo</Label>
        <UploadPhotoButton onPress={pickImage}>
          <UploadPhotoText>Upload Trip Photo</UploadPhotoText>
        </UploadPhotoButton>

        <Label>Short Description</Label>
        <MultilineInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        <Label>Location</Label>
        <Input value={location} onChangeText={setLocation} />

        <Label>Price</Label>
        <CurrencyRow>
          {currencyOptions.map((option) => {
            const isActive = option === currencySymbol;
            return (
              <CurrencyButton
                key={option}
                isActive={isActive}
                onPress={() => setCurrencySymbol(option)}
              >
                <CurrencyButtonText isActive={isActive}>
                  {option}
                </CurrencyButtonText>
              </CurrencyButton>
            );
          })}
        </CurrencyRow>
        <Input
          value={priceAmount}
          onChangeText={setPriceAmount}
          placeholder="2,900"
          keyboardType="numeric"
        />

        <Label>Trip Dates</Label>
        {(() => {
          const totalDays = getTotalTripDays(startDate, endDate);
          const daysLabel =
            totalDays == null
              ? ""
              : ` (${totalDays} ${totalDays === 1 ? "day" : "days"})`;

          return (
            <DateRangeRow>
              <DatePickerButton onPress={() => setShowStartDatePicker(true)}>
                <DatePickerText>
                  Start: {formatDateLabel(startDate)}
                </DatePickerText>
              </DatePickerButton>
              <DatePickerButton onPress={() => setShowEndDatePicker(true)}>
                <DatePickerText>
                  End: {formatDateLabel(endDate)}
                  {daysLabel}
                </DatePickerText>
              </DatePickerButton>
            </DateRangeRow>
          );
        })()}

        {showStartDatePicker ? (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="spinner"
            onChange={(_event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        ) : null}

        {showEndDatePicker ? (
          <DateTimePicker
            value={endDate || startDate || new Date()}
            mode="date"
            display="spinner"
            onChange={(_event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        ) : null}

        <Label>URL</Label>
        <Input
          value={url}
          onChangeText={setUrl}
          placeholder="https://"
          autoCapitalize="none"
        />

        <SubmitButton disabled={isSaving} onPress={saveTrip}>
          <SubmitButtonText>
            {isSaving
              ? "Saving..."
              : editingTrip?.id
              ? "Save Trip Changes"
              : "Upload Trip Photo"}
          </SubmitButtonText>
        </SubmitButton>
      </Content>
    </Screen>
  );
};
