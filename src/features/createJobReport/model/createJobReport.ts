import { CreateJobReportInput } from '@/entities/jobReport';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost, JobReport } from '@/shared/db';

export const createJobReport = async ({
  jobId,
  teamId,
  description,
  arrivalAt,
  startedAt,
  finishedAt,
  customerSignatureUri,
  documentScanUri,
}: CreateJobReportInput) => {
  await database.write(async () => {
    const job = await database.get<JobPost>(TableNames.JOBPOSTS).find(jobId);

    if (job.assignedTeamId !== teamId) {
      throw new Error('Job is not assigned to this team');
    }

    const reportsCollection = database.get<JobReport>(TableNames.JOBREPORTS);

    await reportsCollection.create((report) => {
      report.jobId = jobId;
      report.teamId = teamId;
      report.description = description;
      report.arrival_at = arrivalAt;
      report.started_at = startedAt;
      report.finished_at = finishedAt;

      if (customerSignatureUri) {
        report.customer_signature_uri = customerSignatureUri;
      }

      if (documentScanUri) {
        report.document_scan_uri = documentScanUri;
      }
    });
  });
};
