import { JobReport } from '@/shared/db';

export interface PastJobReportsItemProps {
  item: JobReport;
}

export interface PastJobReportsProps {
  teamId: string;
}
