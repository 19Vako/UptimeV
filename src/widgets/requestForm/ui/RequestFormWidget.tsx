import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ActionButton, FormField } from '@/shared/ui';
import {
  createRequest,
  requestFormSchema,
  type RequestFormValues,
  dateToDateString,
} from '@/features/createRequest';
import { updateRequest } from '@/features/updateRequest';
import type Request from '@/shared/db/model/request';
import { RequestClientPicker } from './RequestClientPicker';

type Props = { request?: Request };

function todayDateString() {
  return dateToDateString(new Date());
}

export function RequestFormWidget({ request }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      customerId: request?.customerId ?? '',
      title: request?.title ?? '',
      serviceDetails: request?.serviceDetails ?? '',
      preferredVisitDate: dateToDateString(request?.preferredVisitDate) || todayDateString(),
      backupVisitDate: dateToDateString(request?.backupVisitDate),
      preferredTimeOfDay: request?.preferredTimeOfDay ?? 'anytime',
      assessmentDetails: request?.assessmentDetails ?? '',
    },
  });
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const onSubmit = async (values: RequestFormValues) => {
    setSubmitError(null);
    try {
      if (request) {
        await updateRequest(request.id, values);
        router.replace({ pathname: '/(job)/request-detail', params: { id: request.id } });
        return;
      }
      const created = await createRequest(values);
      router.replace({ pathname: '/(job)/request-detail', params: { id: created.id } });
    } catch (saveError: unknown) {
      setSubmitError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save request. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Controller
          control={control}
          name="customerId"
          render={({ field: { value, onChange } }) => (
            <RequestClientPicker value={value || undefined} onChange={(id) => onChange(id ?? '')} />
          )}
        />
        <View style={styles.titleField}>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormField
                label="Request title"
                placeholder="Request title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                returnKeyType="next"
              />
            )}
          />
        </View>

        <Text style={styles.section}>Request form</Text>
        <View style={styles.card}>
          <Text style={styles.fieldTitle}>Service Details</Text>
          <Text style={styles.help}>Please provide as much information as you can.</Text>
          <Controller
            control={control}
            name="serviceDetails"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormField
                label="Service details"
                placeholder="Describe the requested service"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.serviceDetails?.message}
                multiline
                textAlignVertical="top"
                style={styles.multiline}
              />
            )}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.fieldTitle}>Your Availability</Text>
          <Text style={styles.help}>Which day would be best for an assessment of the work?</Text>
          <Controller
            control={control}
            name="preferredVisitDate"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormField
                label="Preferred visit date"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.preferredVisitDate?.message}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
              />
            )}
          />
          <Controller
            control={control}
            name="backupVisitDate"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormField
                label="What is another day that works for you? (optional)"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.backupVisitDate?.message}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
              />
            )}
          />
          <Text style={styles.help}>What are your preferred arrival times?</Text>
          <Controller
            control={control}
            name="preferredTimeOfDay"
            render={({ field: { value, onChange } }) => (
              <View style={styles.timeOptions}>
                {(
                  [
                    ['anytime', 'Any time'],
                    ['morning', 'Morning'],
                    ['afternoon', 'Afternoon'],
                  ] as const
                ).map(([time, label]) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: value === time }}
                    key={time}
                    onPress={() => onChange(time)}
                    style={styles.timeOption}
                  >
                    <Text style={styles.timeLabel}>{label}</Text>
                    <View style={[styles.radio, value === time && styles.radioSelected]}>
                      {value === time ? <View style={styles.radioDot} /> : null}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>

        <Text style={styles.section}>Assessment details</Text>
        <View style={styles.card}>
          <Controller
            control={control}
            name="assessmentDetails"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormField
                label="Instructions (optional)"
                placeholder="Add assessment instructions"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.assessmentDetails?.message}
                multiline
                textAlignVertical="top"
                style={styles.multiline}
              />
            )}
          />
        </View>

        <View style={styles.saveButton}>
          {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
          <ActionButton
            title={request ? 'Save Changes' : 'Save Request'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
          {isSubmitting ? <ActivityIndicator style={styles.loading} color="#16805D" /> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 28, gap: 12 },
  titleField: { padding: 20, backgroundColor: '#FFFFFF' },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F3F4F5',
    color: '#737E87',
    fontSize: 15,
    fontWeight: '700',
  },
  card: { padding: 20, gap: 14, backgroundColor: '#FFFFFF' },
  fieldTitle: { color: '#17211F', fontSize: 18, fontWeight: '700' },
  help: { color: '#818B94', fontSize: 14, lineHeight: 20 },
  multiline: { minHeight: 96, paddingTop: 12 },
  timeOptions: { marginTop: -8 },
  timeOption: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECED',
  },
  timeLabel: { color: '#6E7880', fontSize: 16 },
  radio: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#9ABF35',
    borderRadius: 12,
  },
  radioSelected: { borderColor: '#88B50A' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#88B50A' },
  saveButton: { paddingHorizontal: 20, paddingTop: 12 },
  loading: { marginTop: 8 },
  error: { color: '#B42318', fontSize: 14, marginBottom: 10 },
});
