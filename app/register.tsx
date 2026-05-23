import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import axios from "axios";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { API } from "@/constants/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(API.register, {
        name,
        email,
        password,
      });

      Alert.alert(
        "Success",
        "Account created successfully"
      );

      router.push("/login");
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Registration Failed",
        error?.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#111827", "#1e1b4b"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons
              name="person-add"
              size={40}
              color="white"
            />
          </View>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join ADVOCAI today
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            Full Name
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person"
              size={20}
              color="#94a3b8"
            />

            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Email</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail"
              size={20}
              color="#94a3b8"
            />

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed"
              size={20}
              color="#94a3b8"
            />

            <TextInput
              placeholder="Create password"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
          >
            <LinearGradient
              colors={["#7c3aed", "#9333ea"]}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>
                Register
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(139,92,246,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 10,
  },

  form: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  label: {
    color: "white",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  inputContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  input: {
    flex: 1,
    color: "white",
    paddingVertical: 16,
    marginLeft: 10,
    fontSize: 15,
  },

  registerButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  registerButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  loginText: {
    color: "#c4b5fd",
    textAlign: "center",
    marginTop: 24,
    fontSize: 15,
  },
});