import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';

const ComparitiveChart = ({ data, x, y }) => {
  const chartData = data.map(team => {
    const shotsPerGame = team.teamStats[0].splits[0].stat.shotsPerGame;
    const goalsPerGame = team.teamStats[0].splits[0].stat.goalsPerGame;
    const ratio = shotsPerGame / goalsPerGame;
    return {
      name: team.abbreviation,
      shotsPerGame,
      goalsPerGame,
      ratio
    };
  });

  chartData.sort((a, b) => a.ratio - b.ratio);

  return (
    <BarChart width={2000} height={600} data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip
        contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px', padding: '10px' }}
        itemStyle={{ color: 'white' }}
        formatter={(value, name, props) => {
          if (name === 'Ratio') {
            return props.payload.ratio.toFixed(2);
          }
          return value;
        }}
      />
      <Legend />
      <Bar dataKey="shotsPerGame" stackId = 'a' fill="grey" />
      <Bar dataKey="goalsPerGame" stackId = 'a' fill="rgb(253, 86, 78)" />
      <Bar dataKey="ratio" stackId = 'a' fill="rgb(254, 182, 89)" name="Ratio" />
    </BarChart>
  );
};

export default ComparitiveChart;
