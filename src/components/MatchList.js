import React, { useEffect, useState } from "react";
import teamNameMap from "../utils/teamNameMap";

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

  

const getLogoPath = (teamCode) => {
  const mappedName = teamNameMap[teamCode?.toUpperCase()];
  const logoFileName = mappedName || "default";
  return `/logos/${logoFileName}.png`;
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
  
      const filtered = matches.filter((match) => {
        const status = match.status.toLowerCase();
  
        if (keyword === "live") {
          return status.includes("live");
        } else if (keyword === "completed") {
          return status.includes("complete") || status.includes("won") || status.includes("draw");
        } else if (keyword === "upcoming") {
          return (
            status.includes("not started") ||
            status.includes("Match not started") ||
            status.includes("scheduled") ||
            status.includes("upcoming") ||
            status.includes("fixture")
          );
        }
  
        return true;
      });
  
      setFilteredMatches(filtered);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Live Matches</h2>

      <div className="flex justify-center mb-4 space-x-2">
  {["All", "Live", "Completed", "Upcoming"].map((label) => {
    const isActive = filter === label;

    let activeClasses = "";
    let inactiveClasses = "";

    switch (label) {
      case "Live":
        activeClasses = "bg-green-600 text-white";
        inactiveClasses = "bg-green-100 text-green-800 hover:bg-green-200";
        break;
      case "Completed":
        activeClasses = "bg-amber-600 text-white";
        inactiveClasses = "bg-amber-100 text-amber-800 hover:bg-amber-200";
        break;
      case "Upcoming":
        activeClasses = "bg-blue-600 text-white";
        inactiveClasses = "bg-blue-100 text-blue-800 hover:bg-blue-200";
        break;
      default: // All
        activeClasses = "bg-gray-600 text-white";
        inactiveClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300";
    }

    return (
      <button
        key={label}
        onClick={() => handleFilterChange(label)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isActive ? activeClasses : inactiveClasses
        }`}
      >
        {label}
      </button>
    );
  })}
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
