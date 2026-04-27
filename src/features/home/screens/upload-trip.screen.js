import React, { useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useTripCatalog } from "../../../services/connect-trips/trip-catalog.context";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #f5fbff;
`;

const Header = styled.View`
  min-height: 88px;
  border-bottom-width: 1px;
  border-bottom-color: #dbe8f3;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 28px;
  padding-bottom: 0px;
  padding-horizontal: 14px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 2px;
  padding-vertical: 14px;
  padding-horizontal: 10px;
`;

const BackIcon = styled(MaterialIcons).attrs({
  name: "chevron-left",
  size: 42,
})`
  color: #2b4f73;
`;

const HeaderTitle = styled.Text`
  font-size: 26px;
  line-height: 26px;
  color: #163f60;
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
  background-color: #3d98de;
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

const currencyOptions = ["$", "€", "£", "₹", "AED", "AUD"];

const parseStoredPrice = (value) => {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return {
      symbol: "$",
      amount: "",
    };
  }

  const knownSymbol = currencyOptions.find((option) =>
    rawValue.startsWith(option)
  );

  if (knownSymbol) {
    return {
      symbol: knownSymbol,
      amount: rawValue.slice(knownSymbol.length).trim(),
    };
  }

  return {
    symbol: "$",
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
  const [description, setDescription] = useState(editingTrip?.description || "");
  const [location, setLocation] = useState(editingTrip?.location || "");
  const [currencySymbol, setCurrencySymbol] = useState(initialPrice.symbol);
  const [priceAmount, setPriceAmount] = useState(initialPrice.amount);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [url, setUrl] = useState(editingTrip?.link || "");

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

  const saveTrip = () => {
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
    const duration = `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)} (${totalDays} ${totalDays === 1 ? "day" : "days"})`;

    const payload = {
      title: cleanedTitle,
      image: image || defaultImage,
      description: cleanedDescription,
      location: cleanedLocation,
      price: cleanedPrice ? `${currencySymbol}${cleanedPrice}` : `${currencySymbol}0`,
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

    if (editingTrip?.id) {
      updateTrip(editingTrip.id, payload);
      navigation.goBack();
      return;
    }

    addTrip(payload);
    navigation.goBack();
  };

  return (
    <Screen>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon />
        </BackButton>
        <HeaderTitle>
          {editingTrip?.id ? "Edit Trip" : "Upload New Trip"}
        </HeaderTitle>
      </Header>

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
            <DatePickerText>Start: {formatDateLabel(startDate)}</DatePickerText>
          </DatePickerButton>
          <DatePickerButton onPress={() => setShowEndDatePicker(true)}>
            <DatePickerText>
              End: {formatDateLabel(endDate)}{daysLabel}
            </DatePickerText>
          </DatePickerButton>
        </DateRangeRow>
          );
        })()}

        {showStartDatePicker ? (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
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
            display="default"
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

        <SubmitButton onPress={saveTrip}>
          <SubmitButtonText>
            {editingTrip?.id ? "Save Trip Changes" : "Upload Trip Photo"}
          </SubmitButtonText>
        </SubmitButton>
      </Content>
    </Screen>
  );
};
