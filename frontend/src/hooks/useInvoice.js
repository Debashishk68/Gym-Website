import { useMutation, useQuery } from "@tanstack/react-query"
import { GenerateInvoice, getInvoices } from "../apis/Invoice"

export const useGetInvoice =()=>{
    return useQuery({
        queryFn:getInvoices,
        queryKey:['invoices']
    })
}

export const useGenInvoice=()=>{
    return useMutation({
        mutationFn:GenerateInvoice,
        mutationKey:['generate-invoice'],
    })
}