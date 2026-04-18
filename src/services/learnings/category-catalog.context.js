import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { categoriesMock } from "./categories.mock";

const CategoryCatalogContext = createContext({
  categories: [],
  addCategory: () => null,
});

export const CategoryCatalogProvider = ({ children }) => {
  const [categories, setCategories] = useState(categoriesMock);

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
