import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function HomeScreen() {
  const [username, setUsername] = useState("");
const [stats, setStats] = useState({
  cases: 0,
  summaries: 0,
  arguments: 0,
});
const loadDashboardStats = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");

    const response = await axios.get(
      `${API.dashboardStats}/${userId}`
    );

    setStats(response.data);

  } catch (error) {
    console.log(error);
  }
};
const loadUser = async () => {
  const name = await AsyncStorage.getItem("username");

  if (name) {
    setUsername(name);
  }
};

useEffect(() => {
  loadUser();
  loadDashboardStats();

}, []);

  return (
  
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO SECTION */}

      <LinearGradient
        colors={["#312e81", "#6d28d9", "#9333ea"]}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>

            <Text style={styles.username}>{username}</Text>
          </View>

          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={28} color="white" />
          </View>
        </View>

        <Text style={styles.heroText}>
          AI-powered legal research assistant for smarter case analysis.
        </Text>
      </LinearGradient>

      {/* STATS */}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="folder-open" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{stats.cases}</Text>
          <Text style={styles.statLabel}>Cases</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{stats.summaries}</Text>
          <Text style={styles.statLabel}>Summaries</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="chatbox-ellipses" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{stats.arguments}</Text>
          <Text style={styles.statLabel}>Arguments</Text>
        </View>
      </View>

      {/* FEATURES */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/summarizer")}
          >
            <LinearGradient
              colors={["#1e1b4b", "#312e81"]}
              style={styles.gradientCard}
            >
              <Ionicons
                name="document-text"
                size={32}
                color="#c4b5fd"
              />

              <Text style={styles.featureTitle}>Summarizer</Text>

              <Text style={styles.featureText}>
                Generate legal summaries instantly
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/argument")}
          >
            <LinearGradient
              colors={["#0f172a", "#1e293b"]}
              style={styles.gradientCard}
            >
              <Ionicons
                name="chatbox-ellipses"
                size={32}
                color="#c4b5fd"
              />

              <Text style={styles.featureTitle}>Arguments</Text>

              <Text style={styles.featureText}>
                AI-generated legal arguments
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/history")}
          >
            <LinearGradient
              colors={["#172554", "#1d4ed8"]}
              style={styles.gradientCard}
            >
              <Ionicons name="time" size={32} color="#bfdbfe" />

              <Text style={styles.featureTitle}>History</Text>

              <Text style={styles.featureText}>
                Access previous case records
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}
          onPress={() => router.push("/timeline")}>
            <LinearGradient
              colors={["#3b0764", "#7e22ce"]}
              style={styles.gradientCard}
            >
              <Ionicons name="git-branch" size={32} color="#e9d5ff" />

              <Text style={styles.featureTitle}>Timeline</Text>

              <Text style={styles.featureText}>
                Visual legal timeline generation
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* RECENT ACTIVITY */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <View style={styles.activityCard}>
          <Ionicons name="document" size={22} color="#8b5cf6" />

          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>
              Property_Dispute.pdf
            </Text>

            <Text style={styles.activitySubtitle}>
              Summary generated successfully
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <Ionicons name="chatbox" size={22} color="#8b5cf6" />

          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>
              Criminal Appeal Arguments
            </Text>

            <Text style={styles.activitySubtitle}>
              AI arguments created
            </Text>
          </View>
        </View>
      </View>

      {/* AI ASSISTANT */}

      <LinearGradient
        colors={["#4c1d95", "#7e22ce"]}
        style={styles.assistantBanner}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.assistantTitle}>
            Need AI Legal Insights?
          </Text>

          <Text style={styles.assistantText}>
            Analyze complex legal cases instantly using AI.
          </Text>
        </View>

        <Ionicons name="sparkles" size={40} color="white" />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  hero: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: "#ddd6fe",
    fontSize: 16,
  },

  username: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },

  aiIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroText: {
    color: "#e9d5ff",
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -30,
  },

  statCard: {
    backgroundColor: "#0f172a",
    width: "31%",
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  statNumber: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  statLabel: {
    color: "#94a3b8",
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },

  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  featureCard: {
    width: "48%",
    marginBottom: 15,
  },

  gradientCard: {
    borderRadius: 24,
    padding: 20,
    height: 180,
    justifyContent: "space-between",
  },

  featureTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  featureText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 20,
  },

  activityCard: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  activityText: {
    marginLeft: 14,
    flex: 1,
  },

  activityTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  activitySubtitle: {
    color: "#94a3b8",
    marginTop: 4,
  },

  assistantBanner: {
    margin: 20,
    borderRadius: 28,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },

  assistantTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  assistantText: {
    color: "#e9d5ff",
    marginTop: 10,
    lineHeight: 22,
    paddingRight: 10,
  },
});