import React from "react";
import { useHistory } from "react-router-dom";
import DataProvider from "../context/DataProvider";
import "../DataDisplay.css";
import ComparitiveChart from "../components/ComparitiveChart";
import LineChart2 from "../components/LineChart2";
import HorizontalBarChart from "../components/HorizontalBarChart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, RadialBarChart, RadialBar
} from 'recharts';

const DataDisplay = () => {
  const routerHistory = useHistory();
  const renderTable = (teams) => {
    return (
      <div className="data-table" style={{ overflowX: "auto !important" }}>
  <table className="data-table">
    <thead>
      <tr>
        {/* <th>Team Id</th> */}
        <th>Team Name</th>
        <th>Abbreviation</th>
        <th>City</th>
        <th>Conference</th>
        <th>Division</th>
        <th>Games Played</th>
        <th>Wins</th>
        <th>Losses</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>
      {teams
        .sort((a, b) => b.teamStats[0].splits[0].stat.pts - a.teamStats[0].splits[0].stat.pts)
        .map((team) => (
          <tr
            key={team.id}
            style={{ cursor: "pointer" }}
            onClick={() => routerHistory.push(`/TeamRoster/${team.id}`)}
          >
            {/* <td>{team.id}</td> */}
            <td>{team.name}</td>
            <td>{team.abbreviation}</td>
            <td>{team.locationName}</td>
            <td>{team.conference.name}</td>
            <td>{team.division.name}</td>
            <td>{team.teamStats[0].splits[0].stat.gamesPlayed}</td>
            <td>{team.teamStats[0].splits[0].stat.wins}</td>
            <td>{team.teamStats[0].splits[0].stat.losses}</td>
            <td>{team.teamStats[0].splits[0].stat.pts}</td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
        
    );
  };


  //const COLOURSSS = [  "#8884d8",  "#82ca9d",  "#ffc658",  "#0088FE",  "#00C49F",  "#FFBB28",  "#FF8042",  "#e6194B",  "#f58231",  "#ffe119"];


  return (
    <div>
      <h1>NHL Teams</h1>
      <DataProvider>
        {(teams) => (
          <div >
            {renderTable(teams)}
            <div style={{ marginTop: '100px', marginBottom: '100px' }}>
            <h1>Analysis of Shots taken vs Goals Scored</h1>
            {teams && (
              <ComparitiveChart
                data={teams}
                x="shotsPerGame"
                y="goalsPerGame"
              />
            )}
            </div>
            <div style={{ marginTop: '100px', marginBottom: '100px' }}>
            <h1>Analysis of Goals Scored and Conceded</h1>
            {teams && (
              <LineChart2
                data={teams}
                x="team.teamStats[0].splits[0].stat.goalsAgainstPerGame"
                y="team.teamStats[0].splits[0].stat.goalsPerGame"
              />
            )}
            </div>
            <div style={{ marginTop: "100px", marginBottom: "100px" }}>
              <h1>Win Percentage - scoring first vs conceding first</h1>
              {teams && (
                <HorizontalBarChart
                  width={600}
                  height={400}
                  data={teams}
                  x = "teamStats[0].splits[0].stat.winScoreFirst"
                  y = "teamStats[0].splits[0].stat.winOppScoreFirst"
                  z = "abbreviation"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="team.name" type="category" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                </HorizontalBarChart>
              )}
            </div>

            <div style={{ marginTop: "50px", marginBottom: "50px" }}>
              <h1>Teams with highest faceoff percentage in the league</h1>
              {teams && (
                <RadialBarChart
                  width={2000}
                  height={750}
                  data={teams.sort((a, b) => b.teamStats[0].splits[0].stat.faceOffWinPercentage - a.teamStats[0].splits[0].stat.faceOffWinPercentage).slice(0, 10)}
                  innerRadius="10%"
                  outerRadius="80%"
                  startAngle={0}
                  endAngle={270}
                  barSize={50}
                  fill = "grey"
                  dataKey="teamStats[0].splits[0].stat.faceOffWinPercentage"
                >
                  <RadialBar dataKey="teamStats[0].splits[0].stat.faceOffWinPercentage" name = "Faceoff Win Percentage:" label={{ fill: 'black', position: 'inside' }} background clockWise={false}/>
                  <Legend />
                  <Tooltip
                  formatter={(value, name, props) => [`${props.payload.abbreviation}: ${value}%`, name]}/>
                </RadialBarChart>
              )}
            </div>
          </div>
        )}
      </DataProvider>
    </div>
  );
};

export default DataDisplay;
