import { useMutation } from "@tanstack/react-query";
import { AddMember, deleteMember, EditMember } from "../apis/AddMember.js";
export const useAddMember = () => {
  return useMutation({
    mutationFn: AddMember,
    mutationKey: ["addmember"],
  });
};
export const useEditMember = () => {
  return useMutation({
    mutationFn: ({ id, data,planPrice,renewPlan }) => EditMember({ id, data,planPrice,renewPlan }),
    mutationKey: ["editmember"],
  });
};
export const useDeleteMember = () => {
  return useMutation({
    mutationFn: deleteMember,
  });
};