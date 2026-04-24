import { useState, useEffect } from 'react';
import { timeUntil } from '../lib/utils';

export function useCountdown(targetDate: string | undefined) {
  const [countdown, setCountdown] = useState(() =>
    targetDate ? timeUntil(targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  );

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => setCountdown(timeUntil(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
