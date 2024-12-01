import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Typography } from 'antd';
import WeightPieChart from '../charts/WeightPieChart';
import axios from 'axios';

const { Title } = Typography;

const COLORS = ['#FFD700', '#C0C0C0', '#B87333'];

export const HomePage = () => {
    const silverPrice = 30;
    const goldPrice = 2500;
    const copperPrice = 0.25;

    const [totalGoldWeights, setTotalGoldWeights] = useState(0);
    const [totalSilverWeights, setTotalSilverWeights] = useState(0);
    const [totalCopperWeights, setTotalCopperWeights] = useState(0);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/silver');
                setTotalSilverWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/gold');
                setTotalGoldWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/copper');
                setTotalCopperWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    const totalWeightData = [
        { name: 'Gold', value: Number(totalGoldWeights) },
        { name: 'Silver', value: Number(totalSilverWeights) },
        { name: 'Copper', value: Number(totalCopperWeights) },
    ];

    const totalValueData = [
        { name: 'Gold', value: Number(totalGoldWeights) * goldPrice },
        { name: 'Silver', value: Number(totalSilverWeights) * silverPrice },
        { name: 'Copper', value: Number(totalCopperWeights) * copperPrice },
    ];

    return (
        <div>
            <Title>Michael's Home Page</Title>
            <div>
                <Title level={3}>TOTAL GOLD: {totalGoldWeights} OZT</Title>
                <Title level={3}>TOTAL SILVER: {totalSilverWeights} OZT</Title>
                <Title level={3}>TOTAL COPPER: {totalCopperWeights} OZT</Title>
            </div>

            <WeightPieChart data={totalWeightData} />

            <PieChart width={450} height={450}>
                <Pie
                    data={totalValueData}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {totalValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};