import { useState, useEffect } from "react";

export const useUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("me");
    if (stored) setUserId(stored);
  }, []);

  return userId;
};
