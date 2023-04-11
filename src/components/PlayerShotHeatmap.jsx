import React, { useEffect, useState } from "react";
import { interpolateRgb } from "d3-interpolate";

const SEASON = "20212022";

export const PlayerShotHeatmap = ({ playerId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(playerId).then((playerData) => {
      const shotBin = linearBin(playerData.Shot, 10);
      const goalBin = linearBin(playerData.Goal, 10);
      const heatmapData = getShotGoalPercentage(shotBin, goalBin);
      setData(heatmapData);
    });
  }, [playerId]);

  const getColor = (percentage) => {
    const threshold = 0.3;
    if (percentage < threshold) {
      return interpolateRgb("#ff0000", "#fff400")(percentage / threshold);
    } else {
      return interpolateRgb(
        "#fff400",
        "#00ff00"
      )((percentage - threshold) / (1 - threshold));
    }
  };

  return (
    <div id="heatmap-container" style={{ position: "relative" }}>
      <img
        src={`${process.env.PUBLIC_URL}/court.png`}
        alt="court"
        style={{ zIndex: 0 }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <div style={{ position: "relative", width: "520px", height: "619px" }}>
          {data.map(({ cx, cy, numShot, percentage }, i) => {
            numShot = numShot > 8 ? 8 : numShot;
            const radius = `${numShot * 3}px`;
            const diameter = `${numShot * 6}px`;
            const bottom = `${Math.floor((cy + 42.5) / 0.85) - numShot}%`;
            const left = `${cx + numShot}%`;
            const color = getColor(percentage);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom,
                  left,
                  width: diameter,
                  height: diameter,
                  backgroundColor: color,
                  borderRadius: radius,
                }}
                title={`x = ${cx}, y = ${cy}, # shots: ${numShot}, % goal: ${
                  percentage * 100
                }%`}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

async function fetchData(playerId) {
  const response = await fetch(
    `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=${SEASON}`
  );
  const data = await response.json();
  const gameIds = data["stats"][0]["splits"].map(
    (split) => split["game"]["gamePk"]
  );

  const playerData = {
    Shot: [],
    Goal: [],
  };

  await Promise.all(
    gameIds.map(async (gameId) => {
      const response = await fetch(
        `https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`
      );
      const data = await response.json();
      if (!data["liveData"]) {
        return;
      }
      data["liveData"]["plays"]["allPlays"]
        .filter((playEvent) =>
          ["Shot", "Goal"].includes(playEvent["result"]["event"])
        )
        .forEach((playEvent) => {
          const { coordinates } = playEvent;
          const scorerId = playEvent["players"].filter((player) =>
            ["Scorer", "Shooter"].includes(player["playerType"])
          )[0]["player"]["id"];
          if (!coordinates || scorerId !== playerId) {
            return;
          }

          const event = playEvent["result"]["event"];
          playerData[event].push(coordinates);
        });
    })
  );

  const transformData = (coordinates) => {
    return coordinates.map((coord) => {
      return coord.x > 0 ? coord : { x: -coord.x, y: -coord.y };
    });
  };

  // Apply data transform to all entries
  return Object.entries(playerData).reduce((ret, [key, value]) => {
    ret[key] = transformData(value);
    return ret;
  }, {});
}

function linearBin(data, binSize) {
  // const [[xMin, yMin], [xMax, yMax]] = [[0, -42.5], [100, 42.5]]; // the boundaries [bottomLeft, topRight]

  const binnedData = {}; // { [center: string]: number }, center -> `${x},${y}`

  for (const { x, y } of data) {
    const xBinIndex = Math.floor(x / binSize);
    const yBinIndex = Math.floor(y / binSize);
    const center = `${xBinIndex * binSize},${yBinIndex * binSize}`;
    if (!binnedData[center]) {
      binnedData[center] = 0;
    }
    binnedData[center]++;
  }

  return binnedData;
}

// return { cx: number, cy: number, numShot: number, percentage: number }[]
function getShotGoalPercentage(shotBin, goalBin) {
  return Object.keys(shotBin).map((center) => {
    const numShot = shotBin[center];
    const percentage = goalBin[center] ? goalBin[center] / numShot : 0;
    const [x, y] = center.split(",");
    return { cx: Number(x), cy: Number(y), numShot, percentage };
  });
}
