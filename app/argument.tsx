import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Navbar from "../components/Navbar";
import { API } from "../constants/api";
import { getToken } from "../utils/auth";

export default function ArgumentGenerator() {

  const [mode, setMode] = useState<"existing" | "new">("existing");

  const [cases, setCases] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [input, setInput] = useState("");

  const [argumentsResult, setArgumentsResult] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH CASES
  const fetchCases = async () => {

    try {

      const token = await getToken();

      console.log("TOKEN:", token);

      const res = await fetch(API.getCases, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("CASES RESPONSE:", data);

      // SAFE SET
      setCases(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log("FETCH CASE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // EXISTING CASE ARGUMENTS
  const handleGenerateFromExisting = async () => {

    if (selectedIndex === null) {
      alert("Please select a case");
      return;
    }

    try {

      setLoading(true);

      const token = await getToken();

      const selectedCase = cases[selectedIndex];

      const res = await fetch(API.generateArguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId:
            selectedCase?._id ||
            selectedCase?.caseId,
        }),
      });

      const data = await res.json();

      setArgumentsResult(
        data.arguments ||
        data.result ||
        "No arguments generated"
      );

    } catch (err) {
      console.log(err);
      alert("Failed to generate arguments");
    } finally {
      setLoading(false);
    }
  };

  // NEW CASE ARGUMENTS
  const handleGenerateFromNew = async () => {

    if (!input.trim()) {
      alert("Please enter case details");
      return;
    }

    try {

      setLoading(true);

      const token = await getToken();

      const res = await fetch(API.generateArguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: input,
        }),
      });

      const data = await res.json();

      setArgumentsResult(
        data.arguments ||
        data.result ||
        "No arguments generated"
      );

    } catch (err) {
      console.log(err);
      alert("Failed to generate arguments");
    } finally {
      setLoading(false);
    }
  };

  return (

    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0F19" }}
      showsVerticalScrollIndicator={false}
    >

      <Navbar />

      <View style={styles.container}>

        <Text style={styles.heading}>
          AI Argument Generator
        </Text>

        <Text style={styles.subtitle}>
          Generate powerful AI-based legal arguments
        </Text>

        {/* TOGGLE */}
        <View style={styles.toggleContainer}>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "existing"
                ? styles.activeBtn
                : null,
            ]}
            onPress={() => {
              setMode("existing");
              setArgumentsResult("");
            }}
          >
            <Text
              style={
                mode === "existing"
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              Existing Cases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "new"
                ? styles.activeBtn
                : null,
            ]}
            onPress={() => {
              setMode("new");
              setArgumentsResult("");
            }}
          >
            <Text
              style={
                mode === "new"
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              New Case
            </Text>
          </TouchableOpacity>

        </View>

        {/* EXISTING CASES */}
        {mode === "existing" && (

          <View>

            <Text style={styles.caseCount}>
              Total Cases: {cases.length}
            </Text>

            {cases.length === 0 ? (

              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No cases found
                </Text>
              </View>

            ) : (

              cases.map((item: any, index: number) => {

                const selected =
                  selectedIndex === index;

                return (

                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    style={[
                      styles.card,
                      selected
                        ? styles.selectedCard
                        : null,
                    ]}
                    onPress={() =>
                      setSelectedIndex(index)
                    }
                  >

                    <Text style={styles.cardTitle}>
                      {item.title ||
                        item.filename ||
                        item.caseTitle ||
                        `Case ${index + 1}`}
                    </Text>

                    <Text
                      numberOfLines={4}
                      style={styles.preview}
                    >
                      {item.summary ||
                        item.text ||
                        item.content ||
                        "AI summarized legal document"}
                    </Text>

                  </TouchableOpacity>
                );
              })
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerateFromExisting}
            >

              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>
                  Generate Arguments
                </Text>
              )}

            </TouchableOpacity>

          </View>
        )}

        {/* NEW CASE */}
        {mode === "new" && (

          <View>

            <TextInput
              placeholder="Enter legal case details..."
              placeholderTextColor="#6B7280"
              multiline
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerateFromNew}
            >

              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>
                  Generate AI Arguments
                </Text>
              )}

            </TouchableOpacity>

          </View>
        )}

        {/* RESULT */}
        {argumentsResult ? (

          <View style={styles.resultContainer}>

            <Text style={styles.resultTitle}>
              AI Generated Arguments
            </Text>

            <Text style={styles.resultText}>
              {argumentsResult}
            </Text>

          </View>

        ) : null}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0B0F19",
    minHeight: "100%",
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 28,
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 6,
    marginBottom: 28,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  activeBtn: {
    backgroundColor: "#D4AF37",
  },

  activeText: {
    color: "#000",
    fontWeight: "700",
  },

  inactiveText: {
    color: "#9CA3AF",
    fontWeight: "600",
  },

  caseCount: {
    color: "#D4AF37",
    marginBottom: 18,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 20,
  },

  emptyText: {
    color: "#9CA3AF",
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  selectedCard: {
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.08)",
    borderWidth: 2,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  preview: {
    color: "#9CA3AF",
    lineHeight: 22,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#111827",
    borderRadius: 22,
    minHeight: 220,
    padding: 20,
    color: "#fff",
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  button: {
    backgroundColor: "#D4AF37",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },

  resultContainer: {
    marginTop: 30,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  resultTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 18,
  },

  resultText: {
    color: "#D1D5DB",
    lineHeight: 30,
    fontSize: 16,
  },

});