import { useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const load = async (aPromise) => {
    setIsLoading(true);
    try {
      return await aPromise;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const LoaderComponent = isLoading ? <InfinitySpin
    width='200'
    color="#7b60e8"
  /> : null;

  return { isLoading, load, LoaderComponent };
};
