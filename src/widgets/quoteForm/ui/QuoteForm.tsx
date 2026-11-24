import {
  calculateQuoteTotals,
  formatMinorUnitAmount,
  parseMinorUnitAmount,
  quoteFormSchema,
  type QuoteFormValues,
} from '@/entities/quote';
import { createQuote } from '@/features/createQuote';
import { observeRequests } from '@/features/getRequests';
import type Request from '@/shared/db/model/request';
import { ActionButton, FormField } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  initialValues?: QuoteFormValues;
  initialRequestId?: string;
  submitLabel: string;
  deleteAction?: ReactNode;
};

const EMPTY_VALUES: QuoteFormValues = {
  title: '',
  requestId: '',
  discountPercent: '0',
  requiredDeposit: '0.00',
  lineItems: [{ name: '', description: '', unitPrice: '0.00', quantity: '1' }],
};

export function QuoteForm({ initialValues, initialRequestId, submitLabel, deleteAction }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requestPickerVisible, setRequestPickerVisible] = useState(false);
  const [requestDetailsExpanded, setRequestDetailsExpanded] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: initialValues ?? { ...EMPTY_VALUES, requestId: initialRequestId ?? '' },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
    keyName: 'fieldId',
  });
  const values = useWatch({ control });
  const requestId = values.requestId;
  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === requestId),
    [requestId, requests],
  );
  const discountPercent = values.discountPercent ?? '0';
  const requiredDeposit = values.requiredDeposit ?? '0';

  const onSubmit = async (formValues: QuoteFormValues) => {
    setSubmitError(null);
    try {
      await createQuote(formValues);
      router.back();
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save quote.');
    }
  };

  const totals = useMemo(() => {
    if (!values) return null;
    const previewValues: QuoteFormValues = {
      ...EMPTY_VALUES,
      ...values,
      title: values.title || 'Quote',
      discountPercent: Number(discountPercent) <= 100 ? discountPercent : '0',

      requiredDeposit: Number.isSafeInteger(parseMinorUnitAmount(requiredDeposit))
        ? requiredDeposit
        : '0',

      lineItems: (values.lineItems ?? []).map((item) => {
        const unitPrice = item.unitPrice ?? '';
        const quantity = item.quantity ?? '';

        return {
          ...item,
          name: item.name ?? '',
          description: item.description ?? '',
          unitPrice:
            /^\d+(?:\.\d{0,2})?$/.test(unitPrice) &&
            Number.isSafeInteger(parseMinorUnitAmount(unitPrice))
              ? unitPrice
              : '0',
          quantity:
            /^[1-9]\d*$/.test(quantity) && Number.isSafeInteger(Number(quantity)) ? quantity : '1',
        };
      }),
    };
    return calculateQuoteTotals(previewValues);
  }, [values, discountPercent, requiredDeposit]);

  useEffect(() => {
    const subscription = observeRequests().subscribe({
      next: (records) => {
        setRequests(records);
        setRequestsLoading(false);
        setRequestsError(null);
      },
      error: (error: unknown) => {
        setRequestsError(error instanceof Error ? error.message : 'Unable to load requests.');
        setRequestsLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: requestDetailsExpanded }}
          onPress={() => setRequestDetailsExpanded((expanded) => !expanded)}
          style={styles.requestHeader}
        >
          <Text style={styles.requestHeaderText}>Request details</Text>
          <Ionicons
            name={requestDetailsExpanded ? 'chevron-up' : 'chevron-forward'}
            size={22}
            color="#88B50A"
          />
        </Pressable>

        {requestDetailsExpanded ? (
          <View style={styles.requestDetails}>
            <Text style={styles.mutedLabel}>Service for</Text>
            <View style={styles.disabledClient}>
              <Ionicons name="person-outline" size={21} color="#818B94" />
              <Text style={styles.disabledClientText}>
                Client and property details will be available when client management is added.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setRequestPickerVisible(true)}
              style={({ pressed }) => [styles.requestSelect, pressed && styles.pressed]}
            >
              <View style={styles.requestSelectCopy}>
                <Text style={styles.requestSelectLabel}>
                  {selectedRequest ? 'Linked request' : 'Link a request (optional)'}
                </Text>
                <Text style={styles.requestSelectValue}>
                  {selectedRequest?.title ?? 'Select a request'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#88B50A" />
            </Pressable>
            {selectedRequest ? (
              <View style={styles.requestSummary}>
                <Text style={styles.summaryTitle}>Service details</Text>
                <Text style={styles.summaryText}>{selectedRequest.serviceDetails}</Text>
                <Text style={styles.summaryTitle}>Availability</Text>
                <Text style={styles.summaryText}>
                  Preferred: {selectedRequest.preferredVisitDate.toLocaleDateString()} ·{' '}
                  {selectedRequest.preferredTimeOfDay}
                </Text>
                {selectedRequest.backupVisitDate ? (
                  <Text style={styles.summaryText}>
                    Alternate: {selectedRequest.backupVisitDate.toLocaleDateString()}
                  </Text>
                ) : null}
                {selectedRequest.assessmentDetails ? (
                  <>
                    <Text style={styles.summaryTitle}>Assessment details</Text>
                    <Text style={styles.summaryText}>{selectedRequest.assessmentDetails}</Text>
                  </>
                ) : null}
              </View>
            ) : null}
            {requestsError ? <Text style={styles.error}>{requestsError}</Text> : null}
          </View>
        ) : null}

        <Text style={styles.section}>Overview</Text>
        <View style={styles.card}>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormField
                label="Job title"
                placeholder="Job title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                returnKeyType="next"
              />
            )}
          />
        </View>

        <Text style={styles.section}>Work</Text>
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsTitle}>Line items</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add line item"
            onPress={() => append({ name: '', description: '', unitPrice: '0.00', quantity: '1' })}
            style={styles.addButton}
          >
            <Ionicons name="add" size={29} color="#88B50A" />
          </Pressable>
        </View>
        {fields.map((field, index) => (
          <View key={field.fieldId} style={styles.lineItem}>
            <View style={styles.lineItemHeading}>
              <Text style={styles.lineItemTitle}>Item {index + 1}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove line item ${index + 1}`}
                onPress={() => remove(index)}
                hitSlop={8}
              >
                <Ionicons name="close-circle-outline" size={23} color="#818B94" />
              </Pressable>
            </View>
            <Controller
              control={control}
              name={`lineItems.${index}.name` as const}
              render={({ field: { value, onChange, onBlur } }) => (
                <FormField
                  label="Name"
                  placeholder="Service or material"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lineItems?.[index]?.name?.message}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name={`lineItems.${index}.description` as const}
              render={({ field: { value, onChange, onBlur } }) => (
                <FormField
                  label="Description"
                  placeholder="Optional details"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lineItems?.[index]?.description?.message}
                  multiline
                />
              )}
            />
            <View style={styles.itemNumbers}>
              <View style={styles.itemNumberField}>
                <Controller
                  control={control}
                  name={`lineItems.${index}.quantity` as const}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormField
                      label="Quantity"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      error={errors.lineItems?.[index]?.quantity?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.itemNumberField}>
                <Controller
                  control={control}
                  name={`lineItems.${index}.unitPrice` as const}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormField
                      label="Unit price"
                      placeholder="0.00"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                      error={errors.lineItems?.[index]?.unitPrice?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        ))}
        {errors.lineItems?.message ? (
          <Text style={styles.error}>{errors.lineItems.message}</Text>
        ) : null}

        <View style={styles.totals}>
          <SummaryRow label="Subtotal" amount={totals?.subtotal} />
          <View style={styles.discountRow}>
            <View style={styles.discountInput}>
              <Controller
                control={control}
                name="discountPercent"
                render={({ field: { value, onChange, onBlur } }) => (
                  <FormField
                    label="Discount (%)"
                    placeholder="0"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="decimal-pad"
                    error={errors.discountPercent?.message}
                  />
                )}
              />
            </View>
            <Text style={styles.greenAmount}>
              {totals ? `-${formatCurrency(totals.discount)}` : '—'}
            </Text>
          </View>
          <SummaryRow label="Tax (GST - 5%)" amount={totals?.tax} accent />
          <SummaryRow label="Total" amount={totals?.total} strong />
          <View style={styles.depositRow}>
            <View style={styles.depositInput}>
              <Controller
                control={control}
                name="requiredDeposit"
                render={({ field: { value, onChange, onBlur } }) => (
                  <FormField
                    label="Required deposit"
                    placeholder="0.00"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="decimal-pad"
                    error={errors.requiredDeposit?.message}
                  />
                )}
              />
            </View>
            <Text style={styles.greenAmount}>
              {totals ? formatCurrency(totals.requiredDeposit) : '—'}
            </Text>
          </View>
        </View>

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
        <View style={styles.actions}>
          <ActionButton
            title={isSubmitting ? 'Saving...' : submitLabel}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
          {deleteAction}
        </View>
      </ScrollView>

      <Modal
        visible={requestPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRequestPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select request</Text>
              <Pressable accessibilityRole="button" onPress={() => setRequestPickerVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </Pressable>
            </View>
            {requestsLoading ? (
              <ActivityIndicator style={styles.modalLoading} color="#16805D" />
            ) : requestsError ? (
              <Text style={styles.error}>{requestsError}</Text>
            ) : (
              <FlatList
                data={requests}
                keyExtractor={(request) => request.id}
                ListEmptyComponent={
                  <Text style={styles.emptyRequests}>No requests are available.</Text>
                }
                renderItem={({ item: request }) => (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setValue('requestId', request.id);
                      setRequestPickerVisible(false);
                    }}
                    style={styles.requestOption}
                  >
                    <Text style={styles.optionTitle}>{request.title}</Text>
                    <Text style={styles.optionDetails} numberOfLines={2}>
                      {request.serviceDetails}
                    </Text>
                  </Pressable>
                )}
              />
            )}
            {requestId ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setValue('requestId', '');
                  setRequestPickerVisible(false);
                }}
                style={styles.clearRequest}
              >
                <Text style={styles.clearRequestText}>Remove linked request</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function SummaryRow({
  label,
  amount,
  accent = false,
  strong = false,
}: {
  label: string;
  amount?: number;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, strong && styles.totalRow]}>
      <Text style={[styles.summaryLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.amount, accent && styles.greenAmount, strong && styles.strong]}>
        {amount === undefined ? '—' : formatCurrency(amount)}
      </Text>
    </View>
  );
}

function formatCurrency(value: number) {
  return `$${formatMinorUnitAmount(value)}`;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 28 },
  requestHeader: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7E9',
  },
  requestHeaderText: { color: '#17211F', fontSize: 17, fontWeight: '700' },
  requestDetails: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 16 },
  mutedLabel: { color: '#818B94', fontSize: 14, paddingVertical: 12 },
  disabledClient: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECED',
  },
  disabledClientText: { flex: 1, color: '#818B94', fontSize: 14, lineHeight: 20 },
  requestSelect: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECED',
  },
  requestSelectCopy: { flex: 1, gap: 4 },
  requestSelectLabel: { color: '#818B94', fontSize: 13 },
  requestSelectValue: { color: '#17211F', fontSize: 16, fontWeight: '600' },
  requestSummary: { paddingTop: 16, gap: 7 },
  summaryTitle: { color: '#34433D', fontSize: 15, fontWeight: '700', marginTop: 6 },
  summaryText: { color: '#667085', fontSize: 14, lineHeight: 20 },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F3F4F5',
    color: '#737E87',
    fontSize: 15,
    fontWeight: '700',
  },
  card: { padding: 20, backgroundColor: '#FFFFFF' },
  itemsHeader: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  itemsTitle: { color: '#17211F', fontSize: 17, fontWeight: '700' },
  addButton: { width: 42, height: 48, alignItems: 'center', justifyContent: 'center' },
  lineItem: { marginTop: 8, padding: 20, backgroundColor: '#FFFFFF', gap: 14 },
  lineItemHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineItemTitle: { color: '#34433D', fontSize: 16, fontWeight: '700' },
  itemNumbers: { flexDirection: 'row', gap: 12 },
  itemNumberField: { flex: 1 },
  totals: { marginTop: 10, backgroundColor: '#FFFFFF' },
  summaryRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7E9',
  },
  summaryLabel: { color: '#667085', fontSize: 16 },
  amount: { color: '#17211F', fontSize: 16, fontWeight: '600' },
  greenAmount: { color: '#88B50A', fontSize: 16, fontWeight: '700' },
  discountRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7E9',
  },
  discountInput: { flex: 1 },
  totalRow: { minHeight: 68, backgroundColor: '#F3F4F5' },
  strong: { color: '#17211F', fontWeight: '700' },
  depositRow: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  depositInput: { flex: 1 },
  error: { paddingHorizontal: 20, paddingTop: 8, color: '#B42318', fontSize: 13 },
  actions: { paddingHorizontal: 20, paddingTop: 18, gap: 8 },
  pressed: { opacity: 0.65 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
  modal: {
    maxHeight: '75%',
    minHeight: '35%',
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16 },
  modalTitle: { color: '#17211F', fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#16805D', fontWeight: '700' },
  modalLoading: { marginTop: 28 },
  emptyRequests: { color: '#77818A', fontSize: 14, paddingVertical: 18 },
  requestOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EAECED' },
  optionTitle: { color: '#17211F', fontSize: 16, fontWeight: '600' },
  optionDetails: { color: '#77818A', fontSize: 13, lineHeight: 18, marginTop: 4 },
  clearRequest: { alignItems: 'center', paddingVertical: 14 },
  clearRequestText: { color: '#B42318', fontWeight: '700' },
});
