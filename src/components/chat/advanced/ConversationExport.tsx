import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConversationExportProps {
  onExport?: (format: 'txt' | 'pdf' | 'json') => void;
  disabled?: boolean;
}

export const ConversationExport: React.FC<ConversationExportProps> = ({
  onExport,
  disabled = false,
}) => {
  const handleExport = (format: 'txt' | 'pdf' | 'json') => {
    if (onExport && !disabled) {
      onExport(format);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export Conversation</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={() => handleExport('txt')}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={() => handleExport('pdf')}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={() => handleExport('json')}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>JSON</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    backgroundColor: '#4ADE80',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
