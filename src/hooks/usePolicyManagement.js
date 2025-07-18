// src/hooks/usePolicyManagement.js (No changes from previous version)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from './useAxiosSecure';
import { saveImgCloud } from '../api/utils';



const usePolicyManagement = (page = 1, limit = 9, category = '', search = '') => {
    const queryClient = useQueryClient();

    const { data: policiesData = { policies: [], total: 0 }, isLoading, error } = useQuery({
        queryKey: ['policies', page, limit, category, search],
        queryFn: async () => {
            const params = { page, limit };
            if (category) {
                params.category = category;
            }
            if (search) {
                params.search = search;
            }

            const res = await axiosSecure.get('/policies', { params });
            return res.data || { policies: [], total: 0 };
        },
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000,
    });

    const policies = policiesData.policies;
    const totalPolicies = policiesData.total;

    const preparePolicyData = async (data) => {
        let policyImageURL = data.image;

        if (data.imageFile) {
            try {
                policyImageURL = await saveImgCloud(data.imageFile);
                console.log("Image uploaded to:", policyImageURL);
            } catch (uploadError) {
                console.error("Failed to upload image:", uploadError);
                throw new Error("Failed to upload policy image.");
            }
        }

        const finalPolicyData = {
            ...data,
            image: policyImageURL,
        };

        delete finalPolicyData.imageFile;
        return finalPolicyData;
    };

    const addPolicyMutation = useMutation({
        mutationFn: async (newPolicyData) => {
            const dataWithImageUrl = await preparePolicyData(newPolicyData);
            const res = await axiosSecure.post('/policies', dataWithImageUrl);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
        },
        onError: (err) => {
            console.error('Error adding policy:', err);
        },
    });

    const updatePolicyMutation = useMutation({
        mutationFn: async (updatedPolicyData) => {
            const dataWithImageUrl = await preparePolicyData(updatedPolicyData);
            const res = await axiosSecure.patch(`/policies/${updatedPolicyData._id}`, dataWithImageUrl);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
        },
        onError: (err) => {
            console.error('Error updating policy:', err);
        },
    });

    const deletePolicyMutation = useMutation({
        mutationFn: async (policyId) => {
            const res = await axiosSecure.delete(`/policies/${policyId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
        },
        onError: (err) => {
            console.error('Error deleting policy:', err);
        },
    });

    const isMutating = addPolicyMutation.isPending || updatePolicyMutation.isPending || deletePolicyMutation.isPending;

    return {
        policies,
        totalPolicies,
        isLoading,
        error,
        addPolicy: addPolicyMutation.mutate,
        updatePolicy: updatePolicyMutation.mutate,
        deletePolicy: deletePolicyMutation.mutate,
        isAddingPolicy: addPolicyMutation.isPending,
        isUpdatingPolicy: updatePolicyMutation.isPending,
        isDeletingPolicy: deletePolicyMutation.isPending,
        isMutating,
    };
};

export default usePolicyManagement;