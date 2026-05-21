import {
  Dimensions,
  StyleSheet,
} from "react-native";

const screenWidth =
  Dimensions.get("window").width;

const isMobile = screenWidth < 768;

export const timelineStyles =
  StyleSheet.create({

    screen: {
      flex: 1,
      backgroundColor: "#0B0F19",
    },

    container: {
      padding: isMobile ? 20 : 40,
    },

    heading: {
      fontSize: isMobile ? 30 : 38,
      fontWeight: "800",
      color: "#fff",
      marginBottom: 12,
    },

    subheading: {
      color: "#9CA3AF",
      fontSize: isMobile ? 15 : 16,
      lineHeight: 26,
      marginBottom: 32,
      maxWidth: 700,
    },

    toggleContainer: {
      flexDirection: "row",
      backgroundColor: "#111827",
      borderRadius: 18,
      padding: 6,
      marginBottom: 28,
    },

    toggleButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
    },

    activeButton: {
      backgroundColor: "#D4AF37",
    },

    activeText: {
      color: "#000",
      fontWeight: "700",
    },

    inactiveText: {
      color: "#9CA3AF",
      fontWeight: "600",
    },

    cardContainer: {
      gap: 18,
    },

    card: {
      backgroundColor: "#111827",
      borderRadius: 22,
      padding: 22,

      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.06)",
    },

    selectedCard: {
      borderColor: "#D4AF37",
      borderWidth: 2,

      backgroundColor:
        "rgba(212,175,55,0.08)",
    },

    cardTitle: {
      color: "#fff",
      fontSize: isMobile ? 17 : 18,
      fontWeight: "700",
      marginBottom: 10,
    },

    preview: {
      color: "#9CA3AF",
      lineHeight: 24,
      fontSize: 14,
    },

    input: {
      backgroundColor: "#111827",

      minHeight: 220,

      borderRadius: 22,

      padding: 20,

      color: "#fff",

      textAlignVertical: "top",

      fontSize: 16,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.06)",
    },

    button: {
      backgroundColor: "#D4AF37",

      paddingVertical: 18,

      borderRadius: 18,

      alignItems: "center",

      marginTop: 24,
    },

    buttonText: {
      color: "#000",

      fontWeight: "800",

      fontSize: 16,
    },

    timelineContainer: {
      marginTop: 40,
    },

    timelineHeading: {
      color: "#fff",

      fontSize: 28,

      fontWeight: "800",

      marginBottom: 28,
    },

    timelineCard: {
      flexDirection: "row",

      alignItems: "flex-start",

      marginBottom: 24,
    },

    circle: {
      width: 18,
      height: 18,

      borderRadius: 9,

      backgroundColor: "#D4AF37",

      marginTop: 8,

      marginRight: 18,
    },

    timelineContent: {
      flex: 1,

      backgroundColor: "#111827",

      borderRadius: 22,

      padding: 20,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.06)",
    },

    date: {
      color: "#D4AF37",

      fontWeight: "700",

      marginBottom: 10,

      fontSize: 15,
    },

    event: {
      color: "#E5E7EB",

      lineHeight: 26,

      fontSize: 15,
    },

  });