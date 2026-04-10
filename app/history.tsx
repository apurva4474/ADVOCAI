import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";
import { getToken } from "../auth";

export default function History() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  // 🔥 Fetch cases with auth
  const fetchCases = async () => {
    try {
      const token = await getToken();

      if (!token) {
        alert("Please login first");
        navigation.navigate("Login");
        return;
      }

      const res = await fetch(API.getCases, {
        headers: {
          Authorization: token,
        },
      });

      const json = await res.json();

      if (res.ok) {
        setData(json);
      } else {
        console.log("API ERROR:", json);
        alert("Failed to fetch cases");
      }
    } catch (err) {
      console.log("FETCH CASES ERROR:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("CaseDetails", {
          caseId: item.caseId,
        })
      }
    >
      <Text style={styles.title}>
        {item.title || "Untitled Case"}
      </Text>

      <Text numberOfLines={3} style={styles.preview}>
        {item.summary || "No summary available"}
      </Text>

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Navbar />

      <View style={styles.container}>
        <Text style={styles.heading}>📂 Case History</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.caseId}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No cases found
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  preview: {
    color: "#444",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
});