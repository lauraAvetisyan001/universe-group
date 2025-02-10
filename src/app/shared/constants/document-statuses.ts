import { DocumentStatuses } from '../interfaces/document-statuses';

export const DOCUMENT_STATUSES: DocumentStatuses[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVOKE', label: 'Revoke' },
  { value: 'READY_FOR_REVIEW', label: 'Ready for Review' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
];

export const USER_FILTERS: DocumentStatuses[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'READY_FOR_REVIEW', label: 'Ready for review' },
  { value: 'REVOKE', label: 'Revoke' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'noFilter', label: 'No filter' },
];

export const REVIEWER_FILTERS: DocumentStatuses[] = [
  { value: 'READY_FOR_REVIEW', label: 'Ready for review' },
  { value: 'REVOKE', label: 'Revoke' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'noFilter', label: 'No filter' },
];

export const REVIEWER_STATUSES: DocumentStatuses[] = [
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
];