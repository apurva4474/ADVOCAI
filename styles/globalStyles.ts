import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const globalStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  section: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 40,
    textAlign: "center",
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    margin: 15,
  },

  text: {
    color: COLORS.text,
  },

  mutedText: {
    color: COLORS.muted,
  },

  button: {
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

});