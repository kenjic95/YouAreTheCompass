import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";

import { categoriesMock } from "./categories.mock";
import { auth, db, isFirebaseConfigured, storage } from "../auth/firebase";

const CategoryCatalogContext = createContext({
  categories: [],
  addCategory: async () => null,
  deleteCategory: async () => false,
});

const DEFAULT_CATEGORY_PHOTO =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80";

const normalizeIdPart = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeCategory = (category = {}) => ({
  id: String(category?.id ?? ""),
  categoryTitle: String(category?.categoryTitle ?? "").trim(),
  categoryPhoto: category?.categoryPhoto || DEFAULT_CATEGORY_PHOTO,
});

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

const getSeedCategories = () =>
  (categoriesMock ?? []).map((category) =>
    normalizeCategory({
      ...category,
      id: String(category?.id ?? ""),
    })
  );

export const CategoryCatalogProvider = ({ children }) => {
  const [categories, setCategories] = useState(getSeedCategories());

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setCategories(getSeedCategories());
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const mappedCategories = snapshot.docs
          .map((document) =>
            normalizeCategory({
              id: document.id,
              ...document.data(),
            })
          )
          .filter((category) => category.id && category.categoryTitle)
          .sort((a, b) =>
            String(a?.categoryTitle ?? "").localeCompare(
              String(b?.categoryTitle ?? "")
            )
          );

        setCategories(mappedCategories);
      },
      (error) => {
        console.warn("Unable to subscribe to Firestore categories.", {
          code: error?.code,
          message: error?.message,
        });
      }
    );

    return unsubscribe;
  }, []);

  const addCategory = useCallback(
    async (categoryTitle, categoryPhoto) => {
      const normalizedTitle = String(categoryTitle ?? "").trim();
      if (!normalizedTitle) {
        return null;
      }

      const alreadyExists = categories.some(
        (category) =>
          String(category?.categoryTitle ?? "").toLowerCase() ===
          normalizedTitle.toLowerCase()
      );

      if (alreadyExists) {
        return null;
      }

      if (!isFirebaseConfigured || !db) {
        const nextCategory = normalizeCategory({
          id: `${normalizeIdPart(normalizedTitle) || "category"}-${Date.now()}`,
          categoryTitle: normalizedTitle,
          categoryPhoto,
        });
        setCategories((previous) =>
          [...previous, nextCategory].sort((a, b) =>
            String(a?.categoryTitle ?? "").localeCompare(
              String(b?.categoryTitle ?? "")
            )
          )
        );
        return nextCategory;
      }

      if (!auth?.currentUser?.uid) {
        return null;
      }

      const nextCategoryId = `${
        normalizeIdPart(normalizedTitle) || "category"
      }-${Date.now()}`;
      const nextCategory = normalizeCategory({
        id: nextCategoryId,
        categoryTitle: normalizedTitle,
        categoryPhoto,
      });
      const rawPhotoValue = String(nextCategory.categoryPhoto ?? "").trim();

      try {
        let persistedCategoryPhoto = nextCategory.categoryPhoto;

        if (rawPhotoValue && !isRemoteHttpUrl(rawPhotoValue)) {
          if (!storage) {
            return null;
          }

          const extension = getImageExtensionFromUri(rawPhotoValue);
          const filePath = `categories/${auth.currentUser.uid}/${nextCategoryId}.${extension}`;
          const storageRef = ref(storage, filePath);
          const response = await fetch(rawPhotoValue);
          const blob = await response.blob();

          await uploadBytes(storageRef, blob, {
            contentType: getContentTypeFromExtension(extension),
          });
          persistedCategoryPhoto = await getDownloadURL(storageRef);
        }

        await setDoc(doc(db, "categories", nextCategoryId), {
          categoryTitle: nextCategory.categoryTitle,
          categoryPhoto: persistedCategoryPhoto,
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return {
          ...nextCategory,
          categoryPhoto: persistedCategoryPhoto,
        };
      } catch (error) {
        console.warn("Unable to create Firestore category.", {
          code: error?.code,
          message: error?.message,
        });
        return null;
      }
    },
    [categories]
  );

  const deleteCategory = useCallback(
    async (categoryId) => {
      if (!categoryId) {
        return false;
      }

      const normalizedCategoryId = String(categoryId);
      const didExist = (categories ?? []).some(
        (category) => String(category?.id) === normalizedCategoryId
      );

      if (!didExist) {
        return false;
      }

      if (!isFirebaseConfigured || !db) {
        setCategories((previous) =>
          (previous ?? []).filter(
            (category) => String(category?.id) !== normalizedCategoryId
          )
        );
        return true;
      }

      if (!auth?.currentUser?.uid) {
        return false;
      }

      try {
        await deleteDoc(doc(db, "categories", normalizedCategoryId));
        return true;
      } catch (error) {
        console.warn("Unable to delete Firestore category.", {
          code: error?.code,
          message: error?.message,
        });
        return false;
      }
    },
    [categories]
  );

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      deleteCategory,
    }),
    [addCategory, categories, deleteCategory]
  );

  return (
    <CategoryCatalogContext.Provider value={value}>
      {children}
    </CategoryCatalogContext.Provider>
  );
};

export const useCategoryCatalog = () => useContext(CategoryCatalogContext);
