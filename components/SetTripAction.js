export const setTrip = (trip_id, vehicle_id, started_at) =>
{
    return {
        type: 'SET_TRIP',
        payload: {
            trip_id,
            vehicle_id,
            started_at,
        }
    }
}
