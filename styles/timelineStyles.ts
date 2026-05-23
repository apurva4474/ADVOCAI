import {
  Dimensions,
  StyleSheet,
} from "react-native";

const screenWidth =
  Dimensions.get("window").width;

const isMobile = screenWidth < 768;

export const timelineStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 50,
  },

  hero: {
    marginTop: 20,
    marginBottom: 28,
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },

  subheading: {
    fontSize: 15,
    color: "#94A3B8",
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 28,
    padding: 22,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 8,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  caseCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  preview: {
    color: "#CBD5E1",
    lineHeight: 22,
    fontSize: 14,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#D4AF37",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",

    shadowColor: "#D4AF37",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,

    elevation: 8,
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },

  timelineContainer: {
    marginTop: 32,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 28,
  },

  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#D4AF37",
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginTop: 4,
  },

  timelineCard: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 20,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  timelineDate: {
    color: "#D4AF37",
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 14,
  },

  timelineEvent: {
    color: "#E5E7EB",
    lineHeight: 24,
    fontSize: 15,
  },

  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },

  loadingBox: {
    marginTop: 30,
    alignItems: "center",
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 14,
    fontSize: 15,
  },

});