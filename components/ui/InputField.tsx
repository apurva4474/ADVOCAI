import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputField({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});