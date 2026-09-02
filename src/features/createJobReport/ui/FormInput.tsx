import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FormInputProps } from '../types';

const FormInput = ({ title, name, control, multiline, placeholder }: FormInputProps) => (
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
            error && styles.inputError,
          ]}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          multiline={multiline}
          autoCapitalize="none"
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6, color: '#111' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: 'red' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
});

export default FormInput;
