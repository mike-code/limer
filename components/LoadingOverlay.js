import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export default class LoadingOverlay extends React.Component
{
    render() {
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
            }}>
                <ActivityIndicator size='large' color='yellow' />
            </View>
        )
    }
}
