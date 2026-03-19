
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";
import * as DocumentPicker from "expo-document-picker";

export default function Summarizer() {

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  // 📄 File Picker
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.assets && result.assets.length > 0) {
      setFileName(result.assets[0].name);
    }
  };

  // ✨ Summarize
  const handleSummarize = async () => {
    // if (!text) {
    //   alert("Enter case details");
    //   return;
    // }

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
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      <Navbar />

      <View style={styles.container}>

        <Text style={styles.heading}>Case Summarizer</Text>

        {/* Input */}
        {/* <TextInput
          placeholder="Paste your case details..."
          multiline
          value={text}
          onChangeText={setText}
          style={styles.input}
        /> */}

        {/* File Upload */}
        <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
          <Text style={styles.uploadText}>
            {fileName ? fileName : "Upload PDF 📄"}
          </Text>
        </TouchableOpacity>

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
    justifyContent: "center",   // 🔥 center vertically
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

