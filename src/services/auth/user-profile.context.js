import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "./firebase";

const DEFAULT_PROFILE = {
  role: "student",
  plan: "free",
  discountPercent: 0,
};

const getDisplayName = (authUser, data = {}) => {
  const authDisplayName = authUser?.displayName?.trim();
  const savedDisplayName = data?.displayName?.trim();
  const fallbackName = [data?.firstName, data?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return authDisplayName || savedDisplayName || fallbackName || "";
};

const getPhotoURL = (authUser, data = {}) =>
  authUser?.photoURL?.trim() || data?.photoURL?.trim() || "";

const UserProfileContext = createContext({
  authUser: null,
  profile: DEFAULT_PROFILE,
  hasAuthenticatedUser: false,
  isLoading: true,
  role: DEFAULT_PROFILE.role,
  plan: DEFAULT_PROFILE.plan,
  discountPercent: DEFAULT_PROFILE.discountPercent,
  isCreator: false,
  isPremium: false,
});

export const UserProfileProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setAuthUser(null);
      setProfile(DEFAULT_PROFILE);
      setIsLoading(false);
      return undefined;
    }

    let unsubscribeProfile;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ?? null);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }

      if (!user?.uid) {
        setProfile(DEFAULT_PROFILE);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      unsubscribeProfile = onSnapshot(
        doc(db, "users", user.uid),
        (snapshot) => {
          const data = snapshot.exists() ? snapshot.data() : {};
          setProfile({
            ...DEFAULT_PROFILE,
            ...data,
            uid: user.uid,
            email: user.email ?? data?.email,
            displayName: getDisplayName(user, data),
            photoURL: getPhotoURL(user, data),
          });
          setIsLoading(false);
        },
        () => {
          setProfile({
            ...DEFAULT_PROFILE,
            uid: user.uid,
            email: user.email ?? "",
            displayName: getDisplayName(user),
            photoURL: getPhotoURL(user),
          });
          setIsLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(() => {
    const normalizedRole = String(
      profile?.role ?? DEFAULT_PROFILE.role
    ).toLowerCase();
    const normalizedPlan = String(
      profile?.plan ?? DEFAULT_PROFILE.plan
    ).toLowerCase();
    const discountPercent =
      Number(profile?.discountPercent ?? DEFAULT_PROFILE.discountPercent) || 0;
    const isCreator =
      normalizedRole === "admin" || normalizedRole === "teacher";
    const hasAuthenticatedUser = Boolean(authUser);
    const isPremium = normalizedPlan === "premium" || discountPercent > 0;

    return {
      authUser,
      profile,
      hasAuthenticatedUser,
      isLoading,
      role: normalizedRole,
      plan: normalizedPlan,
      discountPercent,
      isCreator,
      isPremium,
    };
  }, [authUser, profile, isLoading]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
