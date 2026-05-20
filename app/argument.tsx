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
const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [input, setInput] = useState("");

  const [argumentsResult, setArgumentsResult] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH CASES
  const fetchCases = async () => {
    try {

      const token = await getToken();
      console.log("TOKEN IN FETCH CASES:", token);
      const res = await fetch(API.getCases, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCases(data.cases);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // EXISTING CASE ARGUMENTS
  async function handleGenerateFromExisting() {

    if (!selectedCaseId) {
      alert("Please select a case");
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
          caseId: cases[selectedCaseId!]?.caseId,
        }),
      });

      const data = await res.json();

      setArgumentsResult(data.arguments);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

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

      setArgumentsResult(data.arguments);

    } catch (err) {
      console.log(err);
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
              Existing Case
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

          <View style={styles.cardContainer}>

            {cases.map((item: any, index: number) => (

              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                 selectedCaseId === index
                    ? styles.selectedCard
                    : null,
                ]}
                onPress={() =>
                  setSelectedCaseId(index)
                }
              >

                <Text style={styles.cardTitle}>
                  {item.filename || `Case ${index + 1}`}
                </Text>

                <Text
                  numberOfLines={3}
                  style={styles.preview}
                >
                  {item.summary ||
                    "AI summarized legal document"}
                </Text>

              </TouchableOpacity>

            ))}

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

          <View style={styles.newCaseContainer}>

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
    padding: 20,
    backgroundColor: "#0B0F19",
    minHeight: "100%",
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 30,
    color: "#fff",
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
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

  cardContainer: {
    gap: 16,
  },

  card: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: "#111827",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.08)",
  },

  cardTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },

  preview: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 22,
  },

  newCaseContainer: {
    gap: 20,
  },

  input: {
    backgroundColor: "#111827",
    minHeight: 220,
    borderRadius: 22,
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
    fontSize: 16,
    lineHeight: 30,
  },

});