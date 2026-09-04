import CreateJobReport from '@/pages/createJobReport';
import { useLocalSearchParams } from 'expo-router';

export default function CreateReport() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!id) {
    return null;
  }

  return <CreateJobReport id={id} />;
}
