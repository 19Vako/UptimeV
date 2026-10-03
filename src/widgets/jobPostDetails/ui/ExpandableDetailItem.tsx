import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpandableDetailItemProps } from '../type';
const COLLAPSED_LINES = 2;

export function ExpandableDetailItem({ label, value }: ExpandableDetailItemProps) {
  const [isLong, setIsLong] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsLong(false);
    setIsModalVisible(false);
  }, [value]);

  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={styles.measurement}
        onTextLayout={({ nativeEvent }) => {
          if (nativeEvent.lines.length > COLLAPSED_LINES) {
            setIsLong(true);
          }
        }}
      >
        {value}
      </Text>
      <Text style={styles.value} numberOfLines={isLong ? COLLAPSED_LINES : undefined}>
        {value}
      </Text>
      {isLong && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Show full ${label.toLowerCase()}`}
          onPress={() => setIsModalVisible(true)}
          style={({ pressed }) => [styles.moreButton, pressed && styles.moreButtonPressed]}
        >
          <Text style={styles.moreButtonText}>More</Text>
        </Pressable>
      )}

      <Modal
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
        transparent
        visible={isModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalLabel}>{label}</Text>
              <Pressable
                accessibilityLabel="Close"
                accessibilityRole="button"
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalValue}>{value}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    minHeight: 86,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#E9F0ED',
    gap: 6,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: '#71807C',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: '#26332F',
  },
  measurement: {
    position: 'absolute',
    left: 16,
    right: 16,
    opacity: 0,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
  },
  moreButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingVertical: 2,
  },
  moreButtonPressed: {
    opacity: 0.6,
  },
  moreButtonText: {
    color: '#176A51',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(23, 33, 31, 0.55)',
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalLabel: {
    flex: 1,
    color: '#71807C',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginLeft: 12,
    borderRadius: 16,
    backgroundColor: '#E9F0ED',
  },
  closeButtonText: {
    color: '#26332F',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '400',
  },
  modalValue: {
    color: '#26332F',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
  },
});
