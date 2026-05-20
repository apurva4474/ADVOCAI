import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";

import {
  ScrollView,
  StatusBar,
  StyleSheet,
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
});