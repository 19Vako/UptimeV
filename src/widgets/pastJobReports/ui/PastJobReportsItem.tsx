import { ReportCard } from '@/entities/jobReport';
import React from 'react';
import { PastJobReportsItemProps } from '../type';

export const PastJobReportsItem = React.memo(({ item }: PastJobReportsItemProps) => {
  return <ReportCard jobReport={item} />;
});

PastJobReportsItem.displayName = 'PastJobReportsItem';
