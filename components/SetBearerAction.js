import { AsyncStorage } from 'react-native'

export const setBearer = (bearer) =>
{
    AsyncStorage.setItem('@limer:bearer', bearer || '')

    return {
        type: 'SET_BEARER',
        payload: bearer,
    }
}
