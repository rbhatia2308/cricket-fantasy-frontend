import React, { useEffect, useState } from "react";

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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
          setFilteredMatches(data.data); // initially show all
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

  const getStatusBadge = (status) => {
    const statusText = status.toLowerCase();
    if (statusText.includes("live")) return "bg-green-100 text-green-800";
    if (statusText.includes("complete")) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "All") {
      setFilteredMatches(matches);
    } else {
      const keyword = newFilter.toLowerCase();
      setFilteredMatches(
        matches.filter((match) =>
          match.status.toLowerCase().includes(keyword)
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Live Matches</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-4 space-x-2">
        {["All", "Live", "Completed", "Upcoming"].map((label) => (
          <button
            key={label}
            onClick={() => handleFilterChange(label)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === label
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dropdown (for mobile) */}
      <div className="md:hidden mb-4 text-center">
        <select
          className="px-3 py-2 border border-gray-300 rounded"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          {["All", "Live", "Completed", "Upcoming"].map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading matches...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={getLogoPath(match.t1)}
                  alt={match.t1}
                  className="w-8 h-8 object-contain inline-block"
                  style={{ maxWidth: "32px", maxHeight: "32px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logos/default.png";
                  }}
                />
                <span className="text-base font-semibold text-gray-800">{match.t1}</span>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <img
                  src={getLogoPath(match.t2)}
                  alt={match.t2}
                  className="w-8 h-8 object-contain inline-block"
                  style={{ maxWidth: "32px", maxHeight: "32px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logos/default.png";
                  }}
                />
                <span className="text-base font-semibold text-gray-800">{match.t2}</span>
              </div>

              <div className={`inline-block mt-3 px-2 py-1 text-xs font-medium rounded ${getStatusBadge(match.status)}`}>
                {match.status}
              </div>

              <p className="text-sm text-gray-500 mt-1">{match.dateTimeGMT}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchList;
