import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Activity = { _id?: string; type: string; minutes: number; points: number };
type ActivityState =
  | { status: 'loading' }
  | { status: 'success'; activities: Activity[] }
  | { status: 'error' };

export default function Activities() {
  const [state, setState] = useState<ActivityState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getJson<{ activities: Activity[] }>('/api/activities').then(
      ({ activities }) => {
        if (active) setState({ status: 'success', activities });
      },
      () => {
        if (active) setState({ status: 'error' });
      },
    );
    return () => { active = false; };
  }, []);

  return <section aria-labelledby="activities-heading">
    <h2 id="activities-heading" className="h4">Activities</h2>
    {state.status === 'loading' && <p role="status">Loading activities...</p>}
    {state.status === 'error' && <p role="alert" className="alert alert-danger">Unable to load activities.</p>}
    {state.status === 'success' && (state.activities.length === 0
      ? <p>No activities yet.</p>
      : <div className="table-responsive">
        <table className="table" aria-labelledby="activities-heading">
          <thead><tr><th scope="col">Activity</th><th scope="col">Minutes</th><th scope="col">Points</th></tr></thead>
          <tbody>{state.activities.map((activity, index) => <tr key={activity._id ?? index}>
            <td>{activity.type}</td><td>{activity.minutes}</td><td>{activity.points}</td>
          </tr>)}</tbody>
        </table>
      </div>)}
  </section>;
}
