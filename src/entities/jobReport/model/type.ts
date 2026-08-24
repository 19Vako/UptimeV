import { JobReport } from '@/shared/db';

export type JobReportCardProps = {
  jobReport: JobReport;
};

export type CreateJobReportInput = {
  jobId: string;
  description: string;
  arrivalAt: Date;
  startedAt: Date;
  finishedAt: Date;
  customerSignatureUri?: string;
  documentScanUri?: string;
};

export type UpdateJobReportInput = Partial<Omit<CreateJobReportInput, 'jobId'>>;
