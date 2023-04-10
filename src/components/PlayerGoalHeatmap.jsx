import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { hexbin } from 'd3-hexbin';
import * as d3 from "https://cdn.skypack.dev/d3-selection@3";

const SEASON = '20212022';

export const PlayerGoalHeatmap = () => {
  let { teamId, playerId } = useParams();
  teamId = Number(teamId);
  playerId = Number(playerId);
  const [data, setData] = useState(undefined);
  const ref = useRef();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${teamId}&season=${SEASON}`);
      const data = await response.json();
      const gameIds = data['dates'].flatMap(date => date['games'].map(game => game['gamePk']));
  
      const teamData = {
        'Shot': [],
        'Goal': [],
      };
  
      const playerData = {
        'Shot': [],
        'Goal': [],
      };
  
      await Promise.all(gameIds.slice(0, 2).map(async gameId => {
        const response = await fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`);
        const data = await response.json();
        if (!data['liveData']) {
          return;
        }
        data['liveData']['plays']['allPlays']
          .filter(playEvent => ['Shot', 'Goal'].includes(playEvent['result']['event']) && playEvent['team']['id'] == teamId)
          .map(playEvent => {
            const { coordinates } = playEvent;
            if (!coordinates) {
              return;
            }
  
            const event = playEvent['result']['event'];
            const scorerId = playEvent['players'].filter(player => ['Scorer', 'Shooter'].includes(player['playerType']))[0]['player']['id'];
            teamData[event].push(coordinates);
            if (scorerId === playerId) {
              playerData[event].push(coordinates);
            }
          });
      }));

      // transform { x, y } to [x, y], and make all negative value to positive
      const normalizeData = dataArray => {
        dataArray.forEach((val, index) => {
          const { x, y } = val;
          dataArray[index] = [Math.abs(x), Math.abs(y)];
        });
      };
      [teamData.Goal, teamData.Shot, playerData.Goal, playerData.Shot].forEach(dataArray => normalizeData(dataArray));

      return { teamData, playerData };
    }
    fetchData().then(data => {
      setData(data);
    });
  }, [teamId, playerId]);

  useEffect(() => {
    if (!data) {
      return;
    }
    // plot hexbin
    const svg = d3.select(ref.current);

    // Generate the hexagon bins
    // const hexbinFunc = hexbin()
    //   .radius(5)
    //   .size([100, 100]);

    // Create the SVG element for the hexagons

    const a = hexbin();
    console.log(a(data.teamData.Goal));
    
    console.log('svg done');
  }, [data]);


  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      <svg
        ref={ref}
      />
    </div>
  );
};
