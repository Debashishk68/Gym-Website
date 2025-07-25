import { useQuery } from "@tanstack/react-query";
import { RevenueChartApi } from "../apis/RevenueChart";

export const useRevenueChart = () => {
  return useQuery({
    queryKey: ["Revenue"], 
    queryFn:RevenueChartApi,
  });
};