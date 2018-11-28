export default EbinReducer = (state = null, action) =>
{
    console.log(`Setting [${action.type}] Data [${JSON.stringify(action.payload)}]`)

    switch (action.type)
    {
        case 'SET_BEARER':
            return { ...state, bearer: action.payload }

        case 'SET_TRIP':
            return { ...state, trip_id: action.payload.trip_id, vehicle_id: action.payload.vehicle_id, started_at: action.payload.started_at }

        default:
            return state
    }
}
