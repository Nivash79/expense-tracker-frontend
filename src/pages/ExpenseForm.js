import React, { useState, useEffect } from 'react';
import api from '../api';

function ExpenseForm({ onExpenseAdded, editingExpense, onEditComplete }) {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Failed to load categories', err));
    }, []);

    useEffect(() => {
        if (editingExpense) {
            setAmount(editingExpense.amount);
            setDate(editingExpense.date);
            setNotes(editingExpense.notes);
            setCategoryId(editingExpense.category.id);
        }
    }, [editingExpense]);

    const resetForm = () => {
        setAmount('');
        setDate('');
        setNotes('');
        setCategoryId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const payload = { amount: parseFloat(amount), date, notes, categoryId: parseInt(categoryId) };

        try {
            if (editingExpense) {
                await api.put(`/expenses/${editingExpense.id}`, payload);
                onEditComplete();
            } else {
                await api.post('/expenses', payload);
                onExpenseAdded();
            }
            resetForm();
        } catch (err) {
            setError('Failed to save expense');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
            <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">{editingExpense ? 'Update' : 'Add'} Expense</button>
            {editingExpense && <button type="button" onClick={onEditComplete} style={{ marginLeft: '10px' }}>Cancel</button>}
        </form>
    );
}

export default ExpenseForm;