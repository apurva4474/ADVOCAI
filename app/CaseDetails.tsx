import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";
import { getToken } from "../utils/auth";

export default function CaseDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { caseId } = route.params;

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [argumentsText, setArgumentsText] = useState("");

  // 🔥 Fetch case details WITH TOKEN
  const fetchCaseDetails = async () => {
    try {
      const token = await getToken();

      if (!token) {
        alert("Please login first");
        navigation.navigate("Login");
        return;
      }

      const res = await fetch(`${API.getCaseById}/${caseId}`, {
        headers: {
          Authorization: token,
        },
      });

      const json = await res.json();
      setCaseData(json);
    } catch (err) {
      console.log("CASE DETAILS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  // 🔥 Generate arguments WITH TOKEN
  const generateArguments = async () => {
    try {
      setGenerating(true);

      const token = await getToken();

      if (!token) {
        alert("Please login first");
        navigation.navigate("Login");
        return;
      }

      const res = await fetch(API.generateArguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ caseId }),
      });

      const json = await res.json();
      setArgumentsText(json.arguments);
    } catch (err) {
      console.log("ARGUMENT ERROR:", err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          {caseData?.title || "Case Details"}
        </Text>

        <Text style={styles.sectionTitle}>📄 Summary</Text>
        <Text style={styles.text}>
          {caseData?.summary || "No summary available"}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={generateArguments}
          disabled={generating}
        >
          <Text style={styles.buttonText}>
            {generating ? "Generating..." : "⚖️ Generate Arguments"}
          </Text>
        </TouchableOpacity>

        {argumentsText ? (
          <>
            <Text style={styles.sectionTitle}>🧠 Arguments</Text>
            <Text style={styles.text}>{argumentsText}</Text>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
});