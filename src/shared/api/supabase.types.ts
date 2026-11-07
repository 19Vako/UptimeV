export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type TeamRow = {
  id: string;
  team_name: string;
  members_count: number;
  status: string;
  created_at: number;
  updated_at: number;
};

export type Database = {
  public: {
    Tables: {
      teams: {
        Row: TeamRow;
        Insert: Omit<TeamRow, 'id'> & { id?: string };
        Update: Partial<Omit<TeamRow, 'id'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
