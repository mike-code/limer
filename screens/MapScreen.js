import React from 'react'
import axios from 'axios'
import {
    TouchableOpacity,
    View,
} from 'react-native'
import LoadingOverlay from '../components/LoadingOverlay'
import { MapView } from 'expo'
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { sprintf } from 'sprintf-js'

class MapScreen extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state =
        {
            lat: 0,
            lon: 0,
            followLocation: true,
            markers: [],
            loading: false,
        }
    }

    static navigationOptions = ({navigation}) =>
    {
        let { params = {} } = navigation.state

        return {
            title: 'Map',
            headerRight: (
                <TouchableOpacity onPress={() => params.me._FetchMarkers(params)}>
                    <View style={{flex: 1}}>
                        <Ionicons
                            name='ios-refresh'
                            size={32}
                            style={{marginRight: 16, marginTop: 6}}
                            color='rgba(0, 122, 255, 0.8)'
                        />
                    </View>
                </TouchableOpacity>
            )
        }
    }

    componentDidMount()
    {
        this.props.navigation.setParams({me: this})

        navigator.geolocation.getCurrentPosition(
            pos         => console.log(`Got geoposition [${pos.coords.latitude}] [${pos.coords.longitude}]`),
            ({message}) => console.error(`Could not get geoposition [${message}]`),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
        )

        setTimeout(() => this.setState({ followLocation: false }), 5000)
    }

    render()
    {
        return (
            <View style={{flex: 1}}>
                <MapView
                    style={{ flex: 1 }}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    showsCompass={true}
                    showsScale={false}
                    rotateEnabled={false}
                    zoomEnabled={true}
                    onRegionChange={ reg => this.props.navigation.setParams({ current_region: reg }) }
                    followsUserLocation={this.state.followLocation}
                >
                    {this.state.markers.map((d) =>
                        {
                            return (
                                <MapView.Marker
                                key={d.key}
                                coordinate={{
                                    latitude: d.lat,
                                    longitude: d.lon,
                                }}
                                title={d.key}
                                description={ sprintf('%0.2fkm | XXX-%d', d.range/1000, d.last_three) }
                                pinColor={ d.battery === 'high' ? 'green' : d.battery === 'low' ? 'red' : 'yellow' }
                            />
                            )
                        })}
                </MapView>
                {this.state.loading && (<LoadingOverlay />)}
            </View>
        )
    }

    _FetchMarkers(navigation_params)
    {
        const $me = navigation_params.me

        if($me.state.loading) return

        let reg = navigation_params.current_region
        let params =
        {
            ne_lat: reg.latitude + reg.latitudeDelta,
            ne_lng: reg.longitude + reg.longitudeDelta,
            sw_lat: reg.latitude - reg.latitudeDelta,
            sw_lng: reg.longitude - reg.longitudeDelta,
            user_latitude: reg.latitude,
            user_longitude: reg.longitude,
            zoom: 15,
        }

        $me.setState({ loading: true })

        axios.get('https://web-production.lime.bike/api/rider/v1/views/map', { params })
        .then( ({data}) =>
        {
            if(!data.data.attributes.bikes)
            {
                alert('No bikes found')
                return
            }

            console.log(data.data.attributes.bikes.length)

            let markers = data.data.attributes.bikes.map(b => ({
                lat: b.attributes.latitude,
                lon: b.attributes.longitude,
                key: b.id,
                battery: b.attributes.battery_level,
                range: b.attributes.meter_range,
                last_three: b.attributes.last_three,
            }))

            $me.setState({ markers })
        })
        .catch(e => alert(JSON.stringify(e.response.data)))
        .finally(() => $me.setState({ loading: false }))
    }
}

const mapStateToProps = state => ({ })

export default connect(mapStateToProps)(MapScreen)
