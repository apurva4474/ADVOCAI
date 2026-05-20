import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const isMobile = width < 768;
export const isTablet = width >= 768 && width < 1024;
export const isDesktop = width >= 1024;