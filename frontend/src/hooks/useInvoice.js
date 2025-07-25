import { useQuery } from "@tanstack/react-query"
import { getInvoices } from "../apis/Invoice"

export const useGetInvoice =()=>{
    return useQuery({
        queryFn:getInvoices,
        queryKey:['invoices']
    })
}