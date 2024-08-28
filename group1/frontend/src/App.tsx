import "./styles/App.css";
import LoginPage from "./pages/LoginPage";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
import Tester from "./pages/Tester";
import { ChoosePage } from "./admin/Menu";
import { Routes, Route } from "react-router-dom";
import {Suspense, useEffect} from "react";
import React from "react";
import {DataFetching, LoadingPage} from "./pages/Loading";

/**
 * The main App component.
 */
function App(): React.ReactElement {
  useEffect(() => {
    document.title = 'MSOE Wordle';
  });

  return (
    <Suspense fallback={<LoadingPage/>} >
      <div className="App">
        {<ChoosePage/>}
        {<DataFetching/>}
        <Routes>
          {/* on load redirect to log in when not logged in, if logged in redirect to game */}

          <Route path="/" element={<LoginPage/>}/>
          <Route path="/game" element={<Game/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/tester" element={<Tester/>}/>
          <Route path="/stat" element={<div>Stats Here</div>}/>
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
