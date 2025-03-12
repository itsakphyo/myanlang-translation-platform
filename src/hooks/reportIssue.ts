// api.ts
import axios from 'axios';
import { IssueReportRequest } from '@/types/IssueReportRequest';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const reportIssue = async (data: IssueReportRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reports/report_issue`, data);
    console.log('Issue report response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error reporting issue:', error);
    throw error;
  }
};
