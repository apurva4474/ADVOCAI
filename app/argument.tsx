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
import { getToken } from "../utils/auth";

export default function ArgumentGenerator() {

  const [mode, setMode] = useState<"existing" | "new">("existing");

  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");

  const [input, setInput] = useState("");

  const [argumentsResult, setArgumentsResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch cases (NEW SYSTEM)
  const fetchCases = async () => {
    try {
      const token = await getToken();

      const res = await fetch(API.getCases, {
        headers: {
          Authorization: token || "",
        },
      });

      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // 🔥 Generate from EXISTING case
  const handleGenerateFromExisting = async () => {
    if (!selectedCaseId) return alert("Select a case");

    try {
      setLoading(true);

      const token = await getToken();

      const res = await fetch(API.generateArguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          caseId: selectedCaseId,
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

  // 🔥 Generate from NEW text (direct AI)
  const handleGenerateFromNew = async () => {
    if (!input) return alert("Enter case details");

    try {
      setLoading(true);

      const res = await fetch(API.generateArguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input, // 👈 backend should support this OR skip this mode
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

  return (
  <ScrollView
    style={{ flex: 1, backgroundColor: "#0B0F19" }}
    showsVerticalScrollIndicator={false}
  >

    <Navbar />

    <View style={styles.container}>

      {/* HERO */}
      <View style={styles.hero}>

        <Text style={styles.heading}>
          AI Argument Generator
        </Text>

        <Text style={styles.subheading}>
          Generate powerful legal arguments using your
          existing case summaries or fresh case inputs.
        </Text>

      </View>

      {/* MAIN CARD */}
      <View style={styles.mainCard}>

        {/* TOGGLE */}
        <View style={styles.toggleContainer}>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "existing" && styles.activeBtn
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
              mode === "new" && styles.activeBtn
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

        {/* EXISTING CASE */}
        {mode === "existing" && (
          <>

            <Text style={styles.sectionTitle}>
              Select Existing Case
            </Text>

            <View style={styles.caseContainer}>

              {cases.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.caseCard,
                    selectedCaseId === item._id ? styles.selectedCard: null,
                  ]}
                  onPress={() => setSelectedCaseId(item._id)}
                >

                  <Text style={styles.caseTitle}>
                    {item.title || `Case ${index + 1}`}
                  </Text>

                  <Text style={styles.caseText}>
                    Tap to generate arguments
                  </Text>

                </TouchableOpacity>
              ))}

            </View>

            <TouchableOpacity
              style={styles.generateBtn}
              onPress={handleGenerateFromExisting}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.generateBtnText}>
                  Generate Arguments
                </Text>
              )}
            </TouchableOpacity>

          </>
        )}

        {/* NEW CASE */}
        {mode === "new" && (
          <>

            <Text style={styles.sectionTitle}>
              Enter Case Details
            </Text>

            <TextInput
              placeholder="Describe the legal case details..."
              placeholderTextColor="#6B7280"
              multiline
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.generateBtn}
              onPress={handleGenerateFromNew}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.generateBtnText}>
                  Generate AI Arguments
                </Text>
              )}
            </TouchableOpacity>

          </>
        )}

      </View>

      {/* RESULT */}
      {argumentsResult ? (
        <View style={styles.resultCard}>

          <View style={styles.resultHeader}>

            <Text style={styles.resultTitle}>
              AI Generated Arguments
            </Text>

            <TouchableOpacity style={styles.copyBtn}>
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.resultContent}>

            <Text style={styles.resultText}>
              {argumentsResult}
            </Text>

          </View>

        </View>
      ) : null}

    </View>

  </ScrollView>
);}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#0B0F19",
    paddingBottom: 60,
  },

  hero: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 40,
    maxWidth: 900,
  },

  heading: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },

  subheading: {
    fontSize: 17,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 28,
    maxWidth: 700,
  },

  mainCard: {
    width: "100%",
    maxWidth: 950,
    backgroundColor: "#111827",
    borderRadius: 28,
    padding: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  toggleContainer: {
    flexDirection: "row",
    marginBottom: 28,
    backgroundColor: "#1F2937",
    padding: 6,
    borderRadius: 16,
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
    fontSize: 15,
  },

  inactiveText: {
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  caseContainer: {
    gap: 18,
  },

  caseCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  selectedCard: {
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.08)",
  },

  caseTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  caseText: {
    color: "#9CA3AF",
    fontSize: 15,
  },

  input: {
    backgroundColor: "#0F172A",
    minHeight: 220,
    borderRadius: 20,
    padding: 20,
    color: "#fff",
    fontSize: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  generateBtn: {
    marginTop: 28,
    backgroundColor: "#D4AF37",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  generateBtnText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },

  resultCard: {
    width: "100%",
    maxWidth: 950,
    marginTop: 35,
    backgroundColor: "#111827",
    borderRadius: 28,
    padding: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  copyBtn: {
    backgroundColor: "#D4AF37",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  copyText: {
    color: "#000",
    fontWeight: "700",
  },

  resultContent: {
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  resultText: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 30,
  },

});