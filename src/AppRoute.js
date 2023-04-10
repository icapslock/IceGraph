// import React from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import { Landing } from "./pages/Landing";
// import DataProvider from './context/DataProvider';
// import DataDisplay from './pages/DataDisplay';

// const AppRouter = () => (
//   <Router>
//     <div>
//       <Route exact path="/" component={Landing} />
//       <Route
//         path="./pages/DataDisplay"
//         render={() => (
//             <DataProvider>
//                 <DataDisplay />
//             </DataProvider>
//         )}
//       />
//     </div>
//   </Router>
// );
// export default AppRouter;

// import React from 'react';
// import DataProvider from './context/DataProvider';

// const App = () => {
//   return (
//     <div>
//       <h1>NHL Teams</h1>
//       <DataProvider />
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import DataDisplay from "./pages/DataDisplay";
import { TeamRoster } from "./components/TeamRoster";
import { PlayerGoalHeatmap } from "./components/PlayerGoalHeatmap";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/DataDisplay" component={DataDisplay} />
        <Route path="/TeamRoster/:teamId" component={TeamRoster} exact />
        <Route path="/TeamRoster/:teamId/:playerId" component={PlayerGoalHeatmap} />
      </Switch>
    </Router>
  );
}

export default App;
