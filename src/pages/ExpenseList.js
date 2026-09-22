import React from 'react';
import api from '../api';

function ExpenseList({ expenses, onExpenseDeleted, onEditClick }) {

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            onExpenseDeleted();
        } catch (err) {
            alert('Failed to delete expense');
        }
    };

    if (!Array.isArray(expenses) ||expenses.length === 0) {
        return <p style={{ color: '#888', fontStyle:'italic'}}>No expenses founded for selected range.</p>;
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Notes</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
                    <th style={{ padding: '8px' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px' }}>{exp.date}</td>
                        <td style={{ padding: '8px' }}>{exp.category?.name}</td>
                        <td style={{ padding: '8px' }}>{exp.notes}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>₹{exp.amount}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button onClick={() => onEditClick(exp)}>Edit</button>
                            <button onClick={() => handleDelete(exp.id)} style={{ marginLeft: '5px' }}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ExpenseList;