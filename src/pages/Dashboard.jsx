import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Dashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charity, setCharity] = useState(false);
  const [totalDonation, setTotalDonation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [drawCount, setDrawCount] = useState(0);

  // get user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // fetch scores after user loads
  useEffect(() => {
    if (user) fetchScores();
  }, [user]);

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) console.log(error);
    else setScores(data);
  };

  const addScore = async () => {
    if (loading) return;
    setLoading(true);

    if (!user) {
      alert("User not loaded yet");
      setLoading(false);
      return;
    }

    const num = parseInt(score);

    if (!num || num < 1 || num > 45) {
      alert("Score must be between 1–45");
      setLoading(false);
      return;
    }

    // prevent immediate duplicate
    if (scores.length > 0 && scores[0].score === num) {
      alert("Same score just added!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: num,
      },
    ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (charity) {
      setTotalDonation((prev) => prev + 10);
    }

    setScore("");
    await fetchScores();
    setLoading(false);
  };

  const drawWinner = () => {
  if (scores.length === 0) {
    alert("No scores available!");
    return;
  }

  let newWinner;

  do {
    const randomIndex = Math.floor(Math.random() * scores.length);
    newWinner = scores[randomIndex].score;
  } while (newWinner === winner && scores.length > 1);

  setWinner(newWinner);
  setDrawCount(prev => prev + 1);
};

  return (
  <div className="p-6">
    
    {/* Top bar */}
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <button
        className="bg-red-500 text-white px-4 py-2"
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>

    {/* Charity toggle */}
    <div className="mt-4">
      <label>
        <input
          type="checkbox"
          checked={charity}
          onChange={() => setCharity(!charity)}
        />
        {" "}Donate ₹10 per score ❤️
      </label>
    </div>

    {/* Score input */}
    <div className="mt-4">
      <input
        className="border p-2 mr-2"
        placeholder="Enter score (1–45)"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={addScore}
        disabled={!user || loading}
      >
        {loading ? "Adding..." : "Add Score"}
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 ml-2"
        onClick={drawWinner}
      >
        Draw Result 🎯
      </button>
    </div>

    {/* Scores */}
    <div className="mt-6">
      <h2 className="text-xl font-bold">Your Scores</h2>

      {scores.map((s) => (
        <div key={s.id} className="border p-2 mt-2">
          Score: {s.score}
        </div>
      ))}
    </div>

    {/* Donation */}
    <div className="mt-4">
      <h2 className="text-lg font-bold">
        Total Donation: ₹{totalDonation}
      </h2>
    </div>

    {/* Best Score */}
    <div className="mt-4">
      <h2 className="text-lg font-bold">
        Best Score:{" "}
        {scores.length > 0
          ? Math.min(...scores.map((s) => s.score))
          : "-"}
      </h2>
    </div>

    {/* Winner */}
    {winner && (
      <div className="mt-4 p-3 bg-yellow-200">
        🎉 Winning Score: {winner} (Draw #{drawCount})
      </div>
    )}
  </div>
);
}