import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import InputField from "../components/ui/InputField";
import { API } from "../constants/api";
import { saveToken } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Login() {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const res = await fetch(API.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔥 save token
        await saveToken(data.token);
        await AsyncStorage.setItem(
  "username",
  data.user.name
);

        // 🔥 redirect logic
        if (redirectTo) {
          router.replace(`/${redirectTo}` as any);
        } else {
          router.replace("/dashboard"); // or home/dashboard
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
  <View style={styles.screen}>

    <View style={styles.glowTop} />
    <View style={styles.glowBottom} />

    <View style={styles.card}>

      <Text style={styles.logo}>
        ADVOC-AI
      </Text>

      <Text style={styles.heading}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to continue your AI legal workspace
      </Text>

      <InputField
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />

      <InputField
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ marginTop: 10 }}>
        <CustomButton
          title="Login"
          onPress={handleLogin}
        />
      </View>

      <Text
        style={styles.registerText}
        onPress={() => router.push("/register")}
      >
        Don't have an account? Register
      </Text>

    </View>

  </View>
);
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    overflow: "hidden",
  },

  glowTop: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(212,175,55,0.18)",
    top: -80,
    left: -60,
  },

  glowBottom: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -80,
    right: -40,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#111827",
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#D4AF37",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    fontSize: 15,
  },

  registerText: {
    color: "#D4AF37",
    textAlign: "center",
    marginTop: 24,
    fontWeight: "600",
  },

});