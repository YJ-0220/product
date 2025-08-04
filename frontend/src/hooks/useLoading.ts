import { useCallback, useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // 전역 로딩 상태를 관리하는 함수 (기존 기능 유지)
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

  // 키별 로딩 상태를 관리하는 함수 (새로운 기능)
  const withKeyLoading = useCallback(
    async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      try {
        setLoadingStates(prev => ({ ...prev, [key]: true }));
        return await fn();
      } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  // 특정 키의 로딩 상태를 가져오는 함수
  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  return { 
    loading, 
    withLoading, 
    withKeyLoading, 
    isLoading,
    loadingStates 
  };
};
