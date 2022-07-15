import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [teamRanking, setTeamRanking] = useState([]);
  const [teamString, setTeamString] = useState("");
  const [matchString, setMatchString] = useState("");

  const total_match_point = 0;
  const total_match_goal = 0;
  const alternate_total_match_point = 0;

  //Parse string input into teams
  const parseTeamString = (str) => {
    var lines = str.split("\n");
    let teams = {};
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== "") {
        let arr = lines[i].split(" ");
        let date_arr = arr[1].split("/");
        let year = new Date(Date.now()).getFullYear();
        let name = arr[0];
        let registration_date = year + "-" + date_arr[1] + "-" + date_arr[0];
        let group_number = arr[2];
        let team_obj = {
          name,
          registration_date,
          group_number,
          total_match_point,
          total_match_goal,
          alternate_total_match_point,
        };
        teams[name] = team_obj;
      }
    }
    return teams;
  };

  //Parse string input into matches
  const parseMatchString = (str) => {
    var lines = str.split("\n");
    let matches = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== "") {
        let arr = lines[i].split(" ");
        let team1 = arr[0];
        let team2 = arr[1];
        let score1 = parseInt(arr[2]);
        let score2 = parseInt(arr[3]);
        let match_obj = {
          team1,
          team2,
          score1,
          score2
        };
        matches.push(match_obj);
      }
    }
    return matches;
  };

  const handleSubmitMatches = () => {
    let teams = parseTeamString(teamString);
    let matches = parseMatchString(matchString);
    console.log(teams)
    let payload = {
      teams,
      matches
    };
    const requestUrl = `${process.env.REACT_APP_BACKEND_SERVICE}/football/post-match`;
    fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((resp) => {
        if (resp.ok) {
          resp.json().then((response) => {
            console.log(response.team_ranking)
            setTeamRanking(response.team_ranking)
          });
        } else {
          console.log("Failed to update results");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="App-container">
      <div className="Form-container">
        <div className="Form-row">
          <label className="Form-label">Enter Team here:</label>
          <textarea
            className="Form-input"
            type="text"
            autoFocus
            value={teamString}
            onChange={(e) => setTeamString(e.target.value)}
            rows={12}
          />
        </div>
        <div className="Form-row">
          <label className="Form-label">Enter Match here:</label>
          <textarea
            className="Form-input"
            type="text"
            autoFocus
            value={matchString}
            onChange={(e) => setMatchString(e.target.value)}
            rows={15}
          />
        </div>
        <div className="Form-row">
          <button
            className="Form-button"
            disabled={matchString === "" || teamString === ""}
            onClick={handleSubmitMatches}
          >
            Submit Result
          </button>
        </div>
        {teamRanking.length === 0 ? (
          <div />
        ) : (
          <div className="Form-row">
            <h5>hello results</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
