import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const PrimaryAction = ({ label, onPress }: { label: string; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default PrimaryAction;