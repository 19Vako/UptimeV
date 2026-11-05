import { getSupabaseClient } from '@/shared/api/supabase';
import type { TeamRow } from '@/shared/api/supabase.types';
import { TableNames } from '@/shared/constants/table-names';
import { database } from '@/shared/db';
import Team from '@/shared/db/model/team';
import { Q } from '@nozbe/watermelondb';
import NetInfo from '@react-native-community/netinfo';
import { CreateTeamDTO } from '../types';

async function saveTeamLocally(row: TeamRow): Promise<Team> {
  const teamsCollection = database.get<Team>(TableNames.TEAMS);
  const [existing] = await teamsCollection.query(Q.where('id', row.id)).fetch();

  if (existing) {
    return database.write(() =>
      existing.update((team) => {
        team.teamName = row.team_name;
        team.membersCount = row.members_count;
        team.status = row.status;
        team.createdAt = new Date(row.created_at);
        team.updatedAt = new Date(row.updated_at);
      }),
    );
  }

  return database.write(() =>
    teamsCollection.create((team) => {
      team._raw.id = row.id;
      team.teamName = row.team_name;
      team.membersCount = row.members_count;
      team.status = row.status;
      team.createdAt = new Date(row.created_at);
      team.updatedAt = new Date(row.updated_at);
    }),
  );
}

export async function getTeamForUser(userId: string): Promise<Team | null> {
  const teamsCollection = database.get<Team>(TableNames.TEAMS);
  const [localTeam] = await teamsCollection.query(Q.where('id', userId)).fetch();
  const network = await NetInfo.fetch();
  const isOffline = network.isConnected === false || network.isInternetReachable === false;

  if (isOffline) {
    if (localTeam) return localTeam;
    throw new Error('Нет подключения к сети. Не удалось проверить команду пользователя.');
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from('teams')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return saveTeamLocally(data);
  } catch (error) {
    const currentNetwork = await NetInfo.fetch();
    const currentlyOffline =
      currentNetwork.isConnected === false || currentNetwork.isInternetReachable === false;
    if (localTeam && (currentlyOffline || error instanceof TypeError)) return localTeam;
    throw error;
  }
}

export const createTeam = async (
  userId: string,
  { teamName, membersCount }: CreateTeamDTO,
): Promise<Team> => {
  const trimmedName = teamName.trim();
  if (trimmedName.length < 2)
    throw new Error('Название команды должно содержать минимум 2 символа.');
  if (!Number.isInteger(membersCount) || membersCount < 1) {
    throw new Error('Количество участников должно быть целым числом больше нуля.');
  }

  const existing = await getTeamForUser(userId);
  if (existing) return existing;

  const timestamp = Date.now();
  const { data, error } = await getSupabaseClient()
    .from('teams')
    .insert({
      id: userId,
      team_name: trimmedName,
      members_count: membersCount,
      status: 'active',
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select('*')
    .single();

  if (error) throw error;
  return saveTeamLocally(data);
};
