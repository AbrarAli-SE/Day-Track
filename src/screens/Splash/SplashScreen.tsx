import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';


const SplashScreen = ({ navigation }: any) => {
    React.useEffect(() => {
        setTimeout(() => {
            navigation.replace('OnboardingPages');
        }, 2000);
    }, [navigation]);

    return (
        <LinearGradient
            colors={['#f7feffff', '#eed6e4d4']}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
            style={spleshStyles.container}
        >
            <View style={spleshStyles.container}>
                <Text style={spleshStyles.mainText}>Day Track</Text>
                <Text style={spleshStyles.subText}>Keep your life on track</Text>
            </View>
        </LinearGradient>
    );
};
const spleshStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    mainText: {
        fontSize: 48,
        fontFamily: 'YaldeviColombo-SemiBold',
        fontStyle: 'normal' as 'normal',
        fontWeight: '600' as '600',
        color: '#000',

    },
    subText: {
        fontSize: 20,
        fontWeight: '300' as '300',
        fontStyle: 'normal' as 'normal',
        fontFamily: 'YaldeviColombo-Light',
        color: '#000',
        marginTop: 8,
    }
})
export default SplashScreen