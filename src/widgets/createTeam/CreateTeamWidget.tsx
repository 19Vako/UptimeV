import { CreateTeamForm } from '@/features/createTeam';

type Props = {
  userId: string;
  onSuccess: () => void;
};

export function CreateTeamWidget({ userId, onSuccess }: Props) {
  return <CreateTeamForm userId={userId} onSuccess={onSuccess} />;
}
