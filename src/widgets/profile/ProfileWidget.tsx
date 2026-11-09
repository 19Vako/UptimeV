import type { User } from '@supabase/supabase-js';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type Team from '@/shared/db/model/team';

export function ProfileWidget({ user, team }: { user: User; team: Team | null }) {
  const metadataName = user.user_metadata.full_name ?? user.user_metadata.name;
  const displayName = typeof metadataName === 'string' ? metadataName : 'Not specified';
  const role = user.app_metadata.role;

  return (
    <View style={styles.card}>
      <InfoRow label="Name" value={displayName} />
      <InfoRow label="Email" value={user.email ?? 'Not provided'} />
      <InfoRow label="Role" value={typeof role === 'string' ? role : 'Not specified in profile'} />
      <InfoRow label="Team" value={team?.teamName ?? 'Not assigned'} />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 18, backgroundColor: '#FFFFFF', gap: 18 },
  row: { gap: 4 },
  label: { color: '#66736D', fontSize: 13 },
  value: { color: '#17211F', fontSize: 16, fontWeight: '600' },
});
