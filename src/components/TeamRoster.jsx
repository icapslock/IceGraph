import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { PieChart, Pie, Tooltip, Cell, ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid, Legend, ZAxis } from "recharts";

const SEASON = '20212022';
const DEFAULT_PLAYER_IMG_URL =
  "https://cms.nhl.bamgrid.com/images/headshots/current/60x60/skater.jpg";
const PLAYER_DATA_HEADER = [
  "Player",
  "Number",
  "Position",
  "Shoot Catches",
  // "Height",
  // "Weight",
  // "Birth Date",
  // "Birthplace",
  "Goals",
  "Assists",
  "Games",
  "Shots",
  "Blocked",
  "Points"
];

const PLAYER_DATA_FIELDS = [
  "fullName",
  "primaryNumber",
  "pos",
  "shootsCatches",
  // "height",
  // "weight",
  // "birthDate",
  // "birthplace",
  "goals",
  "assists",
  "games",
  "shots",
  "blocked",
  "points"
];
  
const Player = ({ playerId }) => {
  const routerHistory = useHistory();
  const [playerData, setPlayerData] = useState(undefined);
  const [playerImgUrl, setPlayerImgUrl] = useState(
    `https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${playerId}.jpg`
  );
  const [playerStats, setPlayerStats] = useState(undefined);

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
      .then((response) => response.json())
      .then((data) => setPlayerData(data.people[0]))
      .catch((error) => console.error(error));

    fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=${SEASON}`)
      .then((response) => response.json())
      .then((data) => {
        const stats = data.stats[0].splits[0].stat;
        setPlayerStats({
          goals: stats.goals,
          assists: stats.assists,
          shots: stats.shots,
          games: stats.games,
          blocked: stats.blocked,
          points: stats.points,
        });
      })
      .catch((error) => console.error(error));
  }, [playerId]);

  if (playerData && playerStats) {
    playerData.birthplace = [
      playerData.birthCity,
      playerData.birthStateProvince, // might be undefined
      playerData.birthCountry,
    ]
      .filter((val) => val)
      .join(", ");
    playerData.pos = playerData.primaryPosition.abbreviation;
    playerData.goals = playerStats.goals;
    playerData.assists = playerStats.assists;
    playerData.games = playerStats.games;
    playerData.shots = playerStats.shots;
    playerData.blocked = playerStats.blocked;
    playerData.points = playerStats.points;
  }

  if (!playerData || !playerStats) {
    // data not loaded
    return <></>;
  }

  return (
    <tr key={playerId} onClick={() => routerHistory.push(`/Player/${playerId}`)} style={{ cursor: 'pointer' }}>
      <td>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <img
              src={playerImgUrl}
              alt="player-img"
              style={{ width: "40px", height: "40px", borderRadius: "20px" }}
              onError={() => {
                setPlayerImgUrl(DEFAULT_PLAYER_IMG_URL);
              }}
            />
          </div>
          <div style={{ paddingLeft: "20px" }}>{playerData["fullName"]}</div>
        </div>
      </td>
      {PLAYER_DATA_FIELDS.slice(1).map((field) => (
        <td key={field}>{playerData[field]}</td>
      ))}
    </tr>
  );
};
  
export const TeamRoster = () => {
  const routerHistory = useHistory();
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState({ roster: { roster: [] } });
  const [scores, setScores] = useState([])

  useEffect(() => {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/teams/${teamId}?expand=team.roster`
    )
      .then((response) => response.json())
      .then((data) => setTeamData(data.teams[0]))
      .catch((error) => console.error(error));
  }, [teamId]);

  // const s = []
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF1642'];

  // useEffect(() => {
  //   let s = [];
  //   Promise.all(
  //     teamData.roster.roster.map((v) => {
  //       return fetch(
  //         `https://statsapi.web.nhl.com/api/v1/people/${v.person.id}/stats?stats=yearByYear`
  //       )
  //         .then((response) => response.json())
  //         .then((data) => {
  //           const stats = data.stats[0].splits.find(
  //             (s) => s.season === "20212022"
  //           ).stat;
  //           return {
  //             name: v.person.fullName,
  //             score: stats.goals,
  //           };
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //           return { name: v.person.fullName, score: 0 };
  //         });
  //     })
  //   ).then((results) => {
  //     s = results.slice(0, 5);
  //     setScores(s);
  //   });
  // }, [teamData]);
  
  useEffect(() => {
    let s = [];
    Promise.all(
      teamData.roster.roster.map((v) => {
        return fetch(
          `https://statsapi.web.nhl.com/api/v1/people/${v.person.id}/stats?stats=yearByYear`
        )
          .then((response) => response.json())
          .then((data) => {
            const stats = data.stats[0].splits.find(
              (s) => s.season === "20212022"
            ).stat;
            return {
              name: v.person.fullName,
              score: stats.goals,
              shots: stats.shots
            };
          })
          .catch((error) => {
            console.error(error);
            return { name: v.person.fullName, score: 0, shots:0 };
          });
      })
    ).then((results) => {
      // Sort the results array by score in descending order and slice the top 5
      s = results.sort((a, b) => b.score - a.score).slice(0, 5);
      setScores(s);
    });
  }, [teamData]);
  

  return (
    <div>
      <div style={{ position: "relative" }}>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            position: "absolute",
            marginLeft: "20px",
          }}
          onClick={() => routerHistory.push("/DataDisplay")}
        >
          Back to Teams
        </button>
        <h1>{teamData?.teamName}</h1>
      </div>
      <table>
        <thead>
          <tr>
            {PLAYER_DATA_HEADER.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamData.roster.roster.map((player, idx) => (
            <Player playerId={player.person.id} />
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '100px', marginBottom: '100px' }}>
        <h1>
          Distribution amongst the top 5 goal scorers
        </h1>
        <PieChart width={2000} height={500}>
        <Pie data={scores} dataKey="score" nameKey="name" cx="50%" cy="50%" outerRadius={200} fill="#8884d8" label={({ name }) => name}>
          {scores.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      </div>
      <div style={{ marginTop: '100px', marginBottom: '100px' }}>
        <h1>
          Relationship Between Shots Taken and Goals Scored
        </h1>
        <ScatterChart
          width={2000}
          height={500}
          margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 10,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="shots" type="number" name="shots" unit="" />
          <YAxis dataKey="score" type="number" name="score" unit="" />
          <ZAxis dataKey="name" type="number" range={[1000, 1000]} name="name" unit="" />
          <Tooltip cursor={{ strokeDasharray: '5 5' }} />
          <Legend />
          <Scatter name="X-axis: Shots taken " data={scores} fill="#FF9900" Size={30}/>
          <Scatter name="Y-axis: Goals scored" data={scores} fill="#FF9900" Size={30}/>
        </ScatterChart>
      </div>
    </div>
  );
};

export default TeamRoster;
