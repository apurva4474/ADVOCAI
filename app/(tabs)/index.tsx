
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import axios from "axios";

import { API } from "@/constants/api";

import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import { router } from "expo-router";

import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const handleLogout = async () => {

  try {

    await AsyncStorage.removeItem(
      "token"
    );

    await AsyncStorage.removeItem(
      "username"
    );

    router.replace("/login");

  } catch (error) {

    console.log(error);
  }
};
  const [username, setUsername] =
    useState("");

  const [stats, setStats] = useState({
    cases: 0,
    summaries: 0,
    arguments: 0,
  });
const [logoutVisible,
  setLogoutVisible] =
  useState(false);
  const [recentCases, setRecentCases] =
    useState<any[]>([]);

  const loadDashboardStats =
    async () => {

      try {

        const token =
          await AsyncStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            API.dashboardStats,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStats(response.data);

      } catch (error) {

        console.log(error);
      }
    };

  const loadUser = async () => {

    const name =
      await AsyncStorage.getItem(
        "username"
      );

    if (name) {
      setUsername(name);
    }
  };

  const loadRecentCases =
    async () => {

      try {

        const token =
          await AsyncStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            API.getCases,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setRecentCases(
          response.data.slice(0, 5)
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    loadUser();

    loadDashboardStats();

    loadRecentCases();

  }, []);

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HERO */}

      <LinearGradient
        colors={[
          "#312E81",
          "#6D28D9",
          "#9333EA",
        ]}
        style={styles.hero}
      >

        <View style={styles.heroTop}>

          <View>

            <Text style={styles.greeting}>
              Welcome Back 👋
            </Text>

            <Text style={styles.username}>
              {username || "Advocate"}
            </Text>

          </View>

          <TouchableOpacity
            style={styles.aiIcon}
            activeOpacity={0.85}
            onPress={() =>
  setLogoutVisible(true)
}
          >
            <Ionicons
              name="log-out-outline"
              size={28}
              color="white"
            />
          </TouchableOpacity>

          <Ionicons
            name="sparkles"
            size={30}
            color="white"
          />

        </View>

        <Text style={styles.heroText}>
          AI-powered legal workspace
          for smarter case analysis,
          timelines, and arguments.
        </Text>

      </LinearGradient>

      {/* STATS */}

      <View style={styles.statsContainer}>

        <View style={styles.statCard}>

          <Ionicons
            name="folder-open"
            size={26}
            color="#A78BFA"
          />

          <Text style={styles.statNumber}>
            {stats.cases}
          </Text>

          <Text style={styles.statLabel}>
            Cases
          </Text>

        </View>

        <View style={styles.statCard}>

          <Ionicons
            name="document-text"
            size={26}
            color="#A78BFA"
          />

          <Text style={styles.statNumber}>
            {stats.summaries}
          </Text>

          <Text style={styles.statLabel}>
            Summaries
          </Text>

        </View>

        <View style={styles.statCard}>

          <Ionicons
            name="chatbox-ellipses"
            size={26}
            color="#A78BFA"
          />

          <Text style={styles.statNumber}>
            {stats.arguments}
          </Text>

          <Text style={styles.statLabel}>
            Arguments
          </Text>

        </View>

      </View>

      {/* QUICK ACTIONS */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.grid}>

          <TouchableOpacity
            style={styles.featureCard}

            activeOpacity={0.85}

            onPress={() =>
              router.push("/summarizer")
            }
          >

            <LinearGradient
              colors={[
                "#1E1B4B",
                "#312E81",
              ]}

              style={styles.gradientCard}
            >

              <Ionicons
                name="document-text"
                size={34}
                color="#C4B5FD"
              />

              <Text
                style={styles.featureTitle}
              >
                Summarizer
              </Text>

              <Text
                style={styles.featureText}
              >
                Generate AI-powered legal
                summaries instantly.
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}

            activeOpacity={0.85}

            onPress={() =>
              router.push("/argument")
            }
          >

            <LinearGradient
              colors={[
                "#0F172A",
                "#1E293B",
              ]}

              style={styles.gradientCard}
            >

              <Ionicons
                name="chatbox-ellipses"
                size={34}
                color="#C4B5FD"
              />

              <Text
                style={styles.featureTitle}
              >
                Arguments
              </Text>

              <Text
                style={styles.featureText}
              >
                Generate courtroom-ready
                legal arguments.
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}

            activeOpacity={0.85}

            onPress={() =>
              router.push("/timeline")
            }
          >

            <LinearGradient
              colors={[
                "#3B0764",
                "#7E22CE",
              ]}

              style={styles.gradientCard}
            >

              <Ionicons
                name="git-branch"
                size={34}
                color="#E9D5FF"
              />

              <Text
                style={styles.featureTitle}
              >
                Timeline
              </Text>

              <Text
                style={styles.featureText}
              >
                Visualize legal chronology
                using AI.
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}

            activeOpacity={0.85}

            onPress={() =>
              router.push("/history")
            }
          >

            <LinearGradient
              colors={[
                "#172554",
                "#1D4ED8",
              ]}

              style={styles.gradientCard}
            >

              <Ionicons
                name="time"
                size={34}
                color="#BFDBFE"
              />

              <Text
                style={styles.featureTitle}
              >
                History
              </Text>

              <Text
                style={styles.featureText}
              >
                Access all previous legal
                analyses.
              </Text>

            </LinearGradient>

          </TouchableOpacity>

        </View>

      </View>

      {/* RECENT CASES */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Recent Cases
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >

          {recentCases.map(
            (item, index) => (

              <TouchableOpacity
                key={index}

                activeOpacity={0.85}

                style={styles.recentCard}
              >

                <View style={styles.badge}>

                  <Text
                    style={styles.badgeText}
                  >
                    AI ANALYZED
                  </Text>

                </View>

                <Text
                  numberOfLines={1}

                  style={styles.recentTitle}
                >
                  {item.title}
                </Text>

                <Text
                  numberOfLines={3}

                  style={styles.recentPreview}
                >
                  {item?.summary?.facts?.[0] ||

                    "Legal case analysis"}
                </Text>

              </TouchableOpacity>
            )
          )}
<Modal
  transparent
  visible={logoutVisible}
  animationType="fade"
>

  <View style={styles.modalOverlay}>

    <View style={styles.modalCard}>

      <Ionicons
        name="log-out-outline"
        size={42}
        color="#8B5CF6"
      />

      <Text style={styles.modalTitle}>
        Logout?
      </Text>

      <Text style={styles.modalText}>
        Are you sure you want to logout
        from ADVOCAI?
      </Text>

      <View style={styles.modalButtons}>

        <TouchableOpacity
          style={styles.cancelBtn}

          onPress={() =>
            setLogoutVisible(false)
          }
        >

          <Text style={styles.cancelText}>
            Cancel
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}

          onPress={handleLogout}
        >

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  </View>

