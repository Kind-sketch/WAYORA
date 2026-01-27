import { useState, useEffect, useCallback } from 'react';
import {
    Expense,
    getExpenses,
    addExpense as addExpenseToStorage,
    updateExpense as updateExpenseInStorage,
    deleteExpense as deleteExpenseFromStorage,
    getExpenseSummary,
    clearExpenses as clearExpensesFromStorage,
    createStorageListener,
    formatCurrency,
} from '@/lib/storageService';

interface ExpenseSummary {
    total: number;
    totalFormatted: string;
    byCategory: Record<string, number>;
    byCategoryFormatted: Record<string, string>;
}

interface UseExpensesReturn {
    expenses: Expense[];
    summary: ExpenseSummary;
    addExpense: (expense: Omit<Expense, 'id'>) => Expense;
    updateExpense: (id: string, updates: Partial<Expense>) => Expense | null;
    deleteExpense: (id: string) => boolean;
    clearExpenses: () => void;
    getRecentExpenses: (limit?: number) => Expense[];
    getExpensesByCategory: (category: string) => Expense[];
    refresh: () => void;
}

export const useExpenses = (): UseExpensesReturn => {
    const [expenses, setExpenses] = useState<Expense[]>(getExpenses);

    // Refresh from storage
    const refresh = useCallback(() => {
        setExpenses(getExpenses());
    }, []);

    // Listen for storage changes
    useEffect(() => {
        const cleanup = createStorageListener(refresh);
        return cleanup;
    }, [refresh]);

    // Add expense
    const handleAddExpense = useCallback((expense: Omit<Expense, 'id'>): Expense => {
        const newExpense = addExpenseToStorage(expense);
        setExpenses(getExpenses());
        return newExpense;
    }, []);

    // Update expense
    const handleUpdateExpense = useCallback((id: string, updates: Partial<Expense>): Expense | null => {
        const updated = updateExpenseInStorage(id, updates);
        if (updated) {
            setExpenses(getExpenses());
        }
        return updated;
    }, []);

    // Delete expense
    const handleDeleteExpense = useCallback((id: string): boolean => {
        const success = deleteExpenseFromStorage(id);
        if (success) {
            setExpenses(getExpenses());
        }
        return success;
    }, []);

    // Clear all expenses
    const handleClearExpenses = useCallback(() => {
        clearExpensesFromStorage();
        setExpenses([]);
    }, []);

    // Get recent expenses
    const getRecentExpenses = useCallback((limit = 5): Expense[] => {
        return expenses.slice(0, limit);
    }, [expenses]);

    // Get expenses by category
    const getExpensesByCategory = useCallback((category: string): Expense[] => {
        return expenses.filter(e => e.category === category);
    }, [expenses]);

    // Calculate summary with formatted values
    const rawSummary = getExpenseSummary();
    const summary: ExpenseSummary = {
        total: rawSummary.total,
        totalFormatted: formatCurrency(rawSummary.total),
        byCategory: rawSummary.byCategory,
        byCategoryFormatted: Object.fromEntries(
            Object.entries(rawSummary.byCategory).map(([k, v]) => [k, formatCurrency(v)])
        ),
    };

    return {
        expenses,
        summary,
        addExpense: handleAddExpense,
        updateExpense: handleUpdateExpense,
        deleteExpense: handleDeleteExpense,
        clearExpenses: handleClearExpenses,
        getRecentExpenses,
        getExpensesByCategory,
        refresh,
    };
};
