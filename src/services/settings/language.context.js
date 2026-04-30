import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LANGUAGE_STORAGE_KEY = "settings.language";

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Espanol" },
  { code: "fr", name: "French", nativeName: "Francais" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Portugues" },
  { code: "zh", name: "Chinese", nativeName: "Chinese" },
  { code: "ja", name: "Japanese", nativeName: "Japanese" },
];

const DEFAULT_LANGUAGE_CODE = "en";

const LanguagePreferenceContext = createContext({
  selectedLanguage: LANGUAGES[0],
  setLanguage: () => {},
  isLoadingLanguage: true,
});

const findLanguage = (languageCode) =>
  LANGUAGES.find((language) => language.code === languageCode) || LANGUAGES[0];

export const LanguagePreferenceProvider = ({ children }) => {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    DEFAULT_LANGUAGE_CODE
  );
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSavedLanguage = async () => {
      try {
        const savedLanguageCode = await AsyncStorage.getItem(
          LANGUAGE_STORAGE_KEY
        );

        if (isMounted && savedLanguageCode) {
          setSelectedLanguageCode(findLanguage(savedLanguageCode).code);
        }
      } catch (error) {
        console.warn("Unable to load language preference", error);
      } finally {
        if (isMounted) {
          setIsLoadingLanguage(false);
        }
      }
    };

    loadSavedLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (languageCode) => {
    const nextLanguage = findLanguage(languageCode);

    setSelectedLanguageCode(nextLanguage.code);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage.code);
  }, []);

  const value = useMemo(
    () => ({
      selectedLanguage: findLanguage(selectedLanguageCode),
      setLanguage,
      isLoadingLanguage,
    }),
    [isLoadingLanguage, selectedLanguageCode]
  );

  return (
    <LanguagePreferenceContext.Provider value={value}>
      {children}
    </LanguagePreferenceContext.Provider>
  );
};

export const useLanguagePreference = () => useContext(LanguagePreferenceContext);
