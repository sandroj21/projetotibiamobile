import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Tela4() {

        return (
        <View style={styles.container}>
            <Image style={styles.imagemLogo} source={{
                uri: 'https://www.tibiawiki.com.br/images/7/76/Tibia_icon.png',
            }} />
            <View style={styles.sobre}>
            <Text style={styles.sobreApp}>Sobre o App "Tibia"</Text>
            <Text style={styles.sobreTexto}>Bem-vindo ao Tibia, o seu companheiro essencial
                para a jornada pelo mundo do tibia! Este aplicativo foi cuidadosamente
                projetado para fornecer uma experiência inovadora para os jogadores do Tibia,
                oferecendo recursos úteis e informações esseciais para aprimorar
                sua experiência no jogo.
            </Text>
            </View>
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
        width: 100,
        height: 100
    },
    sobre: {
        paddingTop: 40,
        color: '#fff',
        fontSize: 16,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sobreApp: {
        color: '#fff'
    },
    sobreTexto: {
        color: '#fff',
        paddingTop: 40
    }
});
