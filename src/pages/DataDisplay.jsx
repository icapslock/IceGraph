import React from "react";
import { useHistory } from "react-router-dom";
import DataProvider from "../context/DataProvider";
import "../DataDisplay.css";
import ComparitiveChart from "../components/ComparitiveChart";
import LineChart2 from "../components/LineChart2";

const DataDisplay = () => {
  const routerHistory = useHistory();
  const renderTable = (teams) => {
    return (
      <div className="data-table" style={{ overflowX: "auto !important" }}>
  <table className="data-table">
    <thead>
      <tr>
        <th>Team Id</th>
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
            <td>{team.id}</td>
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
          </div>
        )}
      </DataProvider>
    </div>
  );
};

export default DataDisplay;
