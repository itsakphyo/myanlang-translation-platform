import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Language } from "@mui/icons-material";
import SubmissionTaskReviewInterface from "@/components/qa/SubmissionTaskReviewInterface";
import BulkSubmissionReview from "@/components/qa/BulkSubmissionReview";
import { useAssessmentTasksForReview } from "@/hooks/useAssTaskForReview";
import { LanguagePair } from "@/types/language";
import { useAssReviewedSubmit } from "@/hooks/useAssTask";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSubmittedTaskForReview } from "@/hooks/useGetSubmittedTaskForReview";
import { useSubTaskdecision } from "@/hooks/useGetSubmittedTaskForReview";

const TaskReviewContent = ({
  selectedLanguagePair,
  taskType,
  assTaskOpen,
  setAssTaskOpen,
  isSubmissionTaskOpen,
  setReviewingInProgress,
  setIsSubmissionTaskOpen,
  setSelectedLanguagePair
}: {
  selectedLanguagePair: LanguagePair | null,
  taskType: "assessment" | "submission",
  assTaskOpen: boolean,
  setAssTaskOpen: (open: boolean) => void,
  isSubmissionTaskOpen: boolean,
  setReviewingInProgress: (inProgress: boolean) => void,
  setIsSubmissionTaskOpen: (open: boolean) => void,
  setSelectedLanguagePair: (pair: LanguagePair | null) => void
}) => {
  const queryClient = useQueryClient();
  const { mutate: sentData } = useAssReviewedSubmit();
  const { mutate: sentDecision } = useSubTaskdecision();
  const userId = Number(localStorage.getItem("userId")) || 0;

  // Call the hook only when taskType is "assessment"
  const { data, error, isLoading } = useAssessmentTasksForReview(
    selectedLanguagePair?.source_id ?? 0,
    selectedLanguagePair?.target_id ?? 0,
    taskType === "assessment"
  );

  // Call the hook only when taskType is "submission"
  const { data: submittedData, error: submittedError, isLoading: submittedLoading, refetch: refetchSubmittedData } = useGetSubmittedTaskForReview(
    selectedLanguagePair?.source_id ?? 0,
    selectedLanguagePair?.target_id ?? 0,
    userId,
    taskType === "submission"
  );

  useEffect(() => {
    if (error) console.error("Error fetching assessment tasks:", error);
  }, [error]);

  useEffect(() => {
    if (data?.length > 0) {
      setAssTaskOpen(true);
    }
  }, [data, setAssTaskOpen]);

  // Update reviewingInProgress based on whether a review interface is visible.
  useEffect(() => {
    // If no language pair is selected, there is no review in progress.
    if (!selectedLanguagePair) {
      setReviewingInProgress(false);
      return;
    }

    let inReview = false;
    if (taskType === "submission") {
      // Only set reviewingInProgress true if the submission interface is open,
      // data is available, and there’s no error or loading in progress.
      if (isSubmissionTaskOpen && submittedData && !submittedError && !submittedLoading) {
        inReview = true;
      }
    } else {
      // For assessment/bulk review, check if the data exists, the interface is open, and tasks are available.
      if (data?.length > 0 && assTaskOpen && data[0]?.tasks) {
        inReview = true;
      }
    }
    setReviewingInProgress(inReview);
  }, [
    selectedLanguagePair,
    taskType,
    isSubmissionTaskOpen,
    submittedData,
    submittedError,
    submittedLoading,
    data,
    assTaskOpen,
    setReviewingInProgress
  ]);

  const handleSubmissionAction = (data: any) => {
    sentDecision(data, {
      onSuccess: () => {
        refetchSubmittedData();
      }
    });
  };

  const handleMakeDecisionandShowNext = (data: any) => {
    handleSubmissionAction(data);
  };

  const handleMakeDecisionandClose = (data: any) => {
    handleSubmissionAction(data);
    setIsSubmissionTaskOpen(false);
    setSelectedLanguagePair(null);
  };

  const handleSubmitAllAndCloseAss = (data: any) => {
    sentData(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['assessmentTasks', selectedLanguagePair?.source_id, selectedLanguagePair?.target_id],
        });
        setAssTaskOpen(false);
        setSelectedLanguagePair(null);
        queryClient.setQueryData(
          ['assessmentTasks', selectedLanguagePair?.source_id, selectedLanguagePair?.target_id],
          []
        );
      },
    });
  };

  const handleSubmitAndNextAss = (data: any) => {
    sentData(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['assessmentTasks', selectedLanguagePair?.source_id, selectedLanguagePair?.target_id],
        });
      },
    });
  };

  if (!selectedLanguagePair) {
    return (
      <Box textAlign="center" py={10} sx={{ opacity: 0.7 }}>
        <Language sx={{ fontSize: 64, mb: 2, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          Select a language pair to begin reviewing
        </Typography>
      </Box>
    );
  }

  if (taskType === "submission") {
    if (!isSubmissionTaskOpen || !submittedData || submittedError) {
      return (
        <Box textAlign="center" py={10} sx={{ opacity: 0.7 }}>
          <Typography variant="h6" color="text.secondary">
            No Submitted Tasks To Review For This Language Pair
          </Typography>
        </Box>
      );
    }

    if (submittedLoading) {
      return (
        <Box textAlign="center" py={10} sx={{ opacity: 0.7 }}>
          <Typography variant="h6" color="text.secondary">
            Loading submitted tasks...
          </Typography>
        </Box>
      );
    }

    return (
      <SubmissionTaskReviewInterface
        taskId={submittedData?.task.task_id || 0}
        originalText={submittedData?.task.source_text || ""}
        sourceLanguage={submittedData?.source_language || ""}
        submittedText={submittedData?.task.translated_text || ""}
        targetLanguage={submittedData?.target_language || ""}
        onRejectAndClose={handleMakeDecisionandClose}
        onRejectAndShowNext={handleMakeDecisionandShowNext}
        onApproveAndClose={handleMakeDecisionandClose}
        onApproveAndShowNext={handleMakeDecisionandShowNext}
      />
    );
  }

  return (
    <>
      {isLoading && (
        <Box textAlign="center" py={10} sx={{ opacity: 0.7 }}>
          <Typography variant="h6" color="text.secondary">
            Loading bulk review data...
          </Typography>
        </Box>
      )}
      {error || !data && (
        <Box textAlign="center" py={10} sx={{ opacity: 0.7 }}>
          <Typography variant="h6" color="text.secondary">
            No Assessment Tasks To Review For This Language Pair
          </Typography>
        </Box>
      )}
      {data?.length > 0 && assTaskOpen && data[0]?.tasks && (
        <BulkSubmissionReview
          data={data[0]}
          onSubmitAllAndClose={handleSubmitAllAndCloseAss}
          onSubmitAndNext={handleSubmitAndNextAss}
          onClose={() => {
            setAssTaskOpen(false);
            setSelectedLanguagePair(null);
          }}
        />
      )}
    </>
  );
};

export default TaskReviewContent;
