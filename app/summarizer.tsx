
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";

export default function Summarizer() {

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
      setFileName(result.assets[0].name);
      setFile(result.assets[0]); 
    }
  };

  // ✨ Summarize
  const handleSummarize = async () => {

    // TEXT MODE
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
            content: text
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

    // FILE MODE

 // FILE MODE
if (mode === "file") {

  if (!file) {
    alert("Please upload a PDF");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: "application/pdf",
    } as any);

    const caseId = "123"; // dummy for now

    const res = await fetch(`${API.uploadPdf}/${caseId}`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await res.json();
    console.log("API RESPONSE:", data); 

    if (res.ok) {
      setSummary(data.summary);
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
    <View style={{ flex: 1 }}>

      <Navbar />

      <View style={styles.container}>

        <Text style={styles.heading}>Case Summarizer</Text>

        {/* Toggle */}
        <View style={{ flexDirection: "row", marginBottom: 20, width: "100%" }}>

          <TouchableOpacity
            onPress={() => setMode("text")}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: mode === "text" ? "#000" : "#eee",
              borderRadius: 8,
              marginRight: 5,
            }}
          >
            <Text style={{ color: mode === "text" ? "#fff" : "#000", textAlign: "center" }}>
              Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode("file")}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: mode === "file" ? "#000" : "#eee",
              borderRadius: 8,
              marginLeft: 5,
            }}
          >
            <Text style={{ color: mode === "file" ? "#fff" : "#000", textAlign: "center" }}>
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
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Summary:
            </Text>
            <Text>{summary}</Text>
          </View>
        ) : null}

      </View>
    </View>
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
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    width: "100%",
  },
});

