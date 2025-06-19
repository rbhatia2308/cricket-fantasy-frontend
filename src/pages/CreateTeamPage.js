import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function CreateTeam() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params to get matchId and matchName
  const queryParams = new URLSearchParams(location.search);
  const matchId = queryParams.get("matchId");
  const matchName = queryParams.get("matchName");

  const [players, setPlayers] = useState([]);
  const [rules, setRules] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // Fetch players from CricAPI
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_CRICAPI_KEY;
        if (!apiKey) {
          setErrorMsg("CricAPI key missing in environment variables.");
          setLoading(false);
          return;
        }
        // Assuming an endpoint to fetch squad or players for the match
        const url = `https://api.cricapi.com/v1/match_squad?apikey=${apiKey}&id=${matchId}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "success" && data.data && data.data.players) {
          setPlayers(data.data.players);
        } else {
          setErrorMsg("Failed to fetch players for the match.");
        }
      } catch (err) {
        setErrorMsg("Error fetching players.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) fetchPlayers();
  }, [matchId]);

  // Fetch team creation rules from Firestore
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const rulesDoc = await getDoc(doc(db, "config", "teamCreationRules"));
        if (rulesDoc.exists()) {
          setRules(rulesDoc.data());
        } else {
          setErrorMsg("Team creation rules not found in config.");
        }
      } catch (err) {
        setErrorMsg("Error fetching team creation rules.");
        console.error(err);
      }
    };

    fetchRules();
  }, []);

  // Handler to select/deselect player
  const togglePlayer = (player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
    setErrorMsg("");
  };

  // Validate selected players against rules
  const validateTeam = () => {
    if (!rules) {
      setErrorMsg("Rules not loaded yet.");
      return false;
    }

    // Count players by role
    const counts = {
      WK: 0,
      BAT: 0,
      AR: 0,
      BOWL: 0,
    };

    selectedPlayers.forEach((p) => {
      const role = p.role.toUpperCase();
      if (counts[role] !== undefined) counts[role]++;
    });

    const {
      minWicketKeepers = 1,
      minBatsmen = 3,
      minAllRounders = 1,
      minBowlers = 3,
      maxPlayers = 11,
    } = rules;

    if (selectedPlayers.length !== maxPlayers) {
      setErrorMsg(`Select exactly ${maxPlayers} players.`);
      return false;
    }
    if (counts.WK < minWicketKeepers) {
      setErrorMsg(`Select at least ${minWicketKeepers} wicketkeeper(s).`);
      return false;
    }
    if (counts.BAT < minBatsmen) {
      setErrorMsg(`Select at least ${minBatsmen} batsmen.`);
      return false;
    }
    if (counts.AR < minAllRounders) {
      setErrorMsg(`Select at least ${minAllRounders} all-rounder(s).`);
      return false;
    }
    if (counts.BOWL < minBowlers) {
      setErrorMsg(`Select at least ${minBowlers} bowlers.`);
      return false;
    }

    return true;
  };

  // Save team to Firestore under current user
  const handleSaveTeam = async () => {
    if (!validateTeam()) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        setErrorMsg("You must be logged in to save a team.");
        return;
      }

      const userId = user.uid;
      const teamId = `${matchId}-${userId}`;

      await setDoc(doc(db, "users", userId, "teams", teamId), {
        matchId,
        matchName,
        players: selectedPlayers,
        createdAt: new Date(),
      });

      alert("Team created successfully!");
      navigate("/my-teams");
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to save team. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (errorMsg)
    return (
      <div className="p-4 text-center text-red-600">
        <p>{errorMsg}</p>
        <button onClick={() => setErrorMsg("")} className="mt-2 underline">
          Clear
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Team for {matchName}</h2>

      {rules && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded">
          <p>
            Team Composition Rules:
            <ul className="list-disc list-inside ml-4">
              <li>Minimum {rules.minWicketKeepers || 1} Wicketkeeper(s)</li>
              <li>Minimum {rules.minBatsmen || 3} Batsmen</li>
              <li>Minimum {rules.minAllRounders || 1} All-rounder(s)</li>
              <li>Minimum {rules.minBowlers || 3} Bowlers</li>
              <li>Total Players: {rules.maxPlayers || 11}</li>
            </ul>
          </p>
        </div>
      )}

      <p className="mb-3 font-semibold">Selected Players: {selectedPlayers.length}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[70vh] overflow-auto border border-gray-300 rounded p-3 bg-white">
        {players.length === 0 ? (
          <p>No players found for this match.</p>
        ) : (
          players.map((player) => {
            const isSelected = selectedPlayers.some((p) => p.id === player.id);
            return (
              <div
                key={player.id}
                onClick={() => togglePlayer(player)}
                className={`cursor-pointer rounded p-2 border ${
                  isSelected ? "border-emerald-600 bg-emerald-100" : "border-gray-300"
                } flex justify-between items-center`}
                title={`Role: ${player.role}`}
              >
                <span>
                  {player.name} <small className="text-gray-600">({player.role})</small>
                </span>
                {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={handleSaveTeam}
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        disabled={selectedPlayers.length === 0}
      >
        Save Team
      </button>
    </div>
  );
}

export default CreateTeam;
