import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import InputField from "../components/ui/InputField";
import { API } from "../constants/api";
import { saveToken } from "../utils/auth";

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
    <View style={styles.container}>
      <Text style={styles.title}>AdvoCai</Text>

      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <InputField
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
});