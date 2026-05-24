
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { API } from "../../constants/api";
import { getToken } from "../../utils/auth";
import { LinearGradient } from "expo-linear-gradient";

export default function TimelineScreen() {

  const [cases, setCases] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [timeline, setTimeline] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {

    try {

      const token =
        await getToken();

      const res = await axios.get(
        API.getCases,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCases(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.log(error);
    }
  };

  const generateTimeline = async () => {

    try {

      if (selectedIndex === null) {

        alert("Please select a case");

        return;
      }

      setLoading(true);

      const token =
        await getToken();

      const selectedCase =
        cases[selectedIndex];

      const res = await axios.post(
        API.generateTimeline,

        {
          caseId:
            selectedCase.caseId,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTimeline(
        res.data.timeline
      );

    } catch (error) {

      console.log(error);

      alert(
        "Timeline generation failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#020617",
      }}
      showsVerticalScrollIndicator={false}
    >

      <View style={timelineStyles.container}>

        {/* HERO */}

        <LinearGradient
  colors={[
    "#312E81",
    "#6D28D9",
    "#9333EA",
  ]}

  style={timelineStyles.hero}
>

          <Text style={timelineStyles.heading}>
            Legal Case Timeline
          </Text>

          <Text style={timelineStyles.subheading}>
            Generate chronological legal
            events and case progress
            instantly using AI-powered
            analysis.
          </Text>

      
        </LinearGradient>
          
        {/* CARD */}

        <View style={timelineStyles.card}>

          <Text style={timelineStyles.sectionTitle}>
            Select Case
          </Text>

          {cases.length === 0 ? (

            <Text style={timelineStyles.emptyText}>
No analyzed cases yet.
Generate summaries before creating timelines.            </Text>

          ) : (

            cases.map(
              (item, index) => (

                <TouchableOpacity
                  key={index}

                  activeOpacity={0.85}

                  onPress={() =>
                    setSelectedIndex(index)
                  }

                  style={[
                    timelineStyles.caseCard,

                    selectedIndex === index
                      ? timelineStyles.selectedCard
                      : null,
                  ]}
                >

                  <Text
                    style={
                      timelineStyles.cardTitle
                    }
                  >
                    {item.title}
                  </Text>

                  <Text
                    numberOfLines={3}

                    style={
                      timelineStyles.preview
                    }
                  >
                    {item?.summary?.facts?.[0] ||

                      "AI analyzed legal case"}
                  </Text>

                </TouchableOpacity>
              )
            )
          )}

          {/* BUTTON */}

          <TouchableOpacity
            style={timelineStyles.button}

            activeOpacity={0.85}

            onPress={generateTimeline}
          >

            {loading ? (

              <ActivityIndicator color="#000" />

            ) : (

              <Text
                style={
                  timelineStyles.buttonText
                }
              >
                Generate Legal Timeline
              </Text>

            )}

          </TouchableOpacity>

        </View>

        {/* RESULT */}

        {timeline.length > 0 && (

          <View
            style={
              timelineStyles.timelineContainer
            }
          >

            {timeline.map(
              (
                item: any,
                index: number
              ) => (

                <View
                  key={index}

                  style={
                    timelineStyles.timelineItem
                  }
                >

                  {/* LEFT */}

                  <View
                    style={
                      timelineStyles.timelineLeft
                    }
                  >

                    <View
                      style={
                        timelineStyles.dot
                      }
                    />

                    {index !==
                      timeline.length - 1 && (

                      <View
                        style={
                          timelineStyles.line
                        }
                      />

                    )}

                  </View>

                  {/* CARD */}

                  <View
                    style={
                      timelineStyles.timelineCard
                    }
                  >

                    <Text
                      style={
                        timelineStyles.timelineDate
                      }
                    >
                      {item.date}
                    </Text>

                    <Text
                      style={
                        timelineStyles.timelineEvent
                      }
                    >
                      {item.event}
                    </Text>

                  </View>

                </View>
              )
            )}

          </View>

        )}

      </View>

    </ScrollView>
  );
}

const timelineStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 50,
  },

 hero: {
  paddingTop: 40,
  paddingHorizontal: 24,
  paddingBottom: 36,

  borderRadius: 30,

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
    borderColor: "#8B5CF6",
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
    backgroundColor: "#8B5CF6",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",

    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,

    elevation: 8,
  },

  buttonText: {
    color: "#fff",
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
    backgroundColor: "#8B5CF6",
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor:
      "rgba(255,255,255,0.1)",
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
    color: "#8B5CF6",
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

});

