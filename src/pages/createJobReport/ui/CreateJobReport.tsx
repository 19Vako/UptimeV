import CreateJobReportWidget from '@/widgets/createJobReport';
import { StyleSheet, View } from 'react-native';

export const CreateJobReport = ({ id, teamId }: { id: string; teamId: string }) => {
  return (
    <View style={styles.container}>
      <CreateJobReportWidget id={id} teamId={teamId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
});
