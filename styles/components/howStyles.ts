import { StyleSheet } from "react-native";

export const howStyles = StyleSheet.create({

  container: {
    marginTop: 80,
    alignItems: "center",
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },

  subheading: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 50,
  },

  steps: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  card: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 28,
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