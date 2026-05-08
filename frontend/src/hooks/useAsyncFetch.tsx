import { useEffect, useState, type DependencyList } from "react";

const useAsyncFetch = <T,>(
  callback: () => Promise<T>,
  dependencies: DependencyList = [],
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    callback()
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [...dependencies, reloadKey]);

  const refetch = () => setReloadKey((prev) => prev + 1);

  return { data, isLoading, error, refetch };
};

export default useAsyncFetch;
