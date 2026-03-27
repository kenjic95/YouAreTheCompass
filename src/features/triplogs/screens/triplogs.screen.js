<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
=======
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
>>>>>>> 94a222ea677ec4066b1f6e09be4fd5b98f0a8c14
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";

const ScreenContainer = styled.View`
  flex: 1;
  background-color: #ddd9d9;
  padding: 20px;
`;

const CreateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #d7e6f1;
  width: 290px;
  padding: 18px 20px;
  border-radius: 35px;
  margin-top: 30px;
  margin-bottom: 35px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const CreateButtonText = styled.Text`
  font-size: 18px;
  color: #3a6e97;
  margin-left: 14px;
`;

const Title = styled.Text`
  font-size: 32px;
  color: #3a6e97;
  margin-bottom: 10px;
`;

const Divider = styled.View`
  height: 4px;
  background-color: #9dd0f4;
  margin-bottom: 30px;
`;

const JournalCard = styled.TouchableOpacity`
  background-color: ${(props) => (props.light ? "#d7e6f1" : "#97c9ef")};
  padding: 28px 30px;
  border-radius: 35px;
  margin-bottom: 25px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const JournalText = styled.Text`
  font-size: 18px;
  color: #3a6e97;
`;

<<<<<<< HEAD
const MediaPreview = styled.View`
  margin-top: 12px;
  border-radius: 20px;
  overflow: hidden;
  height: 160px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.55);
`;

const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: center;
  padding: 20px;
`;

const ModalContainer = styled.View`
  background-color: white;
  border-radius: 22px;
  padding: 18px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 10;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: 600;
  color: #3a6e97;
  margin-bottom: 12px;
`;

const ModalInput = styled.TextInput`
  border-width: 1px;
  border-color: #c5d8ec;
  border-radius: 18px;
  padding: 12px 14px;
  font-size: 16px;
  margin-bottom: 16px;
  color: #25324d;
`;

const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 10px 14px;
  border-radius: 14px;
  background-color: ${(props) => (props.primary ? "#3a6e97" : "#d7e6f1")};
`;

const ModalButtonText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.primary ? "#fff" : "#3a6e97")};
`;

const initialJournals = [
=======

const journals = [
>>>>>>> 94a222ea677ec4066b1f6e09be4fd5b98f0a8c14
  { id: "1", title: "Hiking in Blue Mountains" },
  { id: "2", title: "Scuba Diving in Cairns" },
  { id: "3", title: "Camping in Cokatoo Island" },
  { id: "4", title: "Coastal Walk in coogee" },
];

<<<<<<< HEAD
const STORAGE_KEY = "@triplogs_journals";

export const TripLogsScreen = () => {
  const [journals, setJournals] = useState(initialJournals);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMedia, setDraftMedia] = useState(null);

  const openCreateModal = () => {
    setDraftTitle("");
    setDraftMedia(null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const loadJournals = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setJournals(JSON.parse(stored));
      }
    } catch (error) {
      // ignore load errors
    }
  };

  const persistJournals = async (items) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // ignore save errors
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  useEffect(() => {
    persistJournals(journals);
  }, [journals]);

  const requestMediaPermissions = async () => {
    const libraryResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!libraryResult.granted && !cameraResult.granted) {
      Alert.alert(
        "Permissions needed",
        "Please allow photo & video access to add media to your journal."
      );
      return false;
    }

    return true;
  };

  const pickMedia = async (useCamera = false) => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      return;
    }

    const picker = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setDraftMedia({ uri: asset.uri, type: asset.type || "image" });
    }
  };

  const addJournal = () => {
    if (!draftTitle.trim() && !draftMedia) {
      Alert.alert(
        "Add something",
        "Please enter a title or pick a photo/video."
      );
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      title: draftTitle.trim() || "Untitled journal",
      media: draftMedia,
    };

    setJournals((prev) => [newEntry, ...prev]);
    closeModal();
  };

  const deleteJournal = (id) => {
    Alert.alert("Delete entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setJournals((prev) => prev.filter((entry) => entry.id !== id)),
      },
    ]);
  };

  const renderMedia = (media) => {
    if (!media?.uri) {
      return null;
    }

    if (media.type === "video") {
      return (
        <Video
          source={{ uri: media.uri }}
          style={{ width: "100%", height: "100%" }}
          useNativeControls
          resizeMode="cover"
          isLooping={false}
        />
      );
    }

    return (
      <Image
        source={{ uri: media.uri }}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

=======
export const TripLogsScreen = ({ navigation }) => {
>>>>>>> 94a222ea677ec4066b1f6e09be4fd5b98f0a8c14
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ddd9d9" }}>
    <ScreenContainer>
<<<<<<< HEAD
      <CreateButton onPress={openCreateModal}>
=======
       <CreateButton onPress={() => navigation.navigate("CreateJournal")}>
>>>>>>> 94a222ea677ec4066b1f6e09be4fd5b98f0a8c14
        <Ionicons name="add-circle-outline" size={38} color="#3a6e97" />
        <CreateButtonText>Create a journal</CreateButtonText>
      </CreateButton>

      <Title>My journal</Title>
      <Divider />

      <FlatList
        data={journals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalCard
            light={item.light}
            onPress={() => deleteJournal(item.id)}
          >
            <JournalText>{item.title}</JournalText>
            {item.media ? (
              <MediaPreview>{renderMedia(item.media)}</MediaPreview>
            ) : null}
          </JournalCard>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={isModalVisible} transparent animationType="fade">
        <ModalBackground>
          <ModalContainer>
            <ModalTitle>New journal entry</ModalTitle>

            <ModalInput
              placeholder="Entry title"
              placeholderTextColor="#a8b7c8"
              value={draftTitle}
              onChangeText={setDraftTitle}
            />

            <ModalButton onPress={() => pickMedia(false)}>
              <ModalButtonText>Pick photo/video</ModalButtonText>
            </ModalButton>

            <ModalButton
              style={{ marginTop: 10 }}
              onPress={() => pickMedia(true)}
            >
              <ModalButtonText>Take photo/video</ModalButtonText>
            </ModalButton>

            {draftMedia ? (
              <MediaPreview style={{ marginTop: 14 }}>
                {renderMedia(draftMedia)}
              </MediaPreview>
            ) : null}

            <ModalActions>
              <ModalButton onPress={closeModal}>
                <ModalButtonText>Cancel</ModalButtonText>
              </ModalButton>
              <ModalButton
                primary
                style={{ marginLeft: 10 }}
                onPress={addJournal}
              >
                <ModalButtonText primary>Save</ModalButtonText>
              </ModalButton>
            </ModalActions>
          </ModalContainer>
        </ModalBackground>
      </Modal>
    </ScreenContainer>
    </SafeAreaView>
  );
};
