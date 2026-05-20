import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";
import { getToken } from "../utils/auth";
export default function Summarizer() {
  const navigation = useNavigation<any>();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<any>(null);
  const router = useRouter();
  const [processingText, setProcessingText] = useState("Initializing AI...");
const fadeAnim = useRef(new Animated.Value(0)).current;
const rotateAnim = useRef(new Animated.Value(0)).current;

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const fileObj = new File([blob], asset.name, {
        type: "application/pdf",
      });

      setFile(fileObj);
      setFileName(asset.name);
    }
  };

  // ✨ Summarize
  const handleSummarize = async () => {

    // ✅ TEXT MODE FIXED
    if (mode === "text") {

      if (!text) {
        alert("Enter case details");
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(API.summarize, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "User Case",
            content: text,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setSummary(data.summary);
        } else {
          alert(data.error || "Error");
        }

      } catch (err) {
        console.log(err);
        alert("Server error");
      } finally {
        setLoading(false);
      }
    }

// ✅ FILE MODE FIXED WITH AUTH
if (mode === "file") {

  if (!file) {
    alert("Please upload a PDF");
    return;
  }

  try {
    setLoading(true);

    const token = await getToken(); // 🔥 get token

    if (!token) {
      alert("Please login first");
      router.push({
  pathname: "/login",
  params: { redirectTo: "summarizer" },
});

      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(API.uploadPdf, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setSummary(data.summary);

      // 🔥 OPTIONAL (very good UX)
      // navigation.navigate("CaseDetails", { caseId: data.caseId });

    } else {
      alert(data.error || "Upload failed");
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  } finally {
    setLoading(false);
  }
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
          AI Legal Summarizer
        </Text>

        <Text style={styles.subheading}>
          Upload case files or paste legal text to generate
          AI-powered summaries instantly.
        </Text>

      </View>

      {/* MAIN CARD */}
      <View style={styles.card}>

        {/* TOGGLE */}
        <View style={styles.toggleContainer}>

          <TouchableOpacity
            onPress={() => {
              setMode("text");
              setSummary("");
              setFileName("");
            }}
            style={[
              styles.toggleBtn,
              mode === "text" && styles.activeBtn
            ]}
          >
            <Text
              style={
                mode === "text"
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              Text Input
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMode("file");
              setSummary("");
              setText("");
            }}
            style={[
              styles.toggleBtn,
              mode === "file" && styles.activeBtn
            ]}
          >
            <Text
              style={
                mode === "file"
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              PDF Upload
            </Text>
          </TouchableOpacity>

        </View>

        {/* INPUT */}
        {mode === "text" ? (
          <TextInput
            placeholder="Paste legal case details..."
            placeholderTextColor="#6B7280"
            multiline
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
        ) : (
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickFile}
          >
            <Text style={styles.uploadIcon}>📄</Text>

            <Text style={styles.uploadTitle}>
              Upload Legal PDF
            </Text>

            <Text style={styles.uploadText}>
              {fileName
                ? fileName
                : "Tap here to upload your case file"}
            </Text>
          </TouchableOpacity>
        )}

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSummarize}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              Generate Summary
            </Text>
          )}
        </TouchableOpacity>

      </View>

      {/* RESULT */}
      {summary ? (
        <View style={styles.resultCard}>

          <Text style={styles.resultTitle}>
            📑 AI Summary Result
          </Text>

          <Text style={styles.resultText}>
            {summary}
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
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },

  subheading: {
    fontSize: 17,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 28,
    maxWidth: 700,
  },

  card: {
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

  uploadBox: {
    minHeight: 240,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    padding: 30,
  },

  uploadIcon: {
    fontSize: 56,
    marginBottom: 16,
  },

  uploadTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },

  uploadText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
  },

  button: {
    marginTop: 28,
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

  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  resultText: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 30,
  },

});