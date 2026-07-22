import { stickyOpenRecord } from '../../shared/hooks/useStickyState';

// The job the agent currently has open on the Job Board, kept for the session.
// Shared by MmJobBoard (which reopens it) and MmJobDetail (which records it and
// clears it on "← Job Board").
const MM_OPEN_JOB_KEY = 'mm_job_board_open_job';

export const openJobSession = {
  get: () => stickyOpenRecord.get(MM_OPEN_JOB_KEY),
  set: (jobId: string) => stickyOpenRecord.set(MM_OPEN_JOB_KEY, jobId),
  clear: () => stickyOpenRecord.clear(MM_OPEN_JOB_KEY),
};
