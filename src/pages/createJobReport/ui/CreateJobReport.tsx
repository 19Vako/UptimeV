import CreateJobReportWidget from '@/widgets/createJobReport';
import { StyleSheet, View } from 'react-native';

export const CreateJobReport = ({ id }: { id: string }) => {
  return (
    <View style={styles.container}>
      <CreateJobReportWidget id={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
});
