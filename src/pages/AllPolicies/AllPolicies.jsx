import React from 'react';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query'
const AllPolicies = () => {


    const { data, isLoading, refetch } = useQuery({
        queryKey: ['policies',],
        queryFn: async () => {
            const { data } = await axiosSecure(`${import.meta.env.VITE_API_URL}/policies`)

            return data
        }
    })

    console.log(data);

    return (
        <div>

        </div>
    );
};

export default AllPolicies;