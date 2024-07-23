import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Tela2() {

        return (
        <View style={styles.container}>
            <Image style={styles.imagemLogo} source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Tibia-logo.png',
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagemLogo: {
        width: 350,
        height: 113
    }
});
