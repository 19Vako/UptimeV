import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { AppState } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

export const useJobTimer = (jobId: string) => {
  const [job, setJob] = useState<JobPost | null>(null);
  const [now, setNow] = useState(Date.now());
  const [appIsActive, setAppIsActive] = useState(AppState.currentState === 'active');
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
            setNow(Date.now());
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
    const subscription = AppState.addEventListener('change', (state) => {
      const isActive = state === 'active';
      setAppIsActive(isActive);
      if (isActive) {
        setNow(Date.now());
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (job?.startTime == null || !appIsActive) return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [appIsActive, job?.startTime]);

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
      if (record.startTime != null) return;
      const startedAt = Date.now();
      await record.update((updated) => {
        updated.startTime = startedAt;
        updated.endTime = undefined;
        updated.timeSpent = updated.timeSpent ?? 0;
      });
    });
  }, [updateTimer]);

  const pause = useCallback(async () => {
    await updateTimer(async (record) => {
      if (record.startTime == null) return;
      const pausedAt = Date.now();
      const elapsedSeconds = Math.max(0, pausedAt - record.startTime) / 1000;
      await record.update((updated) => {
        updated.timeSpent = (updated.timeSpent ?? 0) + elapsedSeconds;
        updated.endTime = pausedAt;
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
    (job?.timeSpent ?? 0) + (job?.startTime != null ? Math.max(0, now - job.startTime) / 1000 : 0);

  return {
    job,
    elapsedSeconds,
    isRunning: job?.startTime != null,
    loading,
    busy,
    error,
    start,
    pause,
    reset,
  };
};
