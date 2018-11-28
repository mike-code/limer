import React from 'react'
import axios from 'axios'
import {
    AsyncStorage,
    NativeModules,
    StatusBar,
    View,
} from 'react-native'
import {
    AppLoading,
    Asset,
    Font,
    Icon,
} from 'expo'
import MainTabNavigator from './components/MainTabNavigator'
import EbinReducer from './components/EbinReducer'
import { setBearer } from './components/SetBearerAction'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

const store = createStore(EbinReducer)

class App extends React.Component {

    constructor(params)
    {
        super(params)

        axios.interceptors.request.use((config) =>
        {
            NativeModules.Networking.clearCookies((cleared) => console.log('Cleared Cookies'))

            if(!!this.props.bearer_token && config.url.startsWith('https://web-production.lime.bike/'))
            {
                config.headers.common.Authorization = `Bearer ${this.props.bearer_token}`
            }

            return config
        })

        this.state =
        {
            isLoadingComplete: false,
        }
    }

    render()
    {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen)
        {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            )
        }
        else
        {
            return (
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <StatusBar barStyle="default" />
                    <Provider store={store}>
                        <MainTabNavigator />
                    </Provider>
                </View>
            );
        }
    }

    _loadResourcesAsync = async () =>
    {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/robot-dev.png'),
                require('./assets/images/robot-prod.png'),
                require('./assets/images/1up.png'),
                require('./assets/images/1up_dev.png'),
            ]),
            Font.loadAsync({
                ...Icon.Ionicons.font,
                'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
                'Material Icons': require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
                'Ionicons': require('react-native-vector-icons/Fonts/Ionicons.ttf'),
            }).then(() =>
                AsyncStorage.getItem('@limer:bearer').then(async (token) =>
                {
                    console.log(`Retrieved token from storage [${token}]`)
                    await this.props.setBearer(token)
                })
            )
        ]);
    };

    _handleLoadingError = error => console.warn(error)

    _handleFinishLoading = () => this.setState({ isLoadingComplete: true })
}

const mapStateToProps = state => ({ bearer_token: state && state.bearer })

function connectWithStore(store, WrappedComponent, ...args)
{
    let ConnectedWrappedComponent = connect(...args)(WrappedComponent)

    return (props) => (<ConnectedWrappedComponent {...props} store={store} />)
}

export default connectWithStore(store, App, mapStateToProps, {setBearer})
