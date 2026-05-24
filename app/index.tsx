import { useEffect } from "react";

import {
    ActivityIndicator,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

export default function Index() {

  useEffect(() => {

    checkLogin();

  }, []);

  const checkLogin = async () => {

    try {

      const token =
        await AsyncStorage.getItem(
          "token"
        );

      if (token) {

        router.replace(
          "/(tabs)"
        );

      } else {

        router.replace(
          "/login"
        );
      }

    } catch (error) {

      console.log(error);

      router.replace(
        "/login"
      );
    }
  };

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: "#020617",

        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <ActivityIndicator
        size="large"
        color="#8B5CF6"
      />

    </View>
  );
}