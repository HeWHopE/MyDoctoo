import { useEffect } from 'react';

const useInfiniteScroll = (
  ref: React.RefObject<HTMLDivElement>,
  handleScrolledToEnd: () => void,
  deps: any[],
  isReverse = false,
) => {
  useEffect(() => {
    const checkIfScrolledToBottom = () => {
      if (ref.current) {
        const { scrollTop, clientHeight, scrollHeight } = ref.current;
        if (isReverse) {
          return Math.abs(scrollTop) + 100 + clientHeight >= scrollHeight;
        }
        return scrollTop + 100 + clientHeight >= scrollHeight;
      }
      return false;
    };

    const handleScroll = () => {
      if (checkIfScrolledToBottom()) {
        handleScrolledToEnd();
      }
    };

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, ...deps]);
};

export default useInfiniteScroll;
