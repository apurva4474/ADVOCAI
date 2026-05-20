import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 768;

export const howStyles = StyleSheet.create({

  container: {
    marginTop: isMobile ? 60 : 80,
    alignItems: "center",
  },

  heading: {
    fontSize: isMobile ? 28 : 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },

  subheading: {
    fontSize: isMobile ? 14 : 16,
    color: "#9CA3AF",
    marginBottom: 50,
  },

  steps: {
    width: "100%",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    gap: isMobile ? 10 : 20,
  },

  card: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: isMobile ? 20 : 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  circleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },

  text: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
  },

});