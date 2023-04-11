import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload) {
    return (
      <div className="custom-tooltip" style={{background: "white", border: "1px solid black", padding: "10px", fontWeight: "bold", color: "black"}}>
        <p className="label">{`${label}`}</p>
        <p className="value">{`Goals Conceded per game: ${payload[0].value}`}</p>
        <p className="value">{`Goals Scored per game: ${payload[1].value}`}</p>
        <span className="icon"></span>
      </div>
    );
  }

  return null;
};

const LineChart2 = ({ data, goalsPerGame, goalsAgainstPerGame}) => {
  return (
    <LineChart width={2000} height={500} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="abbreviation" />
      <YAxis/>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey={"teamStats[0].splits[0].stat.goalsAgainstPerGame"} stroke="rgb(253, 86, 78)" activeDot={{ r: 8 }} name = "Goals Conceded/game"/>
      <Line type="monotone" dataKey={"teamStats[0].splits[0].stat.goalsPerGame"} stroke="rgb(254, 182, 89)" activeDot={{ r: 8 }} name = "Goals Scored/game"/>
    </LineChart>
  );
};

export default LineChart2;
