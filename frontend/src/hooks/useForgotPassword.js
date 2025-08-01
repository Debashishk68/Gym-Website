import { ChangePassApi, sendOtpApi, verifyOtpApi } from "../apis/ForgotPassword"
import { useMutation } from "@tanstack/react-query"


export const useSendOtp=()=>{
    return useMutation({
        mutationFn:sendOtpApi,
        mutationKey:['send-otp'],
    })
}

export const useVerifyOtp=()=>{
    return useMutation({
        mutationFn:({email,otp})=>verifyOtpApi(email, otp),
        mutationKey:['verify-otp'],
    })
}

export const useResetPass=()=>{
    return useMutation({
        mutationFn:({token,password})=>ChangePassApi(token, password),
        mutationKey:['verify-otp'],
    })
}