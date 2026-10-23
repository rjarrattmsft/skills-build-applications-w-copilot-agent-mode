import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Workout = { _id?: string; title: string; reason: string };
type WorkoutState =
  | { status: 'loading' }
  | { status: 'success'; suggestions: Workout[] }
  | { status: 'error' };

export default function Workouts() {
  const [state, setState] = useState<WorkoutState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getJson<{ suggestions: Workout[] }>(`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`).then(
      ({ suggestions }) => {
        if (active) setState({ status: 'success', suggestions });
      },
      () => {
        if (active) setState({ status: 'error' });
      },
    );
    return () => { active = false; };
  }, []);

  return <section aria-labelledby="workouts-heading">
    <h2 id="workouts-heading" className="h4">Workout suggestions</h2>
    {state.status === 'loading' && <p role="status">Loading workout suggestions...</p>}
    {state.status === 'error' && <p role="alert" className="alert alert-danger">Unable to load workout suggestions.</p>}
    {state.status === 'success' && (state.suggestions.length === 0
      ? <p>No workout suggestions yet.</p>
      : <ul className="list-group list-group-flush">
        {state.suggestions.map((workout) => <li className="list-group-item" key={workout._id ?? workout.title}>
          <h3 className="h5">{workout.title}</h3><p className="mb-0">{workout.reason}</p>
        </li>)}
      </ul>)}
  </section>;
}
