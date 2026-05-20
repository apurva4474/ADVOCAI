import { StyleSheet } from "react-native";

export const navbarStyles = StyleSheet.create({

  navbar: {
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0B0F19",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },

  logoAccent: {
    color: "#D4AF37",
  },

  menu: {
    flexDirection: "row",
    gap: 30,
  },

  link: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
  },

  auth: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    paddingHorizontal: 18,
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
  },

  filledText: {
    color: "#000",
    fontWeight: "700",
  },

});