import React, { useState, useEffect } from 'react';
import api from '../api';

function BudgetStatus() {
    const [status, setStatus] = useState(null);
    const [limitInput, setLimitInput] = useState('');
    const [error, setError] = useState('');

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const fetchStatus = () => {
        api.get(`/budget/status?month=${month}&year=${year}`)
            .then(res => setStatus(res.data))
            .catch(() => setStatus(null));
    };

    useEffect(() => {
        fetchStatus();
        // eslint-disable-next-line
    }, []);

    const handleSetBudget = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/budget', { month, year, limitAmount: parseFloat(limitInput) });
            setLimitInput('');
            fetchStatus();
        } catch (err) {
            setError('Failed to set budget');
        }
    };

    return (
        <div style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '20px' }}>
            <h3>Budget — {month}/{year}</h3>

            <form onSubmit={handleSetBudget} style={{ marginBottom: '10px' }}>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Set monthly budget"
                    value={limitInput}
                    onChange={(e) => setLimitInput(e.target.value)}
                    required
                />
                <button type="submit" style={{ marginLeft: '8px' }}>Save Budget</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {status ? (
                <div>
                    <p>Limit: ₹{status.budgetLimit} &nbsp; | &nbsp; Spent: ₹{status.totalSpent} &nbsp; | &nbsp; Remaining: ₹{status.remaining}</p>
                    <div style={{ background: '#eee', borderRadius: '5px', overflow: 'hidden', height: '20px' }}>
                        <div
                            style={{
                                width: `${Math.min((status.totalSpent / status.budgetLimit) * 100, 100)}%`,
                                background: status.exceeded ? '#e74c3c' : '#2ecc71',
                                height: '100%'
                            }}
                        />
                    </div>
                    {status.exceeded && <p style={{ color: 'red' }}>Budget exceeded!</p>}
                </div>
            ) : (
                <p>No budget set for this month yet.</p>
            )}
        </div>
    );
}

export default BudgetStatus;