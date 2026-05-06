import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import {
  auth,
  db,
  isFirebaseConfigured,
  storage,
} from "../../../services/auth/firebase";
import { useUserProfile } from "../../../services/auth/user-profile.context";

const FALLBACK_NAME = "User Full Name";
const FALLBACK_EMAIL = "user@email.com";
const isRemoteHttpUrl = (value) => /^https?:\/\//i.test(String(value ?? ""));
const getImageExtensionFromUri = (uri) => {
  const normalized = String(uri ?? "").split("?")[0];
  const extension = normalized.split(".").pop()?.toLowerCase();

  if (!extension || extension === normalized.toLowerCase()) {
    return "jpg";
  }

  if (extension === "jpeg") {
    return "jpg";
  }

  return extension;
};

const getContentTypeFromExtension = (extension) => {
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    default:
      return "image/jpeg";
  }
};

const buildDisplayProfile = (profile) => {
  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    firstName: profile?.firstName?.trim() || "",
    lastName: profile?.lastName?.trim() || "",
    name: profile?.displayName?.trim() || fullName || FALLBACK_NAME,
    email: profile?.email?.trim() || FALLBACK_EMAIL,
    photoURL: profile?.photoURL?.trim() || "",
  };
};

const createInitialForm = (profile) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  photoURL: profile.photoURL,
  currentPassword: "",
  newPassword: "",
});

