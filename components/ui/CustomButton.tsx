import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function CustomButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});