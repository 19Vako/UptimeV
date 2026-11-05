import { TableNames } from '@/shared/constants/table-names';
import { database } from '@/shared/db';
import Team from '@/shared/db/model/team';
import { Q } from '@nozbe/watermelondb';
import { CreateTeamDTO } from '../types';

export const createTeam = async ({ teamName, membersCount }: CreateTeamDTO): Promise<Team> => {
  const trimmedName = teamName.trim();
  const teamsCollection = database.get<Team>(TableNames.TEAMS);

  const existingTeams = await teamsCollection
    .query(Q.where('team_name', Q.like(Q.sanitizeLikeString(trimmedName))))
    .fetch();

  if (existingTeams.length > 0) {
    throw new Error('Team with this name already exist!');
  }

  return await database.write(async () => {
    return await teamsCollection.create((team) => {
      team.teamName = trimmedName;
      team.membersCount = membersCount;
      team.status = 'active';
    });
  });
};
