import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { useCallback, useEffect, useState } from 'react';

export const useJobTimer = (jobId: string) => {
  const [job, setJob] = useState<JobPost | null>(null);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    database
      .get<JobPost>(TableNames.JOBPOSTS)
      .find(jobId)
      .then((record) => {
        if (!active) return;
        const subscription = record.observe().subscribe({
          next: (updatedRecord) => {
            setJob(updatedRecord);
            setLoading(false);
          },
          error: (observationError: unknown) => {
            setError(
              observationError instanceof Error
                ? observationError.message
                : 'Unable to observe job',
            );
            setLoading(false);
          },
        });
        unsubscribe = () => subscription.unsubscribe();
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load job');
          setLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [jobId]);

  useEffect(() => {
    if (!job?.startTime) return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [job?.startTime]);

  const updateTimer = useCallback(
    async (operation: (record: JobPost) => Promise<void> | void) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        await database.write(async () => {
          const record = await database.get<JobPost>(TableNames.JOBPOSTS).find(jobId);
          await operation(record);
        });
      } catch (writeError) {
        const message =
          writeError instanceof Error ? writeError.message : 'Unable to save timer changes';
        setError(message);
        throw writeError;
      } finally {
        setBusy(false);
      }
    },
    [busy, jobId],
  );

  const start = useCallback(async () => {
    await updateTimer(async (record) => {
      if (record.startTime) return;
      await record.update((updated) => {
        updated.startTime = Date.now();
        updated.endTime = undefined;
        updated.timeSpent = updated.timeSpent ?? 0;
      });
    });
  }, [updateTimer]);

  const pause = useCallback(async () => {
    await updateTimer(async (record) => {
      if (!record.startTime) return;
      const endTime = Date.now();
      const elapsedSeconds = Math.max(0, Math.floor((endTime - record.startTime) / 1000));
      await record.update((updated) => {
        updated.timeSpent = (updated.timeSpent ?? 0) + elapsedSeconds;
        updated.endTime = endTime;
        updated.startTime = undefined;
      });
    });
  }, [updateTimer]);

  const reset = useCallback(async () => {
    await updateTimer(async (record) => {
      await record.update((updated) => {
        updated.timeSpent = 0;
        updated.startTime = undefined;
        updated.endTime = Date.now();
      });
    });
  }, [updateTimer]);

  const elapsedSeconds =
    (job?.timeSpent ?? 0) +
    (job?.startTime ? Math.max(0, Math.floor((now - job.startTime) / 1000)) : 0);

  return {
    job,
    elapsedSeconds,
    isRunning: Boolean(job?.startTime),
    loading,
    busy,
    error,
    start,
    pause,
    reset,
  };
};
