import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QAMemberCreate, QAMemberUpdate } from "@/types/qaMember";
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

export const useQA = () => {
    const queryClient = useQueryClient(); // Add this
    const navigate = useNavigate();


    const createQAMember = useMutation({
        mutationFn: async (data: QAMemberCreate) => {
            const response = await axios.post(`${API_URL}/qa_member/create_qa_member`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qa_members"] });
        }
    });

    const getAllQAMembers = useQuery({
        queryKey: ["qa_members"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/qa_member/get_all_qa_members`);
            return response.data;
        },
    });

    const removeQAMember = useMutation({
        mutationFn: async (qa_member_id: number) => {
            const response = await axios.delete(`${API_URL}/qa_member/remove_qa_member/${qa_member_id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qa_members"] });
        },
    });

    const resetQAPassword = useMutation({
        mutationFn: async (data: QAMemberUpdate) => {
            // Use PUT to match your backend endpoint.
            const response = await axios.put(
                `${API_URL}/qa_member/password_reset/${data.qa_member_id}`,
                data
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Password reset successfully:', data);
            // Optionally show a success message (e.g., toast notification)
        },
        onError: (error) => {
            console.error('Error resetting password:', error);
            // Optionally show an error message to the user
        }
    });

    const createQApassword = useMutation({
        mutationFn: async (data: any) => {
            const response = await axios.put(
                `${API_URL}/qa_member/create_password/${data.qa_member_id}`,
                data
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Password reset successfully:', data);
            navigate('/qa-dashboard'); 
        },
        onError: (error) => {
            console.error('Error resetting password:', error);
            }
    });



    return {
        createQAMember,
        getAllQAMembers,
        removeQAMember,
        resetQAPassword,
        createQApassword
    };
}
