import { DefaultTheme } from "@react-navigation/native";
import { colors } from "../theme/colors";

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg.primary,
  },
};
