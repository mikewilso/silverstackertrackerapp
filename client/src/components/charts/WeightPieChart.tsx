import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFD700', '#C0C0C0', '#B87333'];

interface WeightPieChartProps {
  data: { name: string; value: number }[];
}

const WeightPieChart: React.FC<WeightPieChartProps> = ({ data }) => {
  return (
    <PieChart width={450} height={450}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default WeightPieChart;