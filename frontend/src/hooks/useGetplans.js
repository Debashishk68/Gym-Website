import { useQuery } from "@tanstack/react-query"
import { plansApi } from "../apis/PlansApi.js"

export const useGetPlans =()=>{
    return useQuery({
        queryFn:plansApi,
        queryKey:['plans']
    })
}