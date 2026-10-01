import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TeamCardProps } from '../model/type';

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {team.teamName || 'Unnamed team'}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{team.status || 'Unknown'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Members:</Text>
        <Text style={styles.value}>{team.membersCount}</Text>
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
  name: {
    flex: 1,
    marginRight: 10,
    color: '#111',
    fontSize: 17,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E0F2EC',
  },
  statusText: {
    color: '#176A51',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 70,
    marginRight: 6,
    color: '#6B7280',
    fontSize: 13,
  },
  value: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
  },
});
