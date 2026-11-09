export const REQUEST_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[keyof typeof REQUEST_STATUSES];

export type RequestTimeOfDay = 'morning' | 'afternoon' | 'anytime';

export interface RequestType {
  id: string;
  customerId?: string;
  title: string;
  serviceDetails: string;
  preferredVisitDate: Date;
  backupVisitDate?: Date;
  preferredTimeOfDay: RequestTimeOfDay;
  assessmentDetails?: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
