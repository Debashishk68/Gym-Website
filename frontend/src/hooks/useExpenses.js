import { useMutation, useQuery } from '@tanstack/react-query';
import { AddExpense, GetExpenses } from '../apis/Expenses.js';

export const useAddExpense = () => {
    return useMutation({
         mutationFn: AddExpense,
         mutationKey: ['addExpense'],
    })
}

export const useGetExpenses = (month, year) => {
    return useQuery({
        queryKey: ['getExpenses', month, year],
        queryFn: () => GetExpenses(month, year),
    });
}
