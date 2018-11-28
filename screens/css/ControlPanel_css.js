import {StyleSheet, Platform} from 'react-native'

export default StyleSheet.create(
{
    container: {
        flex: 1,
        backgroundColor: 'rgb(238,238,238)',
    },

    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },

    contentContainer: {
        paddingTop: 30,
        flex: 1,
    },

    welcomeContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
        // backgroundColor: 'red',
    },

    welcomeImage: {
        width: 100,
        height: 60,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },

    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },

    homeScreenFilename: {
        marginVertical: 7,
    },

    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },

    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },

    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },

    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        ...Platform.select({
            ios: {
            shadowColor: 'black',
            shadowOffset: { height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            },
            android: {
            elevation: 20,
            },
        }),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 0,
    },

    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },

    navigationFilename: {
        marginTop: 5,
    },

    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },

    helpLink: {
        paddingVertical: 15,
    },

    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
})
