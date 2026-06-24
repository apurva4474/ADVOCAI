import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Hero />

        <View style={styles.section}>
          <Features />
        </View>

        <View style={styles.section}>
          <HowItWorks />
        </View>
        <View style={styles.section}>
        <View style={styles.disclaimerCard}>

  <Text style={styles.disclaimerTitle}>
    ⚖️ Educational Use Only
  </Text>

  <Text style={styles.disclaimerText}>
    ADVOCAI is an AI-powered legal research and
    learning tool. All summaries, arguments,
    timelines, translations, and AI responses
    are generated automatically and may contain
    inaccuracies. The information provided
    should not be considered legal advice,
    legal opinion, or admissible evidence in
    any court of law. Always verify information
    with official legal documents and qualified
    legal professionals.
  </Text>

</View>
</View>
      </ScrollView>
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },

  scrollContainer: {
    paddingBottom: 60,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  disclaimerCard: {
  backgroundColor: "#1E293B",
  borderRadius: 16,
  padding: 16,
  marginTop: 20,
  borderLeftWidth: 4,
  borderLeftColor: "#F59E0B",
},

disclaimerTitle: {
  color: "#FBBF24",
  fontSize: 16,
  fontWeight: "700",
  marginBottom: 8,
},

disclaimerText: {
  color: "#CBD5E1",
  lineHeight: 22,
  fontSize: 13,
},
});