// hooks/useActivity.js
import React from 'react';

import { ActivityContext } from 'src/contexts/activityContext';

export function useActivity() {
  const context = React.useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
