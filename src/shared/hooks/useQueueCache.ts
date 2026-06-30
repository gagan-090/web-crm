import { useLazyGetDwQueueCallbacksQuery } from '../../services/api/webCrmApi';
import { useState, useEffect, useCallback } from 'react';
import {
  useLazyGetDwQueueFreshQuery,
  useLazyGetDwQueueOldQuery,
  useLazyGetDwQueueUncalledQuery,
  useLazyGetDwQueueCalledQuery,
  useLazyGetDwQueueCountsQuery,
  useLazyGetDwQueueQuery
} from '../../services/api/webCrmApi';

export type QueueType = 'all' | 'fresh' | 'old' | 'uncalled' | 'callbacks' | 'called';

export interface CacheData {
  leads: any[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  summary?: any;
}

export interface FilterState {
  subscribed?: string;
  salary?: string;
  route?: string;
  state_id?: number;
  pan?: string;
  vehicle_type?: string;
  experience?: string;
  profile_complete?: string;
}

// Cache lives in localStorage with no time-based expiry — once fetched, data
// persists across navigation/remounts. The only way to get fresh data is the
// explicit refetch() (wired to a manual refresh button), or invalidateQueueCache().
const readCache = (cacheKey: string): { data: any; timestamp: number } | null => {
  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch (e) {
    return null;
  }
};

const writeCache = (cacheKey: string, data: any) => {
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
};

export const useQueueCache = (
  type: QueueType,
  params: { page: number; search: string; per_page: number },
  filters?: FilterState
) => {
  const { page, search, per_page } = params;
  const cacheKey = `dw_queue_${type}_p${page}_s${search || ''}_f${JSON.stringify(filters || {})}`;

  const [data, setData] = useState<CacheData | null>(() => readCache(cacheKey)?.data ?? null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(() => readCache(cacheKey)?.timestamp ?? null);
  const [isLoading, setIsLoading] = useState(!data);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<any>(null);

  // Synchronize state in the render phase when cacheKey changes
  const [prevCacheKey, setPrevCacheKey] = useState(cacheKey);
  if (cacheKey !== prevCacheKey) {
    setPrevCacheKey(cacheKey);
    const cached = readCache(cacheKey);
    setData(cached?.data ?? null);
    setLastUpdated(cached?.timestamp ?? null);
    setIsLoading(!cached);
  }

  const [triggerFresh] = useLazyGetDwQueueFreshQuery();
  const [triggerOld] = useLazyGetDwQueueOldQuery();
  const [triggerUncalled] = useLazyGetDwQueueUncalledQuery();
  const [triggerCallbacks] = useLazyGetDwQueueCallbacksQuery();
  const [triggerCalled] = useLazyGetDwQueueCalledQuery();
  const [triggerAll] = useLazyGetDwQueueQuery();

  const fetchQueue = useCallback(async (_force = false) => {
    setIsFetching(true);

    // Only show the full skeleton loader when there's nothing to show yet.
    // A manual refresh (force=true) on top of existing data should just spin
    // the refresh icon, not flash the list back to skeletons.
    if (!readCache(cacheKey)) {
      setIsLoading(true);
    }

    try {
      let result: any;
      const queryParams = {
        page,
        search: search || undefined,
        per_page,
        ...filters
      };

      if (type === 'all') {
        result = await triggerAll(queryParams).unwrap();
      } else if (type === 'fresh') {
        result = await triggerFresh(queryParams).unwrap();
      } else if (type === 'old') {
        result = await triggerOld(queryParams).unwrap();
      } else if (type === 'uncalled') {
        result = await triggerUncalled(queryParams).unwrap();
      } else if (type === 'callbacks') {
        result = await triggerCallbacks(queryParams).unwrap();
      } else {
        result = await triggerCalled(queryParams).unwrap();
      }

      if (result && result.status) {
        const fetchedLeads = Array.isArray(result.data?.data)
          ? result.data.data
          : (result.data?.leads || (Array.isArray(result.data) ? result.data : []));

        const fetchedPagination = result.data?.pagination || (result.data && typeof result.data.total === 'number' ? {
          total: result.data.total,
          per_page: result.data.per_page || per_page,
          current_page: result.data.current_page || page,
          last_page: result.data.last_page || 1
        } : {
          total: fetchedLeads.length,
          per_page,
          current_page: page,
          last_page: 1
        });

        const fetchedData: CacheData = {
          leads: fetchedLeads,
          pagination: fetchedPagination,
          summary: result.data?.summary
        };

        setData(fetchedData);
        writeCache(cacheKey, fetchedData);
        setLastUpdated(Date.now());
        setError(null);
      } else {
        throw new Error(result?.message || 'Failed to fetch queue');
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [type, page, search, per_page, triggerFresh, triggerOld, triggerUncalled, triggerCallbacks, triggerCalled, cacheKey, JSON.stringify(filters)]);

  useEffect(() => {
    // Auto-fetch only when nothing is cached yet for this key. Once cached,
    // data persists across navigation/remounts until the user explicitly refreshes.
    if (!readCache(cacheKey)) {
      fetchQueue();
    } else {
      setIsLoading(false);
    }
  }, [cacheKey, fetchQueue]);

  const removeLead = useCallback((leadId: number) => {
    if (data) {
      const updatedLeads = data.leads.filter((l: any) => l.id !== leadId);
      const updatedData = {
        ...data,
        leads: updatedLeads,
        pagination: {
          ...data.pagination,
          total: Math.max(0, data.pagination.total - 1)
        }
      };
      setData(updatedData);
      writeCache(cacheKey, updatedData);
      setLastUpdated(Date.now());
    }
  }, [data, cacheKey]);

  return {
    data,
    isLoading,
    isFetching,
    error,
    lastUpdated,
    refetch: () => fetchQueue(true),
    removeLead
  };
};

// Fields the UI currently reads off the counts object. If a cached entry is
// missing any of these (e.g. it was written before a new field was added to
// the backend response), it's treated as no-cache so a real fetch happens —
// otherwise a stale cache can silently mask a field as 0 forever, since
// nothing ever invalidates it on a time basis anymore.
const COUNTS_FIELDS = ['total', 'fresh', 'old', 'uncalled', 'callbacks', 'called_today', 'overdue_callbacks'] as const;
const isCompleteCounts = (data: any): boolean =>
  !!data && COUNTS_FIELDS.every((key) => typeof data[key] !== 'undefined');

export const useQueueCountsCache = () => {
  const [triggerCounts] = useLazyGetDwQueueCountsQuery();
  const cacheKey = 'dw_counts_data';
  const [counts, setCounts] = useState<{
    total: number;
    fresh: number;
    old: number;
    uncalled: number;
    callbacks: number;
    called_today: number;
    overdue_callbacks: number;
    states?: Array<{ id: number; name: string }>;
  } | null>(() => {
    const cached = readCache(cacheKey)?.data;
    return isCompleteCounts(cached) ? cached : null;
  });
  const [isFetching, setIsFetching] = useState(false);

  const fetchCounts = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await triggerCounts().unwrap();
      if (result && result.status) {
        const data = result.data;
        setCounts(data);
        writeCache(cacheKey, data);
      }
    } catch (e) {
      // keep whatever counts are already cached on failure
    } finally {
      setIsFetching(false);
    }
  }, [triggerCounts]);

  useEffect(() => {
    if (!isCompleteCounts(readCache(cacheKey)?.data)) {
      fetchCounts();
    }
  }, [fetchCounts]);

  return {
    counts,
    isFetching,
    refetch: fetchCounts
  };
};


export const invalidateQueueCache = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('dw_queue_') || key.startsWith('dw_counts_'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
