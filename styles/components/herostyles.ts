import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 768;

export const heroStyles = StyleSheet.create({

  hero: {
    height: Dimensions.get("window").height,
    width: "100%",
    justifyContent: "center",
  },

  darkOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: isMobile ? 24 : 60,
  },

  content: {
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 1300,
    alignSelf: "center",
  },

  textContainer: {
    flex: 1,
    maxWidth: isMobile ? "100%" : 700,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(212,175,55,0.12)",
    color: "#D4AF37",
    paddingHorizontal: isMobile ? 12 : 18,
    paddingVertical: isMobile ? 8 : 10,
    borderRadius: 30,
    marginBottom: 28,
    fontWeight: "700",
  },

  title: {
    fontSize: isMobile ? 42 : 72,
    fontWeight: "900",
    color: "#fff",
    lineHeight: isMobile ? 54 : 82,
    marginBottom: 24,
    letterSpacing: -2,
  },

  subtitle: {
    fontSize: isMobile ? 16 : 20,
    color: "#D1D5DB",
    lineHeight: 34,
    maxWidth: 650,
    marginBottom: 40,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 18,
    flexWrap: "wrap",
  },

  primaryBtn: {
    backgroundColor: "#D4AF37",
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 18,
  },

  primaryBtnText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  secondaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  playWrapper: {
    marginTop: isMobile ? 60 : 0,
    justifyContent: "center",
    alignItems: "center",
  },

  playCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(212,175,55,0.15)",
    borderWidth: 2,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    fontSize: 50,
    color: "#D4AF37",
    marginLeft: 6,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 10,
  },

  closeText: {
    fontSize: 42,
    color: "#fff",
  },

  video: {
    width: isMobile ? "95%" : "80%",
    height: isMobile ? 260 : "75%",
    borderRadius: 24,
  },

});