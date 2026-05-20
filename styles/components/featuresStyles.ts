import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

const isMobile = screenWidth < 768;

export const featuresStyles = StyleSheet.create({

  container: {
    marginTop: isMobile ? 60 : 80,
    alignItems: "center",
    paddingHorizontal: isMobile ? 20 : 40,
  },

  heading: {
    fontSize: isMobile ? 28 : 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },

  subheading: {
    fontSize: isMobile ? 14 : 16,
    color: "#9CA3AF",
    marginBottom: 50,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 700,
  },

  cardContainer: {
    width: "100%",

    flexDirection: isMobile ? "column" : "row",

    gap: 20,

    justifyContent: "center",
    alignItems: "stretch",
  },

  gradientBorder: {
    padding: 1,
    borderRadius: 24,
    flex: isMobile ? undefined : 1,
    width: isMobile ? "100%" : undefined,
  },

  card: {
    backgroundColor: "#111827",

    borderRadius: 24,

    padding: isMobile ? 24 : 30,

    minHeight: isMobile ? 220 : 260,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  icon: {
    fontSize: isMobile ? 42 : 52,
    marginBottom: 22,
  },

  title: {
    fontSize: isMobile ? 20 : 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 14,
    textAlign: "center",
  },

  text: {
    fontSize: isMobile ? 14 : 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
  },

});