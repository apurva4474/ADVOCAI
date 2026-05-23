import { useEffect, useState } from "react";

import axios from "axios";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// import Navbar from "../../components/Navbar";

import { API } from "../../constants/api";

import { timelineStyles } from "../../styles/timelineStyles";

export default function Timeline() {

  const [mode, setMode] = useState<
    "existing" | "new"
  >("existing");

  const [cases, setCases] = useState<any[]>([]);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [text, setText] = useState("");

  const [timeline, setTimeline] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  // FETCH CASES
  const fetchCases = async () => {

    try {

      const res = await axios.get(
        API.getSummaries
      );

      console.log(
        "TIMELINE CASES:",
        res.data
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

  useEffect(() => {
    fetchCases();
  }, []);

  // GENERATE TIMELINE
  const generateTimeline = async () => {

  try {

    if (
      mode === "existing" &&
      selectedIndex === null
    ) {

      alert("Please select a case");

      return;
    }

    setLoading(true);

    const finalText =
      mode === "existing"

        ? selectedIndex !== null ? cases[selectedIndex]?.text : undefined

        : text;

    if (!finalText) {

      alert(
        "No summary found"
      );

      return;
    }

    const res = await axios.post(
      API.generateTimeline,
      {
        text: finalText,
      }
    );

    setTimeline(res.data);

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
      style={timelineStyles.screen}

      showsVerticalScrollIndicator={false}
    >
{/*  */}
      {/* <Navbar /> */}

      <View style={timelineStyles.container}>

        <Text style={timelineStyles.heading}>
          AI Timeline Builder
        </Text>

        <Text style={timelineStyles.subheading}>
          Generate chronological legal
          timelines instantly using AI.
        </Text>

        {/* TOGGLE */}
        <View
          style={
            timelineStyles.toggleContainer
          }
        >

          <TouchableOpacity
            style={[
              timelineStyles.toggleButton,

              mode === "existing"
                ? timelineStyles.activeButton
                : null,
            ]}

            onPress={() =>
              setMode("existing")
            }
          >

            <Text
              style={
                mode === "existing"

                  ? timelineStyles.activeText

                  : timelineStyles.inactiveText
              }
            >
              Existing Case
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              timelineStyles.toggleButton,

              mode === "new"

                ? timelineStyles.activeButton

                : null,
            ]}

            onPress={() =>
              setMode("new")
            }
          >

            <Text
              style={
                mode === "new"

                  ? timelineStyles.activeText

                  : timelineStyles.inactiveText
              }
            >
              New Case
            </Text>

          </TouchableOpacity>

        </View>

        {/* EXISTING CASES */}
        {mode === "existing" ? (

          <View
            style={
              timelineStyles.cardContainer
            }
          >

            {cases.map(
              (
                item: any,
                index: number
              ) => {

                const selected =
                  selectedIndex === index;

                return (

                  <TouchableOpacity
                    key={index}

                    style={[

                      timelineStyles.card,

                      selected

                        ? timelineStyles.selectedCard

                        : null,
                    ]}

                    onPress={() => {

  console.log("case:", item);

  setSelectedIndex(index);
}}
                  >

                    <Text
                      style={
                        timelineStyles.cardTitle
                      }
                    >
                      {item.title ||

                        item.filename ||

                        `Case ${index + 1}`}
                    </Text>

                    <Text
                      numberOfLines={3}

                      style={
                        timelineStyles.preview
                      }
                    >
                      {item.summary}
                    </Text>

                  </TouchableOpacity>
                );
              }
            )}

          </View>

        ) : (

          <TextInput
            style={timelineStyles.input}

            multiline

            placeholder="Paste legal case details..."

            placeholderTextColor="#6B7280"

            value={text}

            onChangeText={setText}
          />

        )}

        {/* BUTTON */}
        <TouchableOpacity
          style={timelineStyles.button}

          onPress={generateTimeline}
        >

          {loading ? (

            <ActivityIndicator
              color="#000"
            />

          ) : (

            <Text
              style={
                timelineStyles.buttonText
              }
            >
              Generate Timeline
            </Text>

          )}

        </TouchableOpacity>

        {/* RESULT */}
        {timeline.length > 0 && (

          <View
            style={
              timelineStyles.timelineContainer
            }
          >

            <Text
              style={
                timelineStyles.timelineHeading
              }
            >
              Timeline Result
            </Text>

            {timeline.map(
              (
                item: any,
                index: number
              ) => (

                <View
                  key={index}

                  style={
                    timelineStyles.timelineCard
                  }
                >

                  <View
                    style={
                      timelineStyles.circle
                    }
                  />

                  <View
                    style={
                      timelineStyles.timelineContent
                    }
                  >

                    <Text
                      style={
                        timelineStyles.date
                      }
                    >
                      {item.date}
                    </Text>

                    <Text
                      style={
                        timelineStyles.event
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