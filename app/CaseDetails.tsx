
import { useNavigation, useRoute } from "@react-navigation/native";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import { API } from "../constants/api";

import { getToken } from "../utils/auth";

export default function CaseDetails() {

  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const { caseId } = route.params;

  const [loading, setLoading] =
    useState(true);

  const [caseData, setCaseData] =
    useState<any>(null);

  const [generatingArguments,
    setGeneratingArguments] =
    useState(false);

  const [argumentsData,
    setArgumentsData] =
    useState<any>(null);

  /* ---------------- FETCH CASE ---------------- */

  const fetchCaseDetails =
    async () => {

      try {

        const token =
          await getToken();

        if (!token) {

          alert(
            "Please login first"
          );

          navigation.navigate(
            "Login"
          );

          return;
        }

        const res = await fetch(
          `${API.getCaseById}/${caseId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const json =
          await res.json();

        setCaseData(json);

      } catch (err) {

        console.log(
          "CASE DETAILS ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  /* ---------------- GENERATE ARGUMENTS ---------------- */

  const generateArguments =
    async () => {

      try {

        setGeneratingArguments(true);

        const token =
          await getToken();

        const res = await fetch(
          API.generateArguments,

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              caseId,
            }),
          }
        );

        const json =
          await res.json();

        setArgumentsData(
          json.arguments
        );

      } catch (err) {

        console.log(
          "ARGUMENT ERROR:",
          err
        );

      } finally {

        setGeneratingArguments(false);
      }
    };

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#D4AF37"
        />

      </View>
    );
  }

  /* ---------------- SUMMARY ---------------- */

  const summary =
    caseData?.summary || {};

  return (

    <ScrollView
      style={styles.container}

      showsVerticalScrollIndicator={
        false
      }
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

        <View style={styles.badge}>

          <Text style={styles.badgeText}>
            AI ANALYZED
          </Text>

        </View>

        <Text style={styles.title}>
          {caseData?.title ||
            "Case Details"}
        </Text>

        <Text style={styles.date}>
          {new Date(
            caseData?.createdAt
          ).toLocaleString()}
        </Text>

      </LinearGradient>

      {/* SUMMARY */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          📌 Key Facts
        </Text>

        {summary?.facts?.map(
          (
            fact: string,
            index: number
          ) => (

            <View
              key={index}
              style={styles.factCard}
            >

              <Text
                style={styles.factText}
              >
                • {fact}
              </Text>

            </View>
          )
        )}

      </View>

      {/* ISSUES */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          ⚠️ Legal Issues
        </Text>

        <View style={styles.chipContainer}>

          {summary?.issues?.map(
            (
              issue: string,
              index: number
            ) => (

              <View
                key={index}
                style={styles.issueChip}
              >

                <Text
                  style={styles.issueText}
                >
                  {issue}
                </Text>

              </View>
            )
          )}

        </View>

      </View>

      {/* JUDGEMENT */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          🧑‍⚖️ Judgement
        </Text>

        <View
          style={styles.judgementCard}
        >

          <Text
            style={styles.judgementText}
          >
            {summary?.judgement ||
              "No judgement available"}
          </Text>

        </View>

      </View>

      {/* PRINCIPLES */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          📚 Legal Principles
        </Text>

        {summary?.legalPrinciples?.map(
          (
            principle: string,
            index: number
          ) => (

            <View
              key={index}
              style={styles.principleCard}
            >

              <Text
                style={
                  styles.principleText
                }
              >
                {principle}
              </Text>

            </View>
          )
        )}

      </View>

      {/* ACTIONS */}

      <View style={styles.actionRow}>

        <TouchableOpacity
          style={styles.actionButton}

          activeOpacity={0.85}

          onPress={generateArguments}
        >

          {generatingArguments ? (

            <ActivityIndicator
              color="#000"
            />

          ) : (

            <>
              <Ionicons
                name="chatbox-ellipses"
                size={20}
                color="#000"
              />

              <Text
                style={
                  styles.actionButtonText
                }
              >
                Generate Arguments
              </Text>
            </>
          )}

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}

          activeOpacity={0.85}

          onPress={() =>
            navigation.navigate(
              "timeline",
              { caseId }
            )
          }
        >

          <Ionicons
            name="git-branch"
            size={20}
            color="#fff"
          />

          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Timeline
          </Text>

        </TouchableOpacity>

      </View>

      {/* ARGUMENTS */}

      {argumentsData ? (

        <View style={styles.card}>

          {/* PLAINTIFF */}

          <Text style={styles.sectionTitle}>
            ⚖️ Plaintiff Arguments
          </Text>

          {argumentsData
            ?.plaintiffArguments?.map(
              (
                arg: string,
                index: number
              ) => (

                <View
                  key={index}
                  style={styles.argumentCard}
                >

                  <Text
                    style={
                      styles.argumentText
                    }
                  >
                    • {arg}
                  </Text>

                </View>
              )
            )}

          {/* DEFENDANT */}

          <Text
            style={[
              styles.sectionTitle,
              {
                marginTop: 26,
              },
            ]}
          >
            🛡️ Defendant Arguments
          </Text>

          {argumentsData
            ?.defendantArguments?.map(
              (
                arg: string,
                index: number
              ) => (

                <View
                  key={index}
                  style={styles.argumentCard}
                >

                  <Text
                    style={
                      styles.argumentText
                    }
                  >
                    • {arg}
                  </Text>

                </View>
              )
            )}

        </View>

      ) : null}

      <View style={{ height: 50 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#020617",

    justifyContent: "center",
    alignItems: "center",
  },

  hero: {
    paddingTop: 80,
    paddingHorizontal: 22,
    paddingBottom: 40,

    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  badge: {
    alignSelf: "flex-start",

    backgroundColor:
      "rgba(255,255,255,0.18)",

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 999,

    marginBottom: 18,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 42,
  },

  date: {
    color: "#E9D5FF",
    marginTop: 14,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#111827",

    marginHorizontal: 18,
    marginTop: 24,

    borderRadius: 26,

    padding: 22,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  factCard: {
    backgroundColor: "#0F172A",

    padding: 18,

    borderRadius: 18,

    marginBottom: 14,
  },

  factText: {
    color: "#E5E7EB",
    lineHeight: 24,
    fontSize: 15,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  issueChip: {
    backgroundColor: "#312E81",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 16,

    marginRight: 10,
    marginBottom: 10,

    maxWidth: "100%",
  },

  issueText: {
    color: "#fff",
    fontWeight: "600",

    flexShrink: 1,

    flexWrap: "wrap",
  },

  judgementCard: {
    backgroundColor: "#1E293B",

    borderLeftWidth: 5,
    borderLeftColor: "#D4AF37",

    padding: 22,

    borderRadius: 18,
  },

  judgementText: {
    color: "#F9FAFB",
    lineHeight: 28,
    fontSize: 15,
  },

  principleCard: {
    backgroundColor: "#0F172A",

    padding: 18,

    borderRadius: 18,

    marginBottom: 12,
  },

  principleText: {
    color: "#E5E7EB",
    lineHeight: 24,
    fontSize: 15,
  },

  actionRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginHorizontal: 18,
    marginTop: 28,
  },

  actionButton: {
    flex: 1,

    backgroundColor: "#D4AF37",

    paddingVertical: 18,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    marginRight: 10,
  },

  actionButtonText: {
    color: "#000",
    fontWeight: "800",
    marginLeft: 8,
  },

  secondaryButton: {
    width: 130,

    backgroundColor: "#1E293B",

    paddingVertical: 18,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },

  argumentCard: {
    backgroundColor: "#0F172A",

    padding: 18,

    borderRadius: 18,

    marginBottom: 14,
  },

  argumentText: {
    color: "#E5E7EB",
    lineHeight: 24,
    fontSize: 15,
  },

});

