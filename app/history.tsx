import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Navbar from "../components/Navbar";
import { API } from "../constants/api";

export default function History() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSummaries = async () => {
    try {
      const res = await fetch(API.getSummaries);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>
        {item.filename || "Text Summary"}
      </Text>

      <Text numberOfLines={3} style={styles.preview}>
        {item.summary}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Navbar />

      <View style={styles.container}>
        <Text style={styles.heading}>📂 Summary History</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
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
  },
  preview: {
    color: "#444",
  },
});