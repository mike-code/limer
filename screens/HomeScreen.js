import React from 'react'
import axios from 'axios'
import {
    AlertIOS,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
 } from 'react-native'
import Colors from '../constants/Colors'
import LoadingOverlay from '../components/LoadingOverlay'
import { ListItem } from 'react-native-elements'
import { setTrip } from '../components/SetTripAction'
import { Constants } from 'expo';
import { connect } from 'react-redux'
import { sprintf } from 'sprintf-js'

class HomeScreen extends React.Component
{
    constructor(params)
    {
        super(params)

        this.state =
        {
            unlock_code: '',
            loading    : false,
            duration   : 0,
        }

        this.getTime = setInterval(() =>
        {
            if(!this.props.started_at)
            {
                this.setState({duration: 0})
                return
            }

            let start    = new Date(this.props.started_at)
            let end      = new Date()
            let duration = Math.ceil((end - start)/1000)

            this.setState({duration})
        }, 200)
    }

    static navigationOptions =
    {
        title: 'Back',
    }

    render()
    {
        const { manifest } = Constants;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleTextContainer}>
                        <Text style={styles.nameText} numberOfLines={1}>{manifest.name}</Text>
                        <Text style={styles.slugText} numberOfLines={1}>{manifest.description}</Text>

                        <Text style={styles.descriptionText}>
                        {__DEV__ ? 'DEVELOPMENT MODE' : 'PRODUCTION MODE'}
                        </Text>
                    </View>

                    <View style={styles.titleIconContainer}>
                        <TouchableOpacity onPress={this._OpenCameraView.bind(this)}>
                            <Image
                                source={{ uri: manifest.iconUrl }}
                                style={{ width: 64, height: 64 }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingTop: 25, flex: 1 }}>
                    <ListItem
                        title={(
                            <TextInput
                                clearButtonMode="always"
                                style={{ fontSize: 18 }}
                                keyboardType = 'decimal-pad'
                                placeholder="Code goes here..."
                                value={this.state.unlock_code}
                                onChangeText={text => this.setState({ unlock_code: text })}
                            />
                        )}
                        topDivider={true}
                        bottomDivider={true}
                    />
                    <ListItem
                        onPress={this._UnlockVehicle.bind(this)}
                        title={'Unlock vehicle'}
                        titleStyle={{ color: Colors.tintColor }}
                        bottomDivider={true}
                        chevron={true}
                    />

                    {this.props.trip_id && (
                        <View style={{ paddingTop: 30 }}>
                            <ListItem
                                title={'Ongoing trip'}
                                subtitle={this.props.trip_id}
                                subtitleStyle={{ color: Colors.tintColor }}
                                topDivider={true}
                                bottomDivider={true}
                                chevron={false}
                                rightTitle={sprintf('%02d:%02dm', Math.floor(this.state.duration/60), this.state.duration%60)}
                            />
                            <ListItem
                                onPress={this._EndTrip.bind(this)}
                                title={'End this trip'}
                                titleStyle={{ color: Colors.errorText }}
                                bottomDivider={true}
                                chevron={true}
                            />
                        </View>
                    )}

                    {this.state.loading && (<LoadingOverlay />)}
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _OpenCameraView()
    {
        this.props.navigation.navigate('QRCodeScreen', { prev_screen: this })
    }

    _EndTrip()
    {
        this.setState({ loading: true })

        axios.post('https://web-production.lime.bike/api/rider/v1/views/in_trip?end_trip=true')
        .then(({data}) => {
            let user = data.data.attributes.user.attributes
            let trip = data.data.attributes.trip.attributes

            let trip_status   = trip.status
            let trip_duration = trip.duration_seconds
            let cost          = trip.cost_amount.display_string
            let remain        = user.balance.display_string

            if(trip_status != 'completed')
            {
                alert('Trip not completed')
                return
            }

            this.props.setTrip(null, null, null)

            AlertIOS.alert(
                'Trip Complete',
                `Duration [${trip_duration}]; Cost [${cost}]; Remains [${remain}]`
            );
        })
        .catch(e => alert(JSON.stringify(e.response.data)))
        .finally(() => this.setState({ loading: false }))
    }

    _UnlockVehicle()
    {
        this.setState({loading: true})
        let unlock_code = this.state.unlock_code

        if(Number.isInteger(unlock_code - 0))
        {
            unlock_data = { plate_number: unlock_code }
        }
        else
        {
            unlock_data = { qr_code_token: unlock_code }
        }

        console.log(`Unlocking bike #[${JSON.stringify(unlock_data)}]`)

        axios.post('https://web-production.lime.bike/api/rider/v1/trips', unlock_data)
        .then(({data}) =>
        {
            let trip_id    = data.data.id
            let bike       = data.data.attributes.bike
            let status     = data.data.attributes.status
            let started_at = data.data.attributes.started_at

            if(!trip_id || !bike || status != 'started')
            {
                alert('Bike NULL or wrong status or no trip ID')
                return
            }

            this.props.setTrip(trip_id, bike.id, started_at)
        })
        .catch(e => alert(JSON.stringify(e.response.data)))
        .finally(() => this.setState({ loading: false }))
    }
}

const mapStateToProps = state => ({
        bearer_token: state && state.bearer,
        trip_id:      state && state.trip_id,
        vehicle_id:   state && state.vehicle_id,
        started_at:   state && state.started_at,
})

export default connect(mapStateToProps, {setTrip})(HomeScreen)

const styles = StyleSheet.create(
{
    container: {
        flex: 1,
        backgroundColor: '#fbfbfb',
    },
    titleContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 45,
        paddingBottom: 15,
        flexDirection: 'row',
        shadowColor: 'black',
            shadowOffset: { height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
    },
    titleIconContainer: {
        marginLeft: 15,
        paddingTop: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameText: {
        fontWeight: '600',
        fontSize: 18,
    },
    slugText: {
        color: '#a39f9f',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    descriptionText: {
        fontSize: 14,
        marginTop: 6,
        color: '#4d4d4d',
    },
})
