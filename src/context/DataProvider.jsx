import React, { useState, useEffect } from 'react';

const DataProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats')
      .then(response => response.json())
      .then(data => setTeams(data.teams))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      {teams.length > 0 && children(teams)}
    </>
  );
};

export default DataProvider;
