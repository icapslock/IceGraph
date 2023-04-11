import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { PlayerShotHeatmap } from '../components/PlayerShotHeatmap';

const DEFAULT_PLAYER_IMG_URL = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/skater.jpg";

export const PlayerStats = () => {
  const { playerId } = useParams();
  const routerHistory = useHistory();

  const [playerStats, setPlayerStats] = useState({});
  const [playerImgUrl, setPlayerImgUrl] = useState(`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerId}.jpg`);

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
      .then((response) => response.json())
      .then((data) => {
        const stats = ["fullName", "primaryNumber"];
        const playerStats = stats.reduce((ret, field) => {
          ret[field] = data['people'][0][field];
          return ret;
        }, {});
        setPlayerStats(playerStats);
      })
      .catch((error) => console.error(error));
  }, [playerId]);

  return (
    <div>
      <div>
        <button
          style={{
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            margin: "1rem",
          }}
          onClick={() => routerHistory.goBack()}
        >Back</button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h1>{`${playerStats.fullName} #${playerStats.primaryNumber}`}</h1>
          <div>
            <img
              src={playerImgUrl}
              alt="player-img"
              style={{ width: "168px", height: "168px", borderRadius: "84px", marginLeft: 'auto', marginRight: 'auto' }}
              onError={() => {
                setPlayerImgUrl(DEFAULT_PLAYER_IMG_URL);
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <PlayerShotHeatmap playerId={Number(playerId)} />
        </div>
      </div>
    </div>
  );
}
