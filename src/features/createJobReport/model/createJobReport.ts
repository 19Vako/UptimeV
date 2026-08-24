import { CreateJobReportInput } from '@/entities/jobReport';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobReport } from '@/shared/db';

export const createJobReport = async ({
  jobId,
  description,
  arrivalAt,
  startedAt,
  finishedAt,
  customerSignatureUri,
  documentScanUri,
}: CreateJobReportInput) => {
  let createdReport: JobReport;

  await database.write(async () => {
    const reportsCollection = database.get<JobReport>(TableNames.JOBREPORTS);

    createdReport = await reportsCollection.create((report) => {
      report.job_id = jobId;
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

  return createdReport!;
};
