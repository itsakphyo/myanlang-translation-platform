import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobFormData, JobEdit } from "@/types/job";

const API_URL = import.meta.env.VITE_API_URL;

export const useJob = () => {
    const queryClient = useQueryClient(); 

    const createJob = useMutation({
        mutationFn: async (data: JobFormData) => {
            const formData = new FormData();
            formData.append("job_title", data.title);
            formData.append("source_language_id", data.source_language_id.toString());
            formData.append("target_language_id", data.target_language_id.toString());
            formData.append("max_time_per_task", data.max_time_per_task.toString());
            formData.append("task_price", data.task_price.toString());
            formData.append("instructions", data.instructions);
            formData.append("notes", data.notes || "");

            formData.append("file", data.csv);

            const response = await axios.post(`${API_URL}/job/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
    });

    const getAllJobs = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/job/get_all_jobs`);
            return response.data;
        },
    });

    const getAllAssJobs = useQuery({
        queryKey: ["assjobs"],
            queryFn: async () => {
            const response = await axios.get(`${API_URL}/job/get_all_ass_jobs`);
            return response.data;
        },
    });

    const getJobProgress = (jobId: number) => useQuery({
        queryKey: ["job_progress", jobId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/job/get_job_progress/${jobId}`);
            return response.data;
        },
    });

    const downloadTasks = async (jobId: number) => {
        const response = await axios.get(`${API_URL}/task/download_tasks?job_id=${jobId}`, {
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "tasks.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteJob = useMutation({
        mutationFn: async (jobId: number) => {
            const response = await axios.delete(`${API_URL}/job/delete_job/${jobId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["assjobs"] });
        },
    });

    const updateJob = useMutation({
        mutationFn: async ({ job_id, data }: { job_id: number; data: JobEdit }) => {
            const response = await axios.put(`${API_URL}/job/update_job/${job_id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["assjobs"] });
        },
    });

    const createAssessmentJob = useMutation({
        mutationFn: async (data: JobFormData) => {
            const formData = new FormData();
            formData.append("job_title", data.title);
            formData.append("source_language_id", data.source_language_id.toString());
            formData.append("target_language_id", data.target_language_id.toString());
            formData.append("max_time_per_task", data.max_time_per_task.toString());
            formData.append("instructions", data.instructions);

            formData.append("file", data.csv);

            const response = await axios.post(`${API_URL}/job/create_assessment_job`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assjobs"] });
        },
    });

    return { createJob, getAllJobs, deleteJob, getJobProgress, downloadTasks, updateJob, createAssessmentJob, getAllAssJobs };
};
