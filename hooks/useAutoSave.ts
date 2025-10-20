import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // Delay in milliseconds
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
  error: Error | null;
  forceSave: () => Promise<void>;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 30000, // Default 30 seconds
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;

    const currentData = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentData === lastDataRef.current) {
      return;
    }

    try {
      isSavingRef.current = true;
      setStatus('saving');
      setError(null);

      await onSave(data);

      lastDataRef.current = currentData;
      setStatus('saved');
      setLastSaved(new Date());

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err : new Error('Failed to save'));
      console.error('Auto-save error:', err);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave]);

  const forceSave = useCallback(async () => {
    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentData = JSON.stringify(data);
      if (currentData !== lastDataRef.current && enabled) {
        e.preventDefault();
        e.returnValue = '';
        save();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data, enabled, save]);

  return {
    status,
    lastSaved,
    error,
    forceSave,
  };
}