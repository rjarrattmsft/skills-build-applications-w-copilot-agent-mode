import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Team = { _id?: string; name: string; mascot?: string; members: string[] };
type TeamState =
  | { status: 'loading' }
  | { status: 'success'; teams: Team[] }
  | { status: 'error' };

export default function Teams() {
  const [state, setState] = useState<TeamState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getJson<{ teams: Team[] }>('/api/teams').then(
      ({ teams }) => {
        if (active) setState({ status: 'success', teams });
      },
      () => {
        if (active) setState({ status: 'error' });
      },
    );
    return () => { active = false; };
  }, []);

  return <section aria-labelledby="teams-heading">
    <h2 id="teams-heading" className="h4">Teams</h2>
    {state.status === 'loading' && <p role="status">Loading teams...</p>}
    {state.status === 'error' && <p role="alert" className="alert alert-danger">Unable to load teams.</p>}
    {state.status === 'success' && (state.teams.length === 0
      ? <p>No teams yet.</p>
      : <div className="table-responsive">
        <table className="table" aria-labelledby="teams-heading">
          <thead><tr><th scope="col">Team</th><th scope="col">Mascot</th><th scope="col">Members</th></tr></thead>
          <tbody>{state.teams.map((team) => <tr key={team._id ?? team.name}>
            <td>{team.name}</td><td>{team.mascot ?? 'Not specified'}</td><td>{team.members.length}</td>
          </tr>)}</tbody>
        </table>
      </div>)}
  </section>;
}
