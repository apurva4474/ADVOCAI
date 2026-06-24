import axios from "axios";
import LottieView from "lottie-react-native";
import { useState } from "react";
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

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { API } from "@/constants/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess,
  setShowSuccess] =
  useState(false);
  const handleLogin = async () => {
    try {
      const response = await axios.post(API.login, {
        email,
        password,
      });

      const data = response.data;

      // SAVE USER DATA

      await AsyncStorage.setItem(
        "username",
        data.user.name
      );

      await AsyncStorage.setItem(
        "userId",
        data.user.id
      );

      await AsyncStorage.setItem(
        "token",
        data.token
      );

      setShowSuccess(true);

setTimeout(() => {

  router.replace("/");

}, 5000);
    } catch (error: any) {
  console.log("LOGIN ERROR:");
  console.log(error.response?.data);

  Alert.alert(
    "Login Failed",
    error?.response?.data?.error || "Something went wrong"
  );
}
  };
  if (showSuccess) {

  return (

    <LinearGradient
      colors={[
        "#020617",
        "#111827",
        "#1e1b4b",
      ]}
      style={styles.successContainer}
    >


      <Text
        style={styles.successTitle}
      >
        Welcome Back!
      </Text>

      <Text
        style={styles.successSub}
      >
        Accessing your legal workspace...
      </Text>
        <LottieView
  source={
    require(
      "../assets/animations/robot.json"
    )
  }
  autoPlay
  loop
  style={{
    width: 400,
    height: 400,
  }}
/>

    </LinearGradient>
  );
}
  return (
    <LinearGradient
      colors={["#020617", "#111827", "#1e1b4b"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        {/* LOGO */}

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons
              name="shield-checkmark"
              size={40}
              color="white"
            />
          </View>

          <Text style={styles.title}>ADVOCAI</Text>

          <Text style={styles.subtitle}>
            AI-powered legal assistant
          </Text>
        </View>

        {/* FORM */}

        <View style={styles.form}>
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

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed"
              size={20}
              color="#94a3b8"
            />

            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* LOGIN BUTTON */}

          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient
              colors={["#7c3aed", "#9333ea"]}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>
                Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* REGISTER */}

          <TouchableOpacity
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerText}>
              Don’t have an account? Register
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
    marginBottom: 60,
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
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 10,
    fontSize: 15,
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

  loginButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  registerText: {
    color: "#c4b5fd",
    textAlign: "center",
    marginTop: 24,
    fontSize: 15,
  },
  successContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},

successTitle: {
  color: "#FFFFFF",
  fontSize: 32,
  fontWeight: "800",
  marginTop: 20,
},

successSub: {
  color: "#CBD5E1",
  marginTop: 12,
  fontSize: 16,
},
});