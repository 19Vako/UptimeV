import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { EditPostFormFields, EditPostFormValues } from '../types';

const FormInput = ({
  title,
  name,
  control,
  placeholder,
  multiline,
  numeric,
}: {
  title: string;
  name: EditPostFormFields;
  control: Control<EditPostFormValues>;
  placeholder?: string;
  multiline?: boolean;
  numeric?: boolean;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{title}</Text>
          <TextInput
            style={[
              styles.input,
              multiline ? styles.textArea : undefined,
              error ? styles.inputError : undefined,
            ]}
            value={value == null ? '' : String(value)}
            onChangeText={(text) => {
              if (numeric) {
                onChange(text === '' ? 0 : Number(text));
                return;
              }

              onChange(text);
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            multiline={multiline}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  inputContainer: { marginBottom: 12 },
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
  button: { marginTop: 8 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#111' },
  modalMessage: { fontSize: 14, color: '#444', marginBottom: 16 },
  modalButton: { alignSelf: 'flex-end' },
});

export default FormInput;
