import { TableNames } from '@/shared/constants/table-names';
import { database, JobReport, Team } from '@/shared/db';

export const getTeamJobReports = async (teamId: string): Promise<JobReport[]> => {
  const team = await database.get<Team>(TableNames.TEAMS).find(teamId);

  return await team.jobReports.fetch();
};
