import { useMutation } from '@tanstack/react-query';
import { AddMember } from '../apis/AddMember';
export const useAddMember =()=>{
    return useMutation({
        mutationFn:AddMember,
        mutationKey:['addmember']

    })
}