import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";


import { LinearGradient } from "expo-linear-gradient";

import { API } from "../constants/api";

import { getToken } from "../utils/auth";

export default function CaseDetails() {

  const { caseId } =
    useLocalSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [generatingArgs,
    setGeneratingArgs] =
    useState(false);

  const [generatingTimeline,
    setGeneratingTimeline] =
    useState(false);

  const [caseData, setCaseData] =
    useState<any>(null);

  const [argumentsData,
    setArgumentsData] =
    useState<any>(null);

  const [timeline,
    setTimeline] =
    useState<any[]>([]);
  const [translations,
  setTranslations] =
  useState<any[]>([]);
    const [chatVisible,
  setChatVisible] =
  useState(false);

const [question,
  setQuestion] =
  useState("");

const [answer,
  setAnswer] =
  useState("");

const [chatLoading,
  setChatLoading] =
  useState(false);
  /* ---------------- FETCH DATA ---------------- */

  const fetchData = async () => {

    try {

      const token =
        await getToken();

      if (!token) {

        router.replace("/login");

        return;
      }

      /* CASE */

      const caseRes =
        await fetch(

          `${API.getCaseById}/${caseId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const caseJson =
        await caseRes.json();

      if (caseRes.ok) {

        setCaseData(caseJson);
        console.log(
  "CASE DETAILS CASE DATA:",
  caseJson
);
      }

      /* ARGUMENTS */

      const argRes =
        await fetch(

          `${API.getArgumentsByCase}/${caseId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (argRes.ok) {

        const argJson =
          await argRes.json();
        console.log(
  "ARG RESPONSE:",
  JSON.stringify(argJson, null, 2)
);

console.log(
  "ARG DATA:",
  JSON.stringify(
    argJson.arguments,
    null,
    2
  )
);
        setArgumentsData(
          argJson.arguments
        );
        console.log(
  "SETTING ARGS:",
  argJson.arguments
);
      }

      /* TIMELINE */

      const timelineRes =
        await fetch(

          `${API.getTimelineByCase}/${caseId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (timelineRes.ok) {

        const timelineJson =
          await timelineRes.json();

        setTimeline(
          timelineJson.timeline
        );
      }
      /* TRANSLATIONS */

const translationRes =
  await fetch(
    `${API.getTranslationsByCase}/${caseId}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

if (translationRes.ok) {

  const translationJson =
    await translationRes.json();

  setTranslations(
    translationJson
  );
}

    } catch (error) {

      console.log(
        "CASE DETAILS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);
const askCaseQuestion =
  async () => {

    try {

      setChatLoading(true);

      const token =
        await getToken();

      const res =
        await fetch(
          API.chat,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                caseId,
                question,
              }),
          }
        );

      const data =
        await res.json();

      if (res.ok) {

        setAnswer(
          data.answer
        );

      } else {

        alert(
          data.error
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setChatLoading(false);
    }
  };
  /* ---------------- GENERATE ARGUMENTS ---------------- */

  const generateArguments =
    async () => {

      try {

        setGeneratingArgs(true);

        const token =
          await getToken();

        const res =
          await fetch(

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

        const data =
          await res.json();

        if (res.ok) {

          setArgumentsData(
            data.arguments
          );

        } else {

          alert(
            data.error ||
            "Failed to generate arguments"
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setGeneratingArgs(false);
      }
    };

  /* ---------------- GENERATE TIMELINE ---------------- */

  const generateTimeline =
    async () => {

      try {

        setGeneratingTimeline(true);

        const token =
          await getToken();

        const res =
          await fetch(

            API.generateTimeline,

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

        const data =
          await res.json();

        if (res.ok) {

          setTimeline(
            data.timeline
          );

        } else {

          alert(
            data.error ||
            "Failed to generate timeline"
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setGeneratingTimeline(false);
      }
    };

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#8B5CF6"
        />

      </View>
    );
  }

  /* ---------------- UI ---------------- */

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

        <Text style={styles.caseTitle}>
          {caseData?.title ||
            "Case Details"}
        </Text>

        <Text style={styles.heroText}>
          AI-powered legal workspace
          with structured arguments
          and case timeline.
        </Text>

      </LinearGradient>

      {/* SUMMARY */}

   <View style={styles.card}>

  <Text style={styles.sectionTitle}>
    📄 Summary
  </Text>

  <Text style={styles.subHeading}>
    Facts
  </Text>

  {caseData?.summary?.facts?.map(
    (fact: string, index: number) => (
      <Text
        key={index}
        style={styles.point}
      >
        • {fact}
      </Text>
    )
  )}

  <Text style={styles.subHeading}>
    Issues
  </Text>

  {caseData?.summary?.issues?.map(
    (issue: string, index: number) => (
      <Text
        key={index}
        style={styles.point}
      >
        • {issue}
      </Text>
    )
  )}

  <Text style={styles.subHeading}>
    Judgement
  </Text>

  <Text style={styles.text}>
    {caseData?.summary?.judgement}
  </Text>

  <Text style={styles.subHeading}>
    Legal Principles
  </Text>

  {caseData?.summary?.legalPrinciples?.map(
    (
      item: string,
      index: number
    ) => (
      <Text
        key={index}
        style={styles.point}
      >
        • {item}
      </Text>
    )
  )}

</View>

      {/* ARGUMENTS */}

      <View style={styles.card}>

        <View style={styles.row}>

          <Text style={styles.sectionTitle}>
            ⚖️ Arguments
          </Text>

          {!argumentsData && (

            <TouchableOpacity
              style={styles.actionBtn}

              onPress={
                generateArguments
              }
            >

              <Text
                style={styles.actionText}
              >
                {generatingArgs
                  ? "Generating..."
                  : "Generate"}
              </Text>

            </TouchableOpacity>
          )}

        </View>

        {argumentsData ? (

          <>

            <Text style={styles.subHeading}>
              Plaintiff Arguments
            </Text>

            {argumentsData
              ?.plaintiffArguments
              ?.map(
                (
                  item: string,
                  index: number
                ) => (

                  <Text
                    key={index}
                    style={styles.point}
                  >
                    • {item}
                  </Text>
                )
              )}

            <Text style={styles.subHeading}>
              Defendant Arguments
            </Text>

            {argumentsData
              ?.defendantArguments
              ?.map(
                (
                  item: string,
                  index: number
                ) => (

                  <Text
                    key={index}
                    style={styles.point}
                  >
                    • {item}
                  </Text>
                )
              )
              }
              <Text style={styles.subHeading}>
  Key Legal Points
</Text>

{argumentsData
  ?.keyLegalPoints
  ?.map(
    (
      item: string,
      index: number
    ) => (

      <Text
        key={index}
        style={styles.point}
      >
        • {item}
      </Text>
    )
  )}

          </>

        ) : (

          <Text style={styles.empty}>
            No arguments generated yet.
          </Text>
        )}

      </View>

      {/* TIMELINE */}

      <View style={styles.card}>

        <View style={styles.row}>

          <Text style={styles.sectionTitle}>
            🕒 Timeline
          </Text>

          {timeline.length === 0 && (

            <TouchableOpacity
              style={styles.actionBtn}

              onPress={
                generateTimeline
              }
            >

              <Text
                style={styles.actionText}
              >
                {generatingTimeline
                  ? "Generating..."
                  : "Generate"}
              </Text>

            </TouchableOpacity>
          )}

        </View>

        {timeline.length > 0 ? (

          timeline.map(
            (
              item: any,
              index: number
            ) => (

              <View
                key={index}
                style={styles.timelineItem}
              >

                <View
                  style={styles.dot}
                />

                <View
                  style={
                    styles.timelineContent
                  }
                >

                  <Text
                    style={styles.timelineDate}
                  >
                    {item.date}
                  </Text>

                  <Text
                    style={styles.timelineEvent}
                  >
                    {item.event}
                  </Text>

                </View>

              </View>
            )
          )

        ) : (

          <Text style={styles.empty}>
            No timeline generated yet.
          </Text>
        )}

      </View>
        <View style={styles.card}>

  <Text style={styles.sectionTitle}>
    🌐 Translations
  </Text>

  {translations.length > 0 ? (

    translations.map(
      (
        item: any,
        index: number
      ) => (

        <View
          key={index}
          style={{
            marginTop: 16,
          }}
        >

          <Text
            style={styles.subHeading}
          >
            {item.language}
          </Text>

          <Text
            style={styles.text}
          >
            {item.translatedText}
          </Text>

        </View>
      )

    )

  ) : (

    <Text style={styles.empty}>
      No translations available.
    </Text>

  )}

</View>
<Modal
  visible={chatVisible}
  animationType="slide"
>
  <View style={styles.modal}>

    <Text style={styles.modalTitle}>
      🤖 ADVOCAI Assistant
    </Text>

    <TextInput
      placeholder="Ask about this case..."
      placeholderTextColor="#999"
      value={question}
      onChangeText={setQuestion}
      style={styles.input}
    />

    <TouchableOpacity
      style={styles.askBtn}
      onPress={
        askCaseQuestion
      }
    >
      <Text>
        {chatLoading
          ? "Thinking..."
          : "Ask"}
      </Text>
    </TouchableOpacity>

    <ScrollView>
      <Text
        style={styles.answer}
      >
        {answer}
      </Text>
    </ScrollView>

    <TouchableOpacity
      onPress={() =>
        setChatVisible(false)
      }
    >
      <Text>
        Close
      </Text>
    </TouchableOpacity>

  </View>
</Modal>
    </ScrollView>
    
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 18,
  },

  loader: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  hero: {
    padding: 28,
    borderRadius: 28,
    marginBottom: 24,
  },

  caseTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },

  heroText: {
    color: "#E9D5FF",
    fontSize: 15,
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.05)",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  subHeading: {
    color: "#C4B5FD",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },

  text: {
    color: "#CBD5E1",
    lineHeight: 26,
    fontSize: 15,
  },

  point: {
    color: "#CBD5E1",
    lineHeight: 24,
    marginBottom: 10,
    flexShrink: 1,
  },

  actionBtn: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
  },

  empty: {
    color: "#94A3B8",
    marginTop: 10,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#8B5CF6",
    marginTop: 6,
    marginRight: 14,
  },

  timelineContent: {
    flex: 1,
  },

  timelineDate: {
    color: "#C4B5FD",
    fontWeight: "700",
    marginBottom: 6,
  },

  timelineEvent: {
    color: "#CBD5E1",
    lineHeight: 24,
  },
  chatFab: {
  position: "absolute",
  bottom: 25,
  right: 20,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#2563EB",
  justifyContent: "center",
  alignItems: "center",
  elevation: 8,
},

modal: {
  flex: 1,
  backgroundColor: "#0F172A",
  padding: 20,
},

modalTitle: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 10,
},

input: {
  backgroundColor: "#1E293B",
  color: "#fff",
  padding: 15,
  borderRadius: 12,
  marginTop: 20,
},

askBtn: {
  backgroundColor: "#2563EB",
  padding: 15,
  borderRadius: 12,
  marginTop: 12,
  alignItems: "center",
},

answer: {
  color: "#fff",
  marginTop: 20,
  lineHeight: 24,
},
});