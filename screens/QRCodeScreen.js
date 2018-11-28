import React from 'react'
import {
    StyleSheet,
    View,
    VibrationIOS,
} from 'react-native'
import { Camera } from 'expo'

export default class QRCodeScreen extends React.Component
{
    readBarCode = true

    _onBarCodeRead(result)
    {
        if(!this.readBarCode) return

        this.readBarCode = false

        console.log(`Found QR string [${result.data}]`)
        VibrationIOS.vibrate()

        this.props.navigation.getParam('prev_screen').setState({unlock_code: result.data.replace('https://lime.bike/bc/v1/', '')})
        this.props.navigation.pop()
    }

    render()
    {
        return (
            <View style={{flex: 1}}>
                <Camera
                    flashMode='torch'
                    onBarCodeScanned={this._onBarCodeRead.bind(this)}
                    style={{ flex: 1, alignItems: 'center' }}
                >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}/>
                    </View>
                </Camera>
            </View>
        )
    }
}

var styles = StyleSheet.create(
{
    rectangleContainer:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    rectangle:
    {
        height: 210,
        width: 210,
        borderWidth: 6,
        borderStyle: 'dashed',
        borderRadius: 30,
        borderColor: 'rgba(120,120,120,0.7)',
        backgroundColor: 'transparent',
    },
})
