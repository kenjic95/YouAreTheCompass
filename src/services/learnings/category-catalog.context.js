import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { categoriesMock } from "./categories.mock";

const CategoryCatalogContext = createContext({
  categories: [],
  addCategory: () => null,
});

const CATEGORY_CATALOG_STORAGE_KEY = "learnings-category-catalog-v1";

export const CategoryCatalogProvider = ({ children }) => {
  const [categories, setCategories] = useState(categoriesMock);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadPersistedCategories = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(
          CATEGORY_CATALOG_STORAGE_KEY
        );
        if (!storedValue) {
          return;
        }

        const parsedCategories = JSON.parse(storedValue);
        if (!Array.isArray(parsedCategories)) {
          return;
        }

        if (isActive) {
          setCategories(parsedCategories);
        }
      } catch {
        // no-op: fallback to mock data
      } finally {
        if (isActive) {
          setHasHydrated(true);
        }
      }
    };

    loadPersistedCategories();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    AsyncStorage.setItem(
      CATEGORY_CATALOG_STORAGE_KEY,
      JSON.stringify(categories)
    ).catch(() => {});
  }, [categories, hasHydrated]);

  const addCategory = useCallback(
    (categoryTitle, categoryPhoto) => {
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

      const maxCategoryId = categories.reduce(
        (maxId, category) => Math.max(maxId, Number(category?.id) || 0),
        0
      );
      const nextCategory = {
        id: maxCategoryId + 1,
        categoryTitle: normalizedTitle,
        categoryPhoto:
          categoryPhoto ||
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      };

      setCategories((previous) => [...previous, nextCategory]);
      return nextCategory;
    },
    [categories]
  );

  const value = useMemo(
    () => ({
      categories,
      addCategory,
    }),
    [addCategory, categories]
  );

  return (
    <CategoryCatalogContext.Provider value={value}>
      {children}
    </CategoryCatalogContext.Provider>
  );
};

export const useCategoryCatalog = () => useContext(CategoryCatalogContext);
