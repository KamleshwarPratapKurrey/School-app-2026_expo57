/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000000',            // iOS primary label
    subtext: '#6E6E73',
    background: '#F2F2F7',      // systemGroupedBackground
    card: '#FFFFFF',            // secondarySystemGroupedBackground
              
    tint: '#007AFF',            // iOS blue
    btntext: '#ffffff',
    icon: '#8E8E93',            // secondary label
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#007AFF',
    // border: '#C6C6C8',          // separator
    border: '#0000000f',  // separator
    borderL: '#e8e6e6',
    pad: 20,
    brad: 30,
    btnclr: "#ffffff",
    shadowClr: "#00000053",

    font48: 48,
    font46: 46,
    font42: 42,
    font39: 39,
    font36: 36,
    font32: 32,
    font28: 28,
    font24: 24,
    font22: 22,
    font20: 20,
    font18: 18,
    font16: 16,
    font14: 14,
    font13: 13,
    font12: 12,
  },
  dark: {
    text: '#e1e1e1',            // primary label dark
    subtext: '#8E8E93',
    background: '#000000',      // system background dark
    card: '#16171B',            // secondary system background dark
    tint: '#007AFF',            // iOS dark blue
    btntext: '#ffffff',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#007AFF',
    border: '#ffffff14',          // separator dark
    borderL: '#2c2c2c',
    pad: 16,
    brad: 30,
    btnclr: "#ffffff",
    shadowClr: "#00000053",

    font48: 48,
    font46: 46,
    font42: 42,
    font39: 39,
    font36: 36,
    font32: 32,
    font28: 28,
    font24: 24,
    font22: 22,
    font20: 20,
    font18: 18,
    font16: 16,
    font14: 14,
    font13: 13,
    font12: 12,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',

    // MY FONT--start
    regular: "regular",
    light: "light",
    heavy: "heavy",
    semibold: "semibold",
    // MY FONT--end
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
    // MY FONT--start
    regular: "regular",
    light: "light",
    heavy: "heavy",
    semibold: "semibold",
    // MY FONT--end
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    // MY FONT--start
    regular: "regular",
    light: "light",
    heavy: "heavy",
    semibold: "semibold",
    // MY FONT--end
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    // MY FONT--start
    regular: "regular",
    light: "light",
    heavy: "heavy",
    semibold: "semibold",
    // MY FONT--end
  },
});

