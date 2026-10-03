import CreateJobReport from '@/pages/createJobReport';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function CreateReport() {
  const { id, teamId } = useLocalSearchParams<{ id?: string; teamId?: string }>();

  if (!id?.trim() || !teamId?.trim()) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Job or team ID not found</Text>
      </View>
    );
  }

  return <CreateJobReport id={id.trim()} teamId={teamId.trim()} />;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#b42318',
    fontSize: 16,
  },
});
