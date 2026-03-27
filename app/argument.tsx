import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";

export default function ArgumentGenerator() {

  const [mode, setMode] = useState<"existing" | "new">("existing");

  const [summaries, setSummaries] = useState<any[]>([]);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [input, setInput] = useState("");

  const [summaryResult, setSummaryResult] = useState("");
  const [argumentsResult, setArgumentsResult] = useState("");

  const [loading, setLoading] = useState(false);

  // 📂 Fetch history
  const fetchSummaries = async () => {
    try {
      const res = await fetch(API.getSummaries);
      const data = await res.json();
      setSummaries(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  // ⚖️ Generate from existing summary
  const handleGenerateFromExisting = async () => {
    if (!selectedSummary) return alert("Select a case");

    try {
      setLoading(true);

      const res = await fetch(API.arguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: selectedSummary,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setArgumentsResult(data.arguments);
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 New case → summarize + arguments
  const handleAnalyzeNew = async () => {
    if (!input) return alert("Enter case details");

    try {
      setLoading(true);

      const res = await fetch(API.analyzeCase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: input,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSummaryResult(data.summary);
        setArgumentsResult(data.arguments);
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Navbar />

      <View style={styles.container}>

        <Text style={styles.heading}>⚖️ Argument Generator</Text>

        {/* 🔀 Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === "existing" && styles.activeBtn]}
            onPress={() => {
              setMode("existing");
              setArgumentsResult("");
              setSummaryResult("");
            }}
          >
            <Text style={mode === "existing" ? styles.activeText : styles.inactiveText}>
              Existing Case
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, mode === "new" && styles.activeBtn]}
            onPress={() => {
              setMode("new");
              setArgumentsResult("");
              setSummaryResult("");
            }}
          >
            <Text style={mode === "new" ? styles.activeText : styles.inactiveText}>
              New Case
            </Text>
          </TouchableOpacity>
        </View>

        {/* 📂 EXISTING */}
        {mode === "existing" && (
          <>
            <Text style={styles.subHeading}>Select a Case:</Text>

            {summaries.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  selectedSummary === item.summary && styles.selectedCard
                ]}
                onPress={() => setSelectedSummary(item.summary)}
              >
                <Text style={styles.cardTitle}>
                  {item.filename || "Case"}
                </Text>
                <Text numberOfLines={2} style={styles.preview}>
                  {item.summary}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleGenerateFromExisting}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Generate Arguments</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ✍️ NEW CASE */}
        {mode === "new" && (
          <>
            <TextInput
              placeholder="Paste case details..."
              multiline
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleAnalyzeNew}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Analyze Case</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* 📄 Summary Output */}
        {summaryResult ? (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>📄 Summary</Text>
            <Text>{summaryResult}</Text>
          </View>
        ) : null}

        {/* ⚖️ Arguments Output */}
        {argumentsResult ? (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>⚖️ Arguments</Text>
            <Text>{argumentsResult}</Text>
          </View>
        ) : null}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  subHeading: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  toggleBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 5,
  },

  activeBtn: {
    backgroundColor: "#000",
  },

  activeText: {
    color: "#fff",
    textAlign: "center",
  },

  inactiveText: {
    color: "#000",
    textAlign: "center",
  },

  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#000",
  },

  cardTitle: {
    fontWeight: "bold",
  },

  preview: {
    fontSize: 13,
    color: "#555",
  },

  input: {
    height: 140,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },

  resultTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

});