import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';

const COLORS = ['#6A4FE0', '#FFB84D', '#2ED9A8', '#FF6B9D', '#4FC3F7', '#FF8A65'];

function CategoryChart({ refreshTrigger }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get('/expenses/summary')
            .then(res => {
                const formatted = res.data.map(item => ({ name: item[0], value: item[1] }));
                setData(formatted);
            })
            .catch(err => console.error('Failed to load summary', err));
    }, [refreshTrigger]);

    if (data.length === 0) {
        return <p style={{ color: '#888' }}>No expense data yet to chart.</p>;
    }

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                        label={(entry) => `${entry.name}: ₹${entry.value}`}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CategoryChart;