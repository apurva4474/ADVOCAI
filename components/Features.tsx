import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

export default function Features() {
  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Powerful AI Tools</Text>

      <View style={[styles.cardContainer, isMobile && styles.mobileCards]}>

        <View style={styles.card}>
          <Text style={styles.icon}>📄</Text>
          <Text style={styles.title}>Document Summariser</Text>
          <Text style={styles.text}>
            Upload PDFs or images of case files and get instant AI summaries.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>⚖️</Text>
          <Text style={styles.title}>Argument Generator</Text>
          <Text style={styles.text}>
            Generate strong legal arguments automatically from case facts.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.title}>Timeline Builder</Text>
          <Text style={styles.text}>
            Organize case events into a clear chronological timeline.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>🔎</Text>
          <Text style={styles.title}>Legal Research</Text>
          <Text style={styles.text}>
            Extract insights from long legal documents instantly.
          </Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingVertical: 80,
    paddingHorizontal: 40,
   
    alignItems: "center",
  },

  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginBottom: 50,
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  mobileCards: {
    flexDirection: "column",
    width: "100%",
  },

  card: {
    width: isMobile ? "100%" : 250,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 25,
    borderRadius: 12,
    margin: 15,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  icon: {
    fontSize: 40,
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

});