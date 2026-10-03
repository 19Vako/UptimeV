import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CreatePostFormFields, CreatePostFormValues } from '../types';

interface FormInputProps {
  title: string;
  name: CreatePostFormFields;
  control: Control<CreatePostFormValues>;
  multiline?: boolean;
  placeholder?: string;
}

const FormInput = ({ title, name, control, multiline, placeholder }: FormInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{title}</Text>
          <TextInput
            style={[
              styles.input,
              multiline ? styles.textArea : undefined,
              error ? styles.inputError : undefined,
            ]}
            value={value ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#9AA8A3"
            multiline={multiline}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 7,
    color: '#71807C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2EAE7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
    color: '#17211F',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#C94E3A',
  },
  textArea: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#C94E3A',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormInput;
