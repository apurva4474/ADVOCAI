import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API } from "../../constants/api";

import { getToken } from "../../utils/auth";

export default function History() {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* ---------------- FETCH CASES ---------------- */

  const fetchCases = async () => {

    try {

      const token =
        await getToken();

      if (!token) {

        alert("Please login first");

        router.replace("/login");

        return;
      }

      const res = await fetch(
        API.getCases,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const json =
        await res.json();

      if (res.ok) {

        setData(json);

      } else {

        console.log(
          "API ERROR:",
          json
        );

        alert(
          json.error ||
          "Failed to fetch cases"
        );
      }

    } catch (err) {

      console.log(
        "FETCH CASES ERROR:",
        err
      );

      alert("Server error");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchCases();

  }, []);

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = ({
    item,
  }: any) => {

    const fact =
      item?.summary?.facts?.[0];

    return (

      <TouchableOpacity
        style={styles.card}

        activeOpacity={0.85}

        onPress={() =>

          router.push({

            pathname:
              "/CaseDetails",

            params: {
              caseId:
                item.caseId,
            },
          })
        }
      >

        <View style={styles.badge}>

          <Text style={styles.badgeText}>
            AI ANALYZED
          </Text>

        </View>

        <Text style={styles.title}>
          {item.title ||
            "Untitled Case"}
        </Text>

        <Text
          style={styles.preview}
          numberOfLines={3}
        >
          {fact
            ? fact
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

  /* ---------------- UI ---------------- */

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        📂 Case History
      </Text>

      {loading ? (

        <View style={styles.loader}>

          <ActivityIndicator
            size="large"
            color="#8B5CF6"
          />

        </View>

      ) : (

        <FlatList
          data={data}

          renderItem={renderItem}

          keyExtractor={(
            item,
            index
          ) =>

            item.caseId
              ? item.caseId.toString()
              : index.toString()
          }

          showsVerticalScrollIndicator={
            false
          }

          ListEmptyComponent={

            <Text
              style={styles.emptyText}
            >
              No analyzed cases yet.
              {"\n"}
              Generate summaries to
              build your legal workspace.
            </Text>
          }

          contentContainerStyle={{
            paddingBottom: 40,
          }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 24,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#111827",

    borderRadius: 24,

    padding: 22,

    marginBottom: 18,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.25,

    shadowRadius: 10,

    elevation: 7,
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
    fontWeight: "700",
    fontSize: 12,
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

  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 80,
    fontSize: 16,
    lineHeight: 28,
  },

});