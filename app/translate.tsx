import { getToken } from "@/utils/auth";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API } from "../constants/api";
export default function TranslateScreen() {
  
  const params = useLocalSearchParams();
  const summaryData =
  params.summary
    ? JSON.parse(
        params.summary as string
      )
    : null;
    const caseId =
  params.caseId as string;
const [translatedSummary, setTranslatedSummary] =
  useState<any>(null);
const handleTranslate = async () => {
  try {

    console.log("STEP 1");

    setLoading(true);

    const token = await getToken();

    console.log("STEP 2");

    const response = await fetch(
      API.translate,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId,
          summary: summaryData,
          language,
        }),
      }
    );

    console.log("STEP 3");

    const data = await response.json();

    console.log("STEP 4");
    console.log("TRANSLATE RESPONSE:", data);

    if (response.ok) {

      setTranslatedSummary(
        data.translation
      );

    } else {

      Alert.alert(
        "Error",
        data.error ||
          "Translation failed"
      );
    }

  } catch (error) {

    console.log(
      "STEP ERROR"
    );

    console.log(error);

    Alert.alert(
      "Error",
      "Translation failed"
    );

  } finally {

    console.log(
      "STEP FINALLY"
    );

    setLoading(false);
  }
};
const [loading, setLoading] =
  useState(false);
  const [language, setLanguage] =
    useState("Hindi");

  return (
  <ScrollView
    contentContainerStyle={styles.container}
  >
    <Text style={styles.heading}>
      🌐 AI Legal Translator
    </Text>

    <Text style={styles.subtitle}>
      Translate legal case summaries into
      regional languages using AI.
    </Text>

    {/* Original Summary */}

    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        📄 Original Summary
      </Text>

      <Text style={styles.summaryText}>
       {summaryData
  ? JSON.stringify(summaryData, null, 2)
  : "No summary available"}
      </Text>
    </View>

    {/* Language Selector */}

    <View style={styles.card}>
      <Text style={styles.title}>
        🌍 Select Language
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={language}
          onValueChange={(value) =>
            setLanguage(value)
          }
          style={styles.picker}
        >
          <Picker.Item
            label="🇮🇳 Hindi"
            value="Hindi"
          />
          <Picker.Item
            label="🌿 Kannada"
            value="Kannada"
          />
          <Picker.Item
            label="🔥 Tamil"
            value="Tamil"
          />
        </Picker>
      </View>
    </View>

    {/* Translate Button */}

    <TouchableOpacity
      style={styles.button}
      onPress={handleTranslate}
    >
      <Text style={styles.buttonText}>
        {loading
  ? "Translating..."
  : "⚡ Translate Summary"}
      </Text>
    </TouchableOpacity>

    {/* Future Translation Output */}

    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        ✨ Translated Summary
      </Text>

      <Text style={styles.summaryText}>
        {translatedSummary
  ? JSON.stringify(
      translatedSummary,
      null,
      2
    )
  : "Translation will appear here..."}
      </Text>
    </View>

  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#38BDF8",
    marginBottom: 12,
  },

  pickerContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },

  picker: {
    color: "#FFFFFF",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
  color: "#94A3B8",
  marginBottom: 24,
  fontSize: 14,
},

cardTitle: {
  color: "#38BDF8",
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 12,
},

summaryText: {
  color: "#E2E8F0",
  lineHeight: 24,
  fontSize: 14,
},
});