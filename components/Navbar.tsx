import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { useEffect, useState } from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { navbarStyles } from "../styles/components/navbarstyles";

export default function Navbar() {

  const router = useRouter();

  const [username, setUsername] = useState("");

  useEffect(() => {

    const loadUser = async () => {

      const user =
        await AsyncStorage.getItem(
          "username"
        );

      if (user) {
        setUsername(user);
      }
    };

    loadUser();

  }, []);

  return (

    <View style={navbarStyles.navbar}>

      <Text style={navbarStyles.logo}>
        ADVOC
        <Text style={navbarStyles.logoAccent}>
          -AI
        </Text>
      </Text>

      <View style={navbarStyles.menu}>

        <TouchableOpacity
          onPress={() =>
            router.push("/dashboard")
          }
        >
          <Text style={navbarStyles.link}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/summarizer")
          }
        >
          <Text style={navbarStyles.link}>
            Summarizer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/argument")
          }
        >
          <Text style={navbarStyles.link}>
            Generator
          </Text>
        </TouchableOpacity>

      </View>

      <View style={navbarStyles.auth}>

        {username ? (

          <View style={navbarStyles.userBox}>

            <Text style={navbarStyles.userText}>
              Hi, {username} 👋
            </Text>

          </View>

        ) : (

          <>

            <TouchableOpacity
              onPress={() =>
                router.push("/register")
              }
              style={[
                navbarStyles.button,
                navbarStyles.outline
              ]}
            >
              <Text style={navbarStyles.outlineText}>
                Register
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push("/login")
              }
              style={[
                navbarStyles.button,
                navbarStyles.filled
              ]}
            >
              <Text style={navbarStyles.filledText}>
                Login
              </Text>
            </TouchableOpacity>

          </>

        )}

      </View>

    </View>
  );
}