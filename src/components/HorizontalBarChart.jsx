import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const HorizontalBarChart = ({ data, x, y, z }) => {
  return (
    <BarChart
      width={2000}
      height={1050}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      layout="vertical"
    >
      <XAxis type="number" label={{ value: "", position: 'insideBottom', dy: 10 }} />
      <YAxis dataKey="abbreviation" type="category" label={{ value: "", position: 'insideLeft', angle: -90, dx: -10 }} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey={x} fill="grey" name = "Scoring First"/>
      <Bar dataKey={y} fill="rgb(253, 86, 78)" name = "Conceding First"/>
    </BarChart>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload) {
    return (
      <div className="custom-tooltip" style={{background: "white", border: "1px solid black", padding: "10px", fontWeight: "bold"}}>
        {/* <p className="label">{`${data.name}`}</p> */}
        <p className="value">{`Scored First: ${payload[0].value}`}</p>
        <p className="value">{`Conceded First: ${payload[1].value}`}</p>
        <span className="icon"></span>
      </div>
    );
  }

  return null;
};

export default HorizontalBarChart;
