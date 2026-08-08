import JobPost from '@/shared/db/model/jobPost';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JobPostCardProps } from '../model/type';

const mockJobPost = {
  title: 'Проверка: монтаж двери',
  description: 'Проверяем внешний вид карточки и отображение данных на примере мокового поста.',
  status: 'В работе',
  customerId: 'customer-123',
  customer: 'ООО «Успех»',
  location: 'Москва, ул. Пушкина, д. 10',
  createdAt: new Date(),
  updatedAt: new Date(),
} as JobPost;

export default function JobPostCard({ jobPost = mockJobPost }: JobPostCardProps) {
  const formattedDate = jobPost.createdAt ? jobPost.createdAt.toLocaleDateString() : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {jobPost.title || 'Без названия'}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{jobPost.status || 'Новый'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Клиент:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {jobPost.customer || 'Не указано'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Адрес:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {jobPost.location || 'Не указано'}
        </Text>
      </View>

      {jobPost.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {jobPost.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Создано: {formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F2F4FF',
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 6,
    width: 70,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginTop: 10,
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
