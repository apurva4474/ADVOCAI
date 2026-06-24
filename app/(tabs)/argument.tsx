import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// import Navbar from "../components/Navbar";
import { useRouter } from "expo-router";
import { API } from "../../constants/api";
import { getToken } from "../../utils/auth";
const router = useRouter();
export default function ArgumentGenerator() {

  const [mode, setMode] = useState<"existing" | "new">("existing");
const [argumentsData, setArgumentsData] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  // FETCH CASES
  const fetchCases = async () => {

    try {

      const token = await getToken();

      

      const res = await fetch(API.getCases, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

     

      // SAFE SET
      setCases(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log("FETCH CASE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // EXISTING CASE ARGUMENTS
  const handleGenerateFromExisting = async () => {

    if (selectedIndex === null) {
      alert("Please select a case");
      return;
    }

    try {

      setLoading(true);

      const token = await getToken();

      const selectedCase = cases[selectedIndex];
  

      const res = await fetch(API.generateArguments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId:
            selectedCase?._id ||
            selectedCase?.caseId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {

  alert(
    data.error ||
    "Failed to generate arguments"
  );

  return;
}

      setArgumentsData(data.arguments);

    } catch (err) {
      console.log(err);
      alert("Failed to generate arguments");
    } finally {
      setLoading(false);
    }
  };

  // NEW CASE ARGUMENTS
  const handleGenerateFromNew = async () => {

    router.push("/summarizer");
  };

  return (

    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0F19" }}
      showsVerticalScrollIndicator={false}
    >

      {/* <Navbar /> */}

      <View style={styles.container}>

        <Text style={styles.heading}>
          AI Argument Generator
        </Text>

        <Text style={styles.subtitle}>
          Generate powerful AI-based legal arguments
        </Text>

        {/* TOGGLE */}
        <View style={styles.toggleContainer}>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "existing"
                ? styles.activeBtn
                : null,
            ]}
            onPress={() => {
              setMode("existing");
              setArgumentsData(null);
            }}
          >
            <Text
              style={
                mode === "existing"
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              Existing Cases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "new"
                ? styles.activeBtn
                : null,
            ]}
            onPress={() => {
              setMode("new");
            }}
          >
            <Text
              style={
                mode === "new"
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              New Case
            </Text>
          </TouchableOpacity>

        </View>

        {/* EXISTING CASES */}
        {mode === "existing" && (

          <View>

            <Text style={styles.caseCount}>
              Total Cases: {cases.length}
            </Text>

            {cases.length === 0 ? (

              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No summarized cases yet.
  Generate a summary first to
  create legal arguments.

                </Text>
              </View>

            ) : (

              cases.map((item: any, index: number) => {

                const selected =
                  selectedIndex === index;

                return (

                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    style={[
                      styles.card,
                      selected
                        ? styles.selectedCard
                        : null,
                    ]}
                    onPress={() =>
                      setSelectedIndex(index)
                    }
                  >

                    <Text style={styles.cardTitle}>
                      {item.title ||
                        item.filename ||
                        item.caseTitle ||
                        `Case ${index + 1}`}
                    </Text>

                    <Text
                      numberOfLines={6}
                      style={styles.preview}
                    >
                      {item?.summary?.facts?.[0] ||
 "AI summarized legal document"}
                    </Text>

                  </TouchableOpacity>
                );
              })
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerateFromExisting}
            >

              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>
                  Generate Arguments
                </Text>
              )}

            </TouchableOpacity>

          </View>
        )}

        {/* NEW CASE */}
        {mode === "new" && (

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/summarizer")}
          >
            <Text style={styles.buttonText}>
              Go To Summarizer
            </Text>
          </TouchableOpacity>
        )}

       {/* RESULT */}
{argumentsData ? (

  <View style={styles.resultContainer}>

    {/* PLAINTIFF */}

    <View style={styles.sideCard}>

      <Text style={styles.sideTitle}>
        ⚖️ Plaintiff Arguments
      </Text>

      {argumentsData?.plaintiffArguments?.map(
        (arg: string, index: number) => (

          <View
            key={index}
            style={styles.argumentCard}
          >

            <Text style={styles.argumentText}>
              • {arg}
            </Text>

          </View>
        )
      )}

    </View>

    {/* DEFENDANT */}

    <View style={styles.sideCard}>

      <Text style={styles.sideTitle}>
        🛡️ Defendant Arguments
      </Text>

      {argumentsData?.defendantArguments?.map(
        (arg: string, index: number) => (

          <View
            key={index}
            style={styles.argumentCard}
          >

            <Text style={styles.argumentText}>
              • {arg}
            </Text>

          </View>
        )
      )}

    </View>

    {/* LEGAL POINTS */}

    <View style={styles.sideCard}>

      <Text style={styles.sideTitle}>
        📚 Key Legal Points
      </Text>

      <View style={styles.pointsContainer}>

        {argumentsData?.keyLegalPoints?.map(
          (point: string, index: number) => (

            <View
              key={index}
              style={styles.pointChip}
            >

              <Text style={styles.pointText}>
                {point}
              </Text>

            </View>
          )
        )}

      </View>

    </View>

  </View>

) : null}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 50,
  },

  hero: {
    marginTop: 20,
    marginBottom: 28,
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },

  subheading: {
    fontSize: 15,
    color: "#94A3B8",
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 28,
    padding: 22,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 8,
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 18,
    padding: 6,
    marginBottom: 24,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  activeBtn: {
    backgroundColor: "#8B5CF6",
  },

  activeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  inactiveText: {
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 15,
  },

  selectBox: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  selectText: {
    color: "#fff",
    fontSize: 15,
  },


  caseTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },

  casePreview: {
    color: "#CBD5E1",
    lineHeight: 22,
    fontSize: 14,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#8B5CF6",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",

    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,

    elevation: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  resultContainer: {
    marginTop: 30,
  },

  sideCard: {
    backgroundColor: "#111827",
    padding: 22,
    borderRadius: 24,
    marginBottom: 22,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  sideTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  argumentCard: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },

  argumentText: {
    color: "#E5E7EB",
    lineHeight: 24,
    fontSize: 15,
  },

  pointsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
pointChip: {
  backgroundColor: "#312E81",

  paddingHorizontal: 14,
  paddingVertical: 10,

  borderRadius: 16,

  marginRight: 10,
  marginBottom: 10,

  maxWidth: "100%",
},


  pointText: {
    color: "#fff",
    fontWeight: "600",
    flexShrink: 1,
  },

  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 30,
    fontSize: 15,
  },
subtitle: {
  color: "#94A3B8",
  fontSize: 15,
  marginBottom: 26,
  lineHeight: 24,
},

caseCount: {
  color: "#CBD5E1",
  marginBottom: 16,
  fontSize: 14,
},

emptyCard: {
  backgroundColor: "#111827",
  padding: 24,
  borderRadius: 20,
  alignItems: "center",
},

selectedCard: {
  borderWidth: 2,
  borderColor: "#8B5CF6",
},

cardTitle: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 10,
},

preview: {
  color: "#CBD5E1",
  lineHeight: 22,
  fontSize: 14,
},

input: {
  backgroundColor: "#0F172A",
  minHeight: 220,
  borderRadius: 22,
  padding: 20,
  color: "#fff",
  fontSize: 16,
  textAlignVertical: "top",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.05)",
},
});