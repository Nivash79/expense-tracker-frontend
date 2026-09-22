import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import CategoryChart from './CategoryChart';
import BudgetStatus from './BudgetStatus';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    const fetchExpenses = () => {
        setLoading(true);
        let url = '/expenses';
        if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
        api.get(url)
            .then(res => setExpenses(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error('Failed to load expenses', err))
            .finally(() => setLoading(false));
    };

    const refreshAll = () => {
        fetchExpenses();
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        refreshAll();
        // eslint-disable-next-line
    }, []);

    const handleFilter = (e) => { e.preventDefault(); fetchExpenses(); };
    const handleClearFilter = () => { setStartDate(''); setEndDate(''); setTimeout(fetchExpenses, 0); };
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Expense Tracker</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="dash-card">
                <BudgetStatus onBudgetChanged={refreshAll} />
            </div>

            <div className="dash-card">
                <ExpenseForm
                    onExpenseAdded={refreshAll}
                    editingExpense={editingExpense}
                    onEditComplete={() => { setEditingExpense(null); refreshAll(); }}
                />
            </div>

            <div className="dash-card">
                <h3>Spending by Category</h3>
                <CategoryChart refreshTrigger={refreshTrigger} />
            </div>

            <div className="dash-card">
                <h3>Your Expenses</h3>
                <form onSubmit={handleFilter} className="filter-row">
                    <label>From: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
                    <label>To: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></label>
                    <button type="submit">Filter</button>
                    <button type="button" onClick={handleClearFilter}>Clear</button>
                </form>

                {loading ? <p>Loading expenses...</p> : (
                    <ExpenseList
                        expenses={expenses}
                        onExpenseDeleted={refreshAll}
                        onEditClick={(exp) => setEditingExpense(exp)}
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard;