import { useMutation } from '@tanstack/react-query';
import { LoginUser } from '../apis/Auth';
export const useLogin =()=>{
    return useMutation({
        mutationFn:LoginUser,
        mutationKey:['login']

    })
}