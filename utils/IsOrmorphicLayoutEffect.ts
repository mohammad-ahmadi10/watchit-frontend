import { useLayoutEffect, useEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;// Ensure the name used in components is useLayoutEffect


  export default  useIsomorphicLayoutEffect;