import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactScreen: React.FC = () => {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (key: keyof ContactData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    try {
      const response = await fetch("http://YOUR_IP:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert("Success", "Message sent!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        Alert.alert("Error", "Failed to send message");
      }
    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      <TextInput
        style={styles.input}
        placeholder="Name *"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Message *"
        multiline
        value={formData.message}
        onChangeText={(text) => handleChange("message", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  textArea: {
    borderWidth: 1,
    padding: 12,
    height: 120,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
