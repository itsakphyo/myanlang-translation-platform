"use client";

import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;


export interface IssueResolveRequest {
  report_id: number;
  admin_id: number;
  task_id?: number;
  added_min?: number;
  language_pair_id?: number;
  decision: boolean;
}

export const useResolveIssue = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const resolveIssue = async (payload: IssueResolveRequest): Promise<any> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reports/resolve_issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Error resolving issue');
      }
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { resolveIssue, loading };
};
