import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddSupplement,
  DeleteSupplement,
  EditSupplement,
  GetAllSupplements,
  getSupplementById,
  sellSupplement,
} from "../apis/Supplement";

export const useGetAllSuppliments = () => {
  return useQuery({
    queryKey: ["getAllsuppliments"],
    queryFn: GetAllSupplements,
  });
};

export const useAddSuppliment = () => {
  return useMutation({
    mutationFn: AddSupplement,
    mutationKey: ["add"],
  });
};
export const useGetSupplimentId = (id) => {
  return useQuery({
    queryKey: ["getsupplimentid", id],
    queryFn: () => getSupplementById({ id }),
    enabled: !!id,
  });
};

export const useEditSuppliment = () => {
  return useMutation({
    // Accepting an object as the argument
    mutationFn: ({ id, updatedData }) => EditSupplement(id, updatedData),
    mutationKey: ["edit"],
  });
};

export const useDeleteSupppliment = () => {
  return useMutation({
    mutationFn: ({ id }) => DeleteSupplement({ id }),
    mutationKey: ["deleteSupplement"],
  });
};
export const useSellSupppliment = () => {
  return useMutation({
    mutationFn:sellSupplement,
    mutationKey: ["sellSupplement"],
  });
};
