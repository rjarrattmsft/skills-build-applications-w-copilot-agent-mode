import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type LeaderboardEntry = { teamName: string; totalPoints: number; rank: number };
type LeaderboardState =
  | { status: 'loading' }
  | { status: 'success'; leaderboard: LeaderboardEntry[] }
  | { status: 'error' };

export default function Leaderboard() {
  const [state, setState] = useState<LeaderboardState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getJson<{ leaderboard: LeaderboardEntry[] }>('/api/leaderboard').then(
      ({ leaderboard }) => {
        if (active) setState({ status: 'success', leaderboard });
      },
      () => {
        if (active) setState({ status: 'error' });
      },
    );
    return () => { active = false; };
  }, []);

  return <section aria-labelledby="leaderboard-heading">
    <h2 id="leaderboard-heading" className="h4">Leaderboard</h2>
    {state.status === 'loading' && <p role="status">Loading leaderboard...</p>}
    {state.status === 'error' && <p role="alert" className="alert alert-danger">Unable to load leaderboard.</p>}
    {state.status === 'success' && (state.leaderboard.length === 0
      ? <p>No rankings yet.</p>
      : <div className="table-responsive">
        <table className="table" aria-labelledby="leaderboard-heading">
          <thead><tr><th scope="col">Rank</th><th scope="col">Team</th><th scope="col">Points</th></tr></thead>
          <tbody>{state.leaderboard.map((entry) => <tr key={entry.rank}>
            <td>{entry.rank}</td><td>{entry.teamName}</td><td>{entry.totalPoints}</td>
          </tr>)}</tbody>
        </table>
      </div>)}
  </section>;
}
