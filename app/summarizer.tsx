import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
export default function Summarizer() {
  const navigation = useNavigation<any>();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<any>(null);

  // 📄 File Picker
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
      navigation.navigate("Login", {
      redirectTo: "Summarizer",
});
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(API.uploadPdf, {
      method: "POST",
      headers: {
        Authorization: token, // 🔥 IMPORTANT
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
    <ScrollView style={{ flex: 1 }}>

      <Navbar />

      <View style={styles.container}>

        <Text style={styles.heading}>Case Summarizer</Text>

        {/* Toggle */}
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
            <Text style={mode === "text" ? styles.activeText : styles.inactiveText}>
              Text
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
            <Text style={mode === "file" ? styles.activeText : styles.inactiveText}>
              PDF
            </Text>
          </TouchableOpacity>

        </View>

        {/* Input */}
        {mode === "text" ? (
          <TextInput
            placeholder="Paste your case details..."
            multiline
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
        ) : (
          <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
            <Text style={styles.uploadText}>
              {fileName ? fileName : "Upload PDF 📄"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleSummarize}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Summarize</Text>
          )}
        </TouchableOpacity>

        {/* Output */}
        {summary ? (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>📄 Summary Result</Text>
            <Text style={styles.resultText}>{summary}</Text>
          </View>
        ) : null}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
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
  input: {
    width: "100%",
    height: 140,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    textAlignVertical: "top",
  },
  uploadBtn: {
    marginTop: 15,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  uploadText: {
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    marginTop: 25,
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    width: "100%",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});