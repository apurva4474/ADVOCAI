import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { navbarStyles } from "../styles/components/navbarstyles";

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={navbarStyles.navbar}>

      <Text style={navbarStyles.logo}>
        ADVOC<Text style={navbarStyles.logoAccent}>-AI</Text>
      </Text>

      <View style={navbarStyles.menu}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <Text style={navbarStyles.link}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/summarizer")}>
          <Text style={navbarStyles.link}>Summarizer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/argument")}>
          <Text style={navbarStyles.link}>Generator</Text>
        </TouchableOpacity>
      </View>

      <View style={navbarStyles.auth}>
        <TouchableOpacity
          style={[navbarStyles.button, navbarStyles.outline]}
        >
          <Text style={navbarStyles.outlineText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[navbarStyles.button, navbarStyles.filled]}
        >
          <Text style={navbarStyles.filledText}>Login</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}