import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { CreatePostFormFields } from '../types';

const FormInput = React.memo(
  ({
    title,
    field,
    value,
    handleChange,
    multiline,
    placeholder,
  }: {
    title: string;
    field: CreatePostFormFields;
    value: string;
    handleChange: (field: CreatePostFormFields, text: string) => void;
    multiline?: boolean;
    placeholder?: string;
  }) => {
    return (
      <>
        <Text style={styles.label}>{title}</Text>
        <TextInput
          style={[styles.input, multiline ? styles.textArea : undefined]}
          value={value}
          onChangeText={(text) => handleChange(field, text)}
          placeholder={placeholder}
          multiline={multiline}
        />
      </>
    );
  },
);
FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default FormInput;
