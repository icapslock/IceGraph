import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

const DEFAULT_PLAYER_IMG_URL =
  "https://cms.nhl.bamgrid.com/images/headshots/current/60x60/skater.jpg";

const PLAYER_DATA_HEADER = [
  "Player",
  "Number",
  "Position",
  "Shoot Catches",
  "Height",
  "Weight",
  "Birth Date",
  "Birthplace",
];
const PLAYER_DATA_FIELDS = [
  "fullName",
  "primaryNumber",
  "pos",
  "shootsCatches",
  "height",
  "weight",
  "birthDate",
  "birthplace",
];

const Player = ({ playerId }) => {
  const [playerData, setPlayerData] = useState(undefined);
  const [playerImgUrl, setPlayerImgUrl] = useState(
    `https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${playerId}.jpg`
  );
  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
      .then((response) => response.json())
      .then((data) => setPlayerData(data.people[0]))
      .catch((error) => console.error(error));
  }, [playerId]);

  if (playerData) {
    playerData.birthplace = [
      playerData.birthCity,
      playerData.birthStateProvince, // might be undefined
      playerData.birthCountry,
    ]
      .filter((val) => val)
      .join(", ");
    playerData.pos = playerData.primaryPosition.abbreviation;
  }

  if (!playerData) {
    // data not loaded
    return <></>;
  }
  return (
    <tr key={playerId}>
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

  useEffect(() => {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/teams/${teamId}?expand=team.roster`
    )
      .then((response) => response.json())
      .then((data) => setTeamData(data.teams[0]))
      .catch((error) => console.error(error));
  }, [teamId]);

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
    </div>
  );
};
