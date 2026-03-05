import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import InputField from "../components/ui/InputField";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    router.replace("/(tabs)/dashboard");
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
