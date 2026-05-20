import { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import CustomButton from "../components/ui/CustomButton";
import InputField from "../components/ui/InputField";

import { API } from "../constants/api";

export default function Register() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const res = await fetch(API.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {

        alert("Registration successful");

        router.replace("/login");

      } else {
        alert(data.error || "Registration failed");
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
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Start using AI-powered legal assistance
        </Text>

        <InputField
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

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
            title="Register"
            onPress={handleRegister}
          />
        </View>

        <Text
          style={styles.loginText}
          onPress={() => router.push("/login")}
        >
          Already have an account? Login
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

  loginText: {
    color: "#D4AF37",
    textAlign: "center",
    marginTop: 24,
    fontWeight: "600",
  },
});