import { useMutation } from '@tanstack/react-query';
import { LoginUser, LogoutUser } from '../apis/Auth';
export const useLogin =()=>{
    return useMutation({
        mutationFn:LoginUser,
        mutationKey:['login'],
    })
}
export const useLogout =()=>{
    return useMutation({
        mutationFn:LogoutUser,
        mutationKey:['logout']

    })
}