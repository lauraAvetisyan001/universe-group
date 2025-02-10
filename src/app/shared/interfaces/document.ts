import { DocumentStatus } from '../models/document.status.type';

export interface Document {
  id: string;
  name: string;
  status: DocumentStatus;
  fileUrl: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface DocumentResponse {
  count: number;
  results: Document[];
}