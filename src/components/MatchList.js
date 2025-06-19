import React, { useEffect, useState } from "react";

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_CRICAPI_KEY;
        if (!apiKey) {
          console.error("CricAPI key is not set in environment variables.");
          return;
        }

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

  const getLogoPath = (teamName) => {
    const cleanedName = teamName?.trim().toLowerCase().replace(/ /g, "-");
    return `/logos/${cleanedName}.png`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Live Matches</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading matches...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex-shrink-0">
                <img
                  src={getLogoPath(match.t1)}
                  alt={match.t1}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logos/default.png";
                  }}
                />
                </div>
                <span className="text-base font-semibold text-gray-800">{match.t1}</span>
              </div>

              <div className="flex items-center space-x-2 mt-2">
              <div className="w-6 h-6 flex-shrink-0">
                <img
                  src={getLogoPath(match.t2)}
                  alt={match.t2}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logos/default.png";
                  }}
                />
                </div>
                <span className="text-base font-semibold text-gray-800">{match.t2}</span>
              </div>

              <p className="text-blue-700 mt-3 font-medium">{match.status}</p>
              <p className="text-sm text-gray-500 mt-1">{match.dateTimeGMT}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchList;
