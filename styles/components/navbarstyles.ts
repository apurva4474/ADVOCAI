import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 768;

export const navbarStyles = StyleSheet.create({

  navbar: {
    width: "100%",
    paddingHorizontal: isMobile ? 20 : 30,
    paddingVertical: 22,

    flexDirection: isMobile ? "column" : "row",

    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#0B0F19",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",

    gap: isMobile ? 20 : 0,
  },

  logo: {
    fontSize: isMobile ? 24 : 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },

  menu: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "center",
    alignItems: "center",

    gap: isMobile ? 18 : 30,
  },

  link: {
    color: "#E5E7EB",
    fontSize: isMobile ? 14 : 16,
    fontWeight: "600",
  },

  auth: {
    flexDirection: "row",

    flexWrap: "wrap",

    alignItems: "center",
    justifyContent: "center",

    gap: 12,
  },

  button: {
    paddingHorizontal: isMobile ? 14 : 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  outline: {
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "transparent",
  },

  filled: {
    backgroundColor: "#D4AF37",
  },

  outlineText: {
    color: "#D4AF37",
    fontWeight: "700",
    fontSize: isMobile ? 13 : 14,
  },

  filledText: {
    color: "#000",
    fontWeight: "700",
    fontSize: isMobile ? 13 : 14,
  },

  userBox: {
    backgroundColor: "rgba(212,175,55,0.12)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },

  userText: {
    color: "#D4AF37",
    fontWeight: "700",
    fontSize: isMobile ? 14 : 15,
  },

});