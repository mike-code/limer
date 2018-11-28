import React from 'react'
import axios from 'axios'
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { ListItem } from 'react-native-elements'
import { setBearer } from '../components/SetBearerAction'
import { setTrip } from '../components/SetTripAction'
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import styles from './css/ControlPanel_css'

class ControlPanelScreen extends React.Component
{
    constructor(params)
    {
        super(params)

        this.state =
        {
            userData: {},
            spinner_running: false,
            phone_no: '+64220477668',
            sms_code: '',
        }
    }

    componentDidMount()
    {
        this._checkBalance()
    }

    isLoggedIn() {
        return this.state.userData && !!this.state.userData.attributes;
    }

    render()
    {
        const user_data = this.state.userData.attributes

        return (
            <TouchableWithoutFeedback onPress={() => {console.log('touched!'); Keyboard.dismiss()}} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={
                                __DEV__
                                ? require('../assets/images/1up_dev.png')
                                : require('../assets/images/1up.png')
                            }
                            style={styles.welcomeImage}
                        />
                    </View>

                    <ListItem
                        title={(
                            <TextInput
                                ref="phone_no_input"
                                clearButtonMode="always"
                                style={{ fontSize: 18 }}
                                keyboardType = 'phone-pad'
                                placeholder="+64 12 345 6789"
                                value={this.state.phone_no}
                                onChangeText={text => this.setState({ phone_no: text })}
                            />
                        )}
                        topDivider={true}
                        bottomDivider={true}
                    />
                    <ListItem
                        onPress={this._RequestCode.bind(this)}
                        title={'Request Code'}
                        titleStyle={{ color: Colors.tintColor }}
                        bottomDivider={true}
                        chevron={true}
                    />
                    <ListItem
                        title={(
                            <TextInput
                                clearButtonMode="always"
                                style={{ fontSize: 18 }}
                                keyboardType = 'decimal-pad'
                                placeholder="123456"
                                value={this.state.sms_code}
                                onChangeText={(text) => this.setState({ sms_code: text })}
                            />
                        )}
                        bottomDivider={true}
                    />
                    <ListItem
                        onPress={ this._LogIn.bind(this) }
                        title={'Log-Me-In!'}
                        titleStyle={{ color: Colors.tintColor }}
                        bottomDivider={true}
                        chevron={true}
                    />

                    {this.isLoggedIn() && (
                        <ListItem
                            onPress={this._LogOut.bind(this)}
                            title={'Log-Me-Out'}
                            titleStyle={{ color: Colors.errorText }}
                            topDivider={true}
                            bottomDivider={true}
                            chevron={true}
                            style={{ marginTop: 30 }}
                        />)
                    }

                    <View style={styles.tabBarInfoContainer}>
                        {
                            this.state.spinner_running ?
                            (
                                <ActivityIndicator style={{ marginVertical: 20 }} animating={this.state.spinner_running} size="large" color="#0000ff" />
                            )
                            : this.isLoggedIn() ?
                            (
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <TouchableOpacity onPress={() => this._checkBalance()}>
                                        <Ionicons
                                            name='ios-refresh'
                                            size={64}
                                            style={{ marginRight: 30, marginLeft: 30, marginTop: 6 }}
                                            color={Colors.tintColor}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                        {this.props.trip_id ?
                                        (
                                            <Text style={{ color: Colors.errorText }}>{this.props.trip_id}</Text>

                                        )
                                        :
                                        (
                                            <Text>No trip running</Text>
                                        )}

                                        <Text>{user_data && user_data.name}</Text>
                                        <Text>{user_data && user_data.balance.display_string}</Text>
                                    </View>
                                </View>
                            )
                            :
                            (
                                <Text style={{ marginVertical: 20 }}>Logged Out 😟</Text>
                            )
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _LogIn()
    {
        let phone      = this.state.phone_no.replace(/\s/g, '')
        let login_code = this.state.sms_code.replace(/\s/g, '')

        if(login_code.length !== 6)
        {
            alert('Wrong code format')
            return
        }

        this.setState({ spinner_running: true })
        Keyboard.dismiss()
        console.log(`Logging In [${phone}] [${login_code}]`)

        axios.post('https://web-production.lime.bike/api/rider/v1/login',
        {
            phone,
            login_code
        }).then(async ({data}) =>
        {
            await this.props.setBearer(data.token)
            this._checkBalance()
        })
        .catch(e =>
        {
            alert(JSON.stringify(e.response.data))
            this.setState({ spinner_running: false })
        })
    }

    _RequestCode()
    {
        let phone = this.state.phone_no.replace(/\s/g, '')

        if(phone[0] !== '+')
        {
            alert('Wrong phone format')
            return
        }

        this.setState({ spinner_running: true })
        Keyboard.dismiss()
        console.log('Requesting Code for ' + phone)

        axios.get('https://web-production.lime.bike/api/rider/v1/login',
        {
            params: {
                phone
            }
        })
        .catch(e => alert(JSON.stringify(e.response.data)))
        .finally(() => this.setState({ spinner_running: false }))
    }

    _LogOut()
    {
        console.log('Logging Out')
        this.props.setBearer('')
        this.setState({ userData: {} })
    }

    _checkBalance()
    {
        this.setState({ spinner_running: true })

        axios.get('https://web-production.lime.bike/api/rider/v1/user')
        .then(({data}) =>
        {
            let trip_id = data.meta.trip_id

            if(trip_id)
            {
                console.log(`Trip found in login request [${trip_id}]`)

                axios.get('https://web-production.lime.bike/api/rider/v1/trips/' + trip_id)
                .then(({data}) => {
                    let bike       = data.data.attributes.bike
                    let status     = data.data.attributes.status
                    let started_at = data.data.attributes.started_at

                    if(!bike || status != 'started')
                    {
                        alert('Bike NULL or wrong trip status')
                        return
                    }

                    this.props.setTrip(trip_id, bike.id, started_at)
                })
                .catch(e =>
                {
                    this.props.setTrip(null, null, null)
                    alert(JSON.stringify(e.response.data))
                })
                .finally(() => this.setState({ spinner_running: false }))
            }
            else
            {
                this.props.setTrip(null, null, null)
                this.setState({ spinner_running: false })
            }

            this.setState({ userData: data.data })

            console.log('== Logged In ==')
        })
        .catch(err =>
        {
            console.log('Could not load user data: ' + err)
            this._LogOut()
            this.setState({ spinner_running: false })
        })
    }
}

const mapStateToProps = state => ({
    bearer_token: state && state.bearer,
    trip_id:      state && state.trip_id,
})

export default connect(mapStateToProps, {setBearer, setTrip})(ControlPanelScreen)