</Modal>
        </ScrollView>

      </View>

      {/* AI BANNER */}

      <LinearGradient
        colors={[
          "#4C1D95",
          "#7E22CE",
        ]}

        style={styles.assistantBanner}
      >

        <View style={{ flex: 1 }}>

          <Text
            style={styles.assistantTitle}
          >
            AI Legal Intelligence
          </Text>

          <Text
            style={styles.assistantText}
          >
            Analyze cases, generate
            timelines, and create legal
            arguments instantly.
          </Text>

        </View>

        <Ionicons
          name="sparkles"
          size={42}
          color="white"
        />

      </LinearGradient>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
modalOverlay: {
  flex: 1,

  backgroundColor:
    "rgba(0,0,0,0.7)",

  justifyContent: "center",
  alignItems: "center",

  paddingHorizontal: 24,
},

modalCard: {
  width: "100%",

  backgroundColor: "#111827",

  borderRadius: 30,

  padding: 28,

  alignItems: "center",

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.05)",
},

modalTitle: {
  color: "#fff",

  fontSize: 24,

  fontWeight: "800",

  marginTop: 18,
},

modalText: {
  color: "#CBD5E1",

  textAlign: "center",

  marginTop: 12,

  lineHeight: 24,

  fontSize: 15,
},

modalButtons: {
  flexDirection: "row",

  marginTop: 28,
},

cancelBtn: {
  flex: 1,

  backgroundColor: "#1F2937",

  paddingVertical: 16,

  borderRadius: 16,

  alignItems: "center",

  marginRight: 10,
},

logoutBtn: {
  flex: 1,

  backgroundColor: "#6D28D9",

  paddingVertical: 16,

  borderRadius: 16,

  alignItems: "center",
},

cancelText: {
  color: "#fff",

  fontWeight: "700",
},

logoutText: {
  color: "#fff",

  fontWeight: "800",
},
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  hero: {
    paddingTop: 75,
    paddingHorizontal: 22,
    paddingBottom: 38,

    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: "#DDD6FE",
    fontSize: 16,
  },

  username: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 5,
  },

  aiIcon: {
    width: 64,
    height: 64,
    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.15)",

    justifyContent: "center",
    alignItems: "center",
  },

  heroText: {
    color: "#E9D5FF",
    marginTop: 22,
    fontSize: 15,
    lineHeight: 24,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingHorizontal: 18,

    marginTop: -28,
  },

  statCard: {
    width: "31%",

    backgroundColor: "#111827",

    borderRadius: 24,

    paddingVertical: 22,

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",
  },

  statNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },

  statLabel: {
    color: "#94A3B8",
    marginTop: 6,
  },

  section: {
    marginTop: 34,
    paddingHorizontal: 18,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  featureCard: {
    width: "48%",
    marginBottom: 16,
  },

  gradientCard: {
    height: 180,

    borderRadius: 26,

    padding: 20,

    justifyContent: "space-between",
  },

  featureTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
  },

  featureText: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
  },

  recentCard: {
    width: 250,

    backgroundColor: "#111827",

    borderRadius: 24,

    padding: 20,

    marginRight: 16,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",
  },

  badge: {
    alignSelf: "flex-start",

    backgroundColor: "#312E81",

    paddingHorizontal: 14,

    paddingVertical: 7,

    borderRadius: 999,

    marginBottom: 14,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  recentTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  recentPreview: {
    color: "#CBD5E1",
    lineHeight: 22,
    fontSize: 14,
  },

  assistantBanner: {
    margin: 18,

    marginTop: 38,

    marginBottom: 45,

    borderRadius: 28,

    padding: 24,

    flexDirection: "row",

    alignItems: "center",
  },

  assistantTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  assistantText: {
    color: "#E9D5FF",
    marginTop: 10,
    lineHeight: 22,
    paddingRight: 10,
  },

});

