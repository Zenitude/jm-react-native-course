/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export default {
  primary: "#161622",
  secondary: {
    default: "#FF9C01",
    100: "#FFF9001",
    200: "#FF8E01"
  },
  black: {
    default: "#000",
    100: "#1E1E2D",
    200: "#232533",
  },
  grey: {
    100: "#CDCDE0"
  },
  red: {
    default: "#FF0000"
  },
  blue: {
    default: "#0000FF"
  },
  white: "#fff",
  activeTab: "#FFA001",
  placeholder: "#7B7B8B",
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
