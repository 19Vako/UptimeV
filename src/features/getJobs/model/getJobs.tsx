import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost, Team } from '@/shared/db';

export const getJobs = async (teamId: string): Promise<JobPost[]> => {
  const team = await database.get<Team>(TableNames.TEAMS).find(teamId);

  return await team.jobPosts.fetch();
};
