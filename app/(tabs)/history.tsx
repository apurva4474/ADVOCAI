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
// import Navbar from "../components/Navbar";
import { API } from "../../constants/api";
import { getToken } from "../../auth";

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
          Authorization: `Bearer ${token}`,
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

 const renderItem = ({ item }: any) => {
const fact =
  item?.summary?.facts?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(
          "CaseDetails",
          {
            caseId: item.caseId,
          }
        )
      }
      activeOpacity={0.85}
    >

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          AI ANALYZED
        </Text>
      </View>

      <Text style={styles.title}>
        {item.title || "Untitled Case"}
      </Text>

      <Text
        numberOfLines={3}
        style={styles.preview}
      >
        {fact
        ?fact
          : "No summary available"}
      </Text>

      <Text style={styles.date}>
        {new Date(
          item.createdAt
        ).toLocaleString()}
      </Text>

    </TouchableOpacity>
  );
};

  return (
    <View style={{ flex: 1 }}>
      {/* <Navbar /> */}

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
<Text style={styles.emptyText}>                No cases found
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
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 7,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  preview: {
    color: "#CBD5E1",
    lineHeight: 24,
    fontSize: 15,
    marginBottom: 16,
  },

  date: {
    color: "#94A3B8",
    fontSize: 12,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#312E81",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },

});