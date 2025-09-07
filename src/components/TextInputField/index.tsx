import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

interface TextInputFieldProps {
  query: string;
  onQueryChange: (text: string) => void;
  onSubmit: () => void;
  loading: boolean;
  placeholder?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  query,
  onQueryChange,
  onSubmit,
  loading,
  placeholder = "e.g., I need a lightweight laptop for travel"
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={onQueryChange}
          numberOfLines={2}
          editable={!loading}
          placeholderTextColor="grey"
          cursorColor="black"
        />
        <TouchableOpacity 
          style={[styles.inlineButton, loading && styles.disabledButton]} 
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.inlineButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    color: 'black',
    fontSize: 15,
    minHeight: 40,
    maxHeight: 80,
    textAlignVertical: 'top',
    paddingVertical: 8,
    paddingRight: 8,
  },
  inlineButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  inlineButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TextInputField;
