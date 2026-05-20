import { StyleSheet } from "react-native";

export const featuresStyles = StyleSheet.create({

  container: {
    marginTop: 80,
    alignItems: "center",
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },

  subheading: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 50,
    textAlign: "center",
  },

  cardContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 20,
  },

  gradientBorder: {
    padding: 1,
    borderRadius: 24,
    flex: 1,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 30,
    minHeight: 260,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  icon: {
    fontSize: 52,
    marginBottom: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 14,
    textAlign: "center",
  },

  text: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
  },

});