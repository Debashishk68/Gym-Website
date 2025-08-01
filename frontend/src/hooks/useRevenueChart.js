import { useQuery } from "@tanstack/react-query";
import { ClientTrendsApi, RevenueChartApi } from "../apis/RevenueChart.js";

export const useRevenueChart = () => {
  return useQuery({
    queryKey: ["Revenue"], 
    queryFn:RevenueChartApi,
  });
};
export const useCLientTrends = () => {
  return useQuery({
    queryKey: ["Trends"], 
    queryFn:ClientTrendsApi,
  });
};