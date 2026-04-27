import React, { useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";

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
  left: 14px;
  padding-vertical: 14px;
  padding-horizontal: 16px;
`;

const BackText = styled.Text`
  font-size: 28px;
  color: #2b4f73;
  font-weight: 600;
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

const PhotoPreview = styled.Image`
  margin-top: 10px;
  width: 100%;
  height: 170px;
  border-radius: 12px;
`;

const DateRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DateInput = styled(Input)`
  width: 31.5%;
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

const getDateParts = (trip) => {
  if (!trip?.travelDate) {
    return { day: "", month: "", year: "" };
  }

  return {
    day: String(trip.travelDate.day || ""),
    month: String(trip.travelDate.month || ""),
    year: String(trip.travelDate.year || ""),
  };
};

export const UploadTripScreen = ({ navigation, route }) => {
  const { trips, addTrip, updateTrip } = useTripCatalog();
  const editTripId = route?.params?.tripId;
  const editingTrip = useMemo(
    () => trips.find((trip) => trip.id === editTripId),
    [trips, editTripId]
  );

  const dateParts = getDateParts(editingTrip);
  const [title, setTitle] = useState(editingTrip?.title || "");
  const [image, setImage] = useState(editingTrip?.image || "");
  const [description, setDescription] = useState(editingTrip?.description || "");
  const [location, setLocation] = useState(editingTrip?.location || "");
  const [price, setPrice] = useState(editingTrip?.price || "");
  const [day, setDay] = useState(dateParts.day);
  const [month, setMonth] = useState(dateParts.month);
  const [year, setYear] = useState(dateParts.year);
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
    const cleanedPrice = price.trim();
    const cleanedUrl = url.trim();

    if (!cleanedTitle || !cleanedDescription || !cleanedLocation) {
      Alert.alert(
        "Missing details",
        "Please provide title, description, and location."
      );
      return;
    }

    const hasDate = day.trim() && month.trim() && year.trim();
    const duration =
      editingTrip?.duration ||
      (hasDate ? `${day.trim()}/${month.trim()}/${year.trim()}` : "TBD");

    const payload = {
      title: cleanedTitle,
      image: image || defaultImage,
      description: cleanedDescription,
      location: cleanedLocation,
      price: cleanedPrice || "$0",
      link: cleanedUrl || "https://www.youarethecompass.com/",
      duration,
      travelDate: {
        day: day.trim(),
        month: month.trim(),
        year: year.trim(),
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
          <BackText>{"<"}</BackText>
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
        <PhotoPreview source={{ uri: image || defaultImage }} />

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
        <Input value={price} onChangeText={setPrice} placeholder="$2,900" />

        <Label>Date</Label>
        <DateRow>
          <DateInput
            value={day}
            onChangeText={setDay}
            placeholder="Day"
            keyboardType="number-pad"
          />
          <DateInput
            value={month}
            onChangeText={setMonth}
            placeholder="Month"
            keyboardType="number-pad"
          />
          <DateInput
            value={year}
            onChangeText={setYear}
            placeholder="Year"
            keyboardType="number-pad"
          />
        </DateRow>

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
