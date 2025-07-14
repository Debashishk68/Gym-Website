import { useQuery } from '@tanstack/react-query';
import { dashboardApi, membersApi, membersInfoApi } from '../apis/Dashboard';

export const useDashboard =()=>{
    return useQuery({
        queryFn:dashboardApi,
        queryKey:['dashbboard']
    })
}
export const useMembers =()=>{
    return useQuery({
        queryFn:membersApi,
        queryKey:['members']
    })
}

export const useMembersInfo = (id) => {
  return useQuery({
    queryKey: ["membersInfo", id], 
    queryFn: () => membersInfoApi(id),
    enabled: !!id, 
  });
};