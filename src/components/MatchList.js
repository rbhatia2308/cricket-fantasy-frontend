import React, { useEffect, useState } from "react";

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_CRICAPI_KEY;
        // Ensure the API key is set
        if (!apiKey) {
          console.error("CricAPI key is not set in environment variables.");
          return;
        }
        // Fetching data from CricAPI
        const response = await fetch(`https://api.cricapi.com/v1/cricScore?apikey=${apiKey}`);

      
        const data = await response.json();

        if (data.status === "success") {
          setMatches(data.data);
        } else {
          console.error("Failed to fetch matches", data);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Live Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match, index) => (
          <div key={index} className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-blue-700">{match.t1} vs {match.t2}</h3>
            <p className="text-gray-600 mt-2">{match.status}</p>
            <p className="text-sm text-gray-500 mt-1">{match.dateTimeGMT}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchList;