export default function AccountScreen({ navigation }) {
  const { profile: userProfile, isLoading } = useUserProfile();
  const { width } = useWindowDimensions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [form, setForm] = useState(createInitialForm(buildDisplayProfile({})));

  const profile = useMemo(
    () => buildDisplayProfile(userProfile || {}),
    [userProfile]
  );
  const avatarSize = Math.min(width * 0.5, 220);
  const avatarInnerSize = avatarSize * 0.68;

  useEffect(() => {
    setAvatarError(false);
  }, [profile.photoURL]);

  useEffect(() => {
    if (!isEditing) {
      setForm(createInitialForm(profile));
    }
  }, [isEditing, profile]);

  const updateFormValue = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleStartEditing = () => {
    setForm(createInitialForm(profile));
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setForm(createInitialForm(profile));
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!isFirebaseConfigured || !auth || !db || !auth.currentUser) {
      Alert.alert(
        "Profile editing unavailable",
        "Firebase is not configured yet, so account changes cannot be saved."
      );
      return;
    }

    const trimmedFirstName = form.firstName.trim();
    const trimmedLastName = form.lastName.trim();
    const trimmedPhotoURL = form.photoURL.trim();
    const trimmedCurrentPassword = form.currentPassword.trim();
    const trimmedNewPassword = form.newPassword.trim();
    const displayName = `${trimmedFirstName} ${trimmedLastName}`.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      Alert.alert(
        "Missing fields",
        "Please enter both your name and surname before saving."
      );
      return;
    }

    if (trimmedNewPassword && trimmedNewPassword.length < 6) {
      Alert.alert(
        "Weak password",
        "Your new password must be at least 6 characters long."
      );
      return;
    }

    if (trimmedNewPassword && !trimmedCurrentPassword) {
      Alert.alert(
        "Current password required",
        "Enter your current password to confirm the password change."
      );
      return;
    }

    setIsSaving(true);

    try {
      let persistedPhotoURL = trimmedPhotoURL;

      if (
        persistedPhotoURL &&
        !isRemoteHttpUrl(persistedPhotoURL) &&
        (!storage || !auth.currentUser?.uid)
      ) {
        throw new Error("profile-photo-upload-unavailable");
      }

      if (
        persistedPhotoURL &&
        !isRemoteHttpUrl(persistedPhotoURL) &&
        storage &&
        auth.currentUser?.uid
      ) {
        const extension = getImageExtensionFromUri(persistedPhotoURL);
        const filePath = `profile-photos/${auth.currentUser.uid}/avatar.${extension}`;
        const storageRef = ref(storage, filePath);
        const response = await fetch(persistedPhotoURL);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob, {
          contentType: getContentTypeFromExtension(extension),
        });
        persistedPhotoURL = await getDownloadURL(storageRef);
      }

      if (trimmedNewPassword) {
        const email = auth.currentUser.email?.trim();

        if (!email) {
          throw new Error("missing-email");
        }

        const credential = EmailAuthProvider.credential(
          email,
          trimmedCurrentPassword
        );

        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, trimmedNewPassword);
      }

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: persistedPhotoURL || null,
      });

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          uid: auth.currentUser.uid,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          displayName,
          email: auth.currentUser.email ?? profile.email,
          photoURL: persistedPhotoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setForm((current) => ({
        ...current,
        photoURL: persistedPhotoURL,
        currentPassword: "",
        newPassword: "",
      }));
      setIsEditing(false);
      Alert.alert("Account updated", "Your account details were saved.");
    } catch (error) {
      let message = "We couldn't save your account changes right now.";

      if (error?.code === "auth/wrong-password") {
        message = "Your current password is incorrect.";
      } else if (error?.code === "auth/too-many-requests") {
        message = "Too many attempts were made. Please try again shortly.";
      } else if (error?.code === "auth/requires-recent-login") {
        message =
          "Please sign in again before changing your password, then try once more.";
      } else if (error?.message === "missing-email") {
        message =
          "This account is missing an email address, so the password could not be updated.";
      } else if (error?.message === "profile-photo-upload-unavailable") {
        message =
          "Profile photo upload is unavailable right now. Please check Firebase Storage configuration and try again.";
      }

      Alert.alert("Update failed", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = () => {
    Alert.alert(
      "Account deletion",
      "Please contact support or add your account deletion flow here when you're ready."
    );
  };

  const previewPhoto = isEditing ? form.photoURL.trim() : profile.photoURL;
  const shouldShowAvatarImage = previewPhoto && !avatarError;

  const handlePickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission?.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library permission to choose a profile photo."
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

    setAvatarError(false);
    updateFormValue("photoURL", asset.uri);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#69AEE6" }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        style={{
          flex: 1,
          backgroundColor: "#69AEE6",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 58,
            left: 22,
            zIndex: 10,
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#6B6B6B" />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#DCEBF7",
            borderBottomLeftRadius: 48,
            borderBottomRightRadius: 48,
            paddingTop: 95,
            paddingHorizontal: 24,
            paddingBottom: 38,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.16,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#5A5A5A",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Account Settings
          </Text>

          <View
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: "#F4F4F4",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: avatarInnerSize,
                height: avatarInnerSize,
                borderRadius: avatarInnerSize / 2,
                backgroundColor: shouldShowAvatarImage ? "#F4F4F4" : "#8A8A8A",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {shouldShowAvatarImage ? (
                <Image
                  source={{ uri: previewPhoto }}
                  onError={() => setAvatarError(true)}
                  style={{
                    width: avatarInnerSize,
                    height: avatarInnerSize,
                  }}
                />
              ) : (
                <Feather
                  name="user"
                  size={Math.max(50, avatarInnerSize * 0.6)}
                  color="#FFFFFF"
                />
              )}
            </View>
          </View>

          {isEditing ? (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#5F5F5F",
                marginBottom: 18,
                textAlign: "center",
                paddingHorizontal: 16,
              }}
            >
              Add or replace your profile photo from gallery or by URL below.
            </Text>
          ) : null}

          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: "#1F1F1F",
                marginBottom: 10,
              }}
            >
              Account Details
            </Text>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: "#2A2A2A",
                marginBottom: 6,
              }}
            >
              {profile.name}
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#5F5F5F",
                marginBottom: 4,
              }}
            >
              {profile.email}
            </Text>

            {isLoading ? (
              <View style={{ paddingTop: 16 }}>
                <ActivityIndicator color="#4F86B9" />
              </View>
            ) : null}
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 22,
            paddingTop: 24,
          }}
        >
          {isEditing ? (
            <View
              style={{
                backgroundColor: "#DCEBF7",
                borderRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 22,
                marginBottom: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.16,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <EditField
                label="Name"
                value={form.firstName}
                onChangeText={(value) => updateFormValue("firstName", value)}
                autoCapitalize="words"
                placeholder="Enter your name"
              />

              <EditField
                label="Surname"
                value={form.lastName}
                onChangeText={(value) => updateFormValue("lastName", value)}
                autoCapitalize="words"
                placeholder="Enter your surname"
              />

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#4C6D87",
                  marginBottom: 8,
                  marginLeft: 6,
                }}
              >
                Change Profile Photo
              </Text>
              <TouchableOpacity
                onPress={handlePickProfilePhoto}
                disabled={isSaving}
                style={{
                  backgroundColor: "#7CB8E7",
                  borderRadius: 20,
                  minHeight: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Choose Photo From Gallery
                </Text>
              </TouchableOpacity>

              <EditField
                label="Current Password"
                value={form.currentPassword}
                onChangeText={(value) =>
                  updateFormValue("currentPassword", value)
                }
                autoCapitalize="none"
                secureTextEntry
                placeholder="Required to change password"
              />

              <EditField
                label="New Password"
                value={form.newPassword}
                onChangeText={(value) => updateFormValue("newPassword", value)}
                autoCapitalize="none"
                secureTextEntry
                placeholder="Leave blank to keep your password"
              />

              <View
                style={{
                  flexDirection: width > 420 ? "row" : "column",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <PrimaryButton
                  label={isSaving ? "Saving..." : "Save Changes"}
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                />
                <SecondaryButton
                  label="Cancel"
                  onPress={handleCancelEditing}
                  disabled={isSaving}
                />
              </View>
            </View>
          ) : (
            <ActionCard
              icon={<Feather name="edit-2" size={24} color="#1A1A1A" />}
              label="Edit Account Details"
              onPress={handleStartEditing}
            />
          )}

          <ActionCard
            icon={
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={26}
                color="#1A1A1A"
              />
            }
            label="Request Account Deletion"
            onPress={handleDeleteRequest}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function EditField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#4C6D87",
          marginBottom: 8,
          marginLeft: 6,
        }}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#86A5BB"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={{
          backgroundColor: "#F3F9FE",
          borderRadius: 20,
          minHeight: 52,
          paddingHorizontal: 18,
          paddingVertical: 14,
          fontSize: 16,
          color: "#204968",
        }}
      />
    </View>
  );
}

function ActionCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#DCEBF7",
        borderRadius: 30,
        minHeight: 58,
        marginBottom: 22,
        paddingHorizontal: 28,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <View style={{ width: 28, alignItems: "center" }}>{icon}</View>

      <Text
        style={{
          marginLeft: 18,
          fontSize: 16,
          fontWeight: "700",
          color: "#111111",
          flexShrink: 1,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PrimaryButton({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        minHeight: 52,
        borderRadius: 26,
        backgroundColor: disabled ? "#8CB3D2" : "#4F86B9",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
      }}
    >
      {disabled ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        minHeight: 52,
        borderRadius: 26,
        backgroundColor: "#F3F9FE",
        borderWidth: 1,
        borderColor: "#8FB5D4",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
      }}
    >
      <Text
        style={{
          color: "#2D5E86",
          fontSize: 16,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
