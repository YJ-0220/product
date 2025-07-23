import { useCallback, useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // 로딩 상태를 관리하는 훅
  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        setLoading(true);
        return await fn();
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, withLoading };
};
