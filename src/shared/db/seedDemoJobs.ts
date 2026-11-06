import { PostStatus, type TaskType } from '@/entities/jobPost';
import { FALLBACK_TEAM_ID } from '@/shared/constants/mock';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost, JobReport } from '@/shared/db';
import { generateDemoCoordinates, type Coordinates } from '@/shared/location/demoCoordinates';
import { Q } from '@nozbe/watermelondb';

const DEMO_CUSTOMER_ID = 'uptimev-demo-data-v1';
const DEMO_PHONE_PREFIX = '+1 202 555 01';

type DemoJob = {
  title: string;
  description: string;
  customer: string;
  location: string;
  taskType: TaskType;
  status: string;
  assigned: boolean;
  startHour?: number;
  startMinute?: number;
  durationMinutes?: number;
  timeSpent?: number;
};

const DEMO_JOBS: DemoJob[] = [
  {
    title: 'Mulch delivery and garden visit',
    description: 'Mulch will be behind the garage.',
    customer: 'Nicole Becker',
    location: 'Demo address 1',
    taskType: 'job_visit',
    status: PostStatus.SCHEDULED,
    assigned: true,
    startHour: 9,
    durationMinutes: 90,
  },
  {
    title: 'Inspect kitchen faucet',
    description: 'Check the leak under the sink and report required parts.',
    customer: 'Megan Westwood',
    location: 'Demo address 2',
    taskType: 'assessment',
    status: PostStatus.INPROGRESS,
    assigned: true,
    startHour: 11,
    durationMinutes: 60,
    timeSpent: 1320,
  },
  {
    title: 'Pick up supplies',
    description: 'Collect fittings from the warehouse.',
    customer: 'Internal team',
    location: 'Demo address 3',
    taskType: 'task',
    status: PostStatus.SCHEDULED,
    assigned: true,
    startHour: 13,
    durationMinutes: 45,
  },
  {
    title: 'Team safety meeting',
    description: 'Weekly field team check-in.',
    customer: 'UptimeV Demo Team',
    location: 'Demo address 4',
    taskType: 'event',
    status: PostStatus.SCHEDULED,
    assigned: true,
    startHour: 15,
    durationMinutes: 60,
  },
  {
    title: 'Replace exterior light',
    description: 'Completed demo job with a sample report.',
    customer: 'Joe Flores',
    location: 'Demo address 5',
    taskType: 'job_visit',
    status: PostStatus.COMPLETED,
    assigned: true,
    startHour: 8,
    durationMinutes: 60,
    timeSpent: 3600,
  },
  {
    title: 'Review service request',
    description: 'Open demo request available to accept.',
    customer: 'Jake Murphy',
    location: 'Demo address 6',
    taskType: 'assessment',
    status: PostStatus.OPEN,
    assigned: false,
    startHour: 16,
    durationMinutes: 30,
  },
  {
    title: 'Prepare event equipment',
    description: 'Open internal task for the preview list.',
    customer: 'UptimeV Demo Team',
    location: 'Demo address 7',
    taskType: 'task',
    status: PostStatus.OPEN,
    assigned: false,
    startHour: 17,
    durationMinutes: 45,
  },
];

const scheduledTimestamp = (hour?: number, minute = 0) => {
  if (hour === undefined) return undefined;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.getTime();
};

export async function seedDemoJobs(userCoordinates: Coordinates): Promise<number> {
  const postsCollection = database.get<JobPost>(TableNames.JOBPOSTS);
  const existingDemoPosts = await postsCollection
    .query(Q.where('customer_id', DEMO_CUSTOMER_ID))
    .fetch();

  if (existingDemoPosts.length > 0) {
    return 0;
  }

  await database.write(async () => {
    for (const [index, demoJob] of DEMO_JOBS.entries()) {
      const coordinates = generateDemoCoordinates(userCoordinates);
      const start = scheduledTimestamp(demoJob.startHour);
      const scheduledStartTime =
        start === undefined ? undefined : start + (demoJob.startMinute ?? 0) * 60 * 1000;

      const createdPost = await postsCollection.create((post) => {
        post.title = demoJob.title;
        post.description = demoJob.description;
        post.status = demoJob.status;
        post.taskType = demoJob.taskType;
        post.timeSpent = demoJob.timeSpent ?? 0;
        post.customerId = DEMO_CUSTOMER_ID;
        post.customer = demoJob.customer;
        post.customerPhone = `${DEMO_PHONE_PREFIX}${String(index + 1).padStart(2, '0')}`;
        post.location = demoJob.location;
        post.assignedTeamId = demoJob.assigned ? FALLBACK_TEAM_ID : undefined;
        post.scheduledStartTime = scheduledStartTime;
        post.scheduledEndTime =
          scheduledStartTime === undefined || demoJob.durationMinutes === undefined
            ? undefined
            : scheduledStartTime + demoJob.durationMinutes * 60 * 1000;
        post.latitude = coordinates.latitude;
        post.longitude = coordinates.longitude;
      });

      if (demoJob.status === PostStatus.COMPLETED) {
        const reportsCollection = database.get<JobReport>(TableNames.JOBREPORTS);
        const finishedAt = new Date(start ?? Date.now());
        const startedAt = new Date(finishedAt.getTime() + 10 * 60 * 1000);
        const reportFinishedAt = new Date(
          startedAt.getTime() + (demoJob.durationMinutes ?? 60) * 60 * 1000,
        );

        await reportsCollection.create((report) => {
          report.jobId = createdPost.id;
          report.teamId = FALLBACK_TEAM_ID;
          report.description = 'Demo completion report: exterior light replaced and tested.';
          report.arrival_at = finishedAt;
          report.started_at = startedAt;
          report.finished_at = reportFinishedAt;
        });
      }
    }
  });

  return DEMO_JOBS.length;
}
