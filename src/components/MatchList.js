import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import teamNameMap from "../utils/teamNameMap";
import HomeButton from "../components/HomeButton"; // 🔁 ✅ ADDED this import

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

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
          setFilteredMatches(data.data);
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

  const getLogoPath = (teamDisplayName) => {
    const abbreviationMatch = teamDisplayName?.match(/\[(.*?)\]/);
    const abbreviation = abbreviationMatch ? abbreviationMatch[1].toUpperCase() : teamDisplayName?.toUpperCase();
    const mappedName = teamNameMap[abbreviation];
    const logoFileName = mappedName || "default";
    return `/logos/${logoFileName.toLowerCase()}.png`;
  };

  const getStatusBadge = (status) => {
    const statusText = status.toLowerCase();
    if (statusText.includes("live")) return "bg-green-100 text-green-800";
    if (statusText.includes("complete")) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilterAndSearch(matches, newFilter, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilterAndSearch(matches, filter, query);
  };

  const applyFilterAndSearch = (matchList, filterType, query) => {
    let result = [...matchList];

    if (filterType !== "All") {
      const keyword = filterType.toLowerCase();
      result = result.filter((match) => {
        const status = match.status.toLowerCase();
        if (keyword === "live") return status.includes("live");
        if (keyword === "completed") return status.includes("complete") || status.includes("won") || status.includes("draw");
        if (keyword === "upcoming") return (
          status.includes("not started") || status.includes("scheduled") ||
          status.includes("upcoming") || status.includes("fixture")
        );
        return true;
      });
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (match) =>
          match.t1.toLowerCase().includes(lowerQuery) ||
          match.t2.toLowerCase().includes(lowerQuery) ||
          match.status.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredMatches(result);
  };

  const handleCreateContest = (matchId, matchName) => {
    navigate(`/create-contest?matchId=${matchId}&matchName=${encodeURIComponent(matchName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <HomeButton /> {/* 🔁 ✅ ADDED Home Button at the top of the page */}

      <h2 className="text-2xl font-bold text-center mb-6">Live Matches</h2>

      {/* 🔍 Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search matches..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
        />
      </div>

      {/* Filter Buttons */}
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
            default:
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

      {/* Mobile dropdown */}
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

      {/* Match Cards */}
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

              <div
                className={`inline-block mt-3 px-2 py-1 text-xs font-medium rounded ${getStatusBadge(match.status)}`}
              >
                {match.status}
              </div>

              <p className="text-sm text-gray-500 mt-1">{match.dateTimeGMT}</p>

              {/* Create Contest Button */}
              <button
                onClick={() => handleCreateContest(match.id, `${match.t1} vs ${match.t2}`)}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-full"
              >
                Create Contest
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchList;

