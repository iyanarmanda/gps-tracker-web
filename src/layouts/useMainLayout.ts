import { useOutletContext } from 'react-router-dom';

import type { MainLayoutContext } from './interfaces/main-layout-context.interface';

export function useMainLayout() {
  return useOutletContext<MainLayoutContext>();
}

