import { useState } from "react";

const useAsyncCall = <T,>() => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = async (fn: () => Promise<T>): Promise<T | undefined> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, execute };
};

export default useAsyncCall;
