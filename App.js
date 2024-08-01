import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Image, StyleSheet } from 'react-native';

import Tela1 from './telas/Tela1';
import Tela2 from './telas/Tela2';
import Tela3 from './telas/Tela3';
import Tela4 from './telas/Tela4';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: 'https://3.bp.blogspot.com/-nyus8VfJSfQ/XGxUhS8AiEI/AAAAAAAANmc/Tfj44yln3xMjcjSA2Z4KpaYKNpJSbMBJgCLcBGAs/s1600/hq720.jpg' }} // URL da imagem de perfil
          style={styles.profileImage}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Tela1"
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Página Inicial"
        component={Tela1}
        options={{ drawerLabel: 'Página Inicial' }} // Nome personalizado
      />
      <Drawer.Screen
        name="Buscar Informações"
        component={Tela2}
        options={{ drawerLabel: 'Buscar Informações' }} // Nome personalizado
      />
      <Drawer.Screen
        name="Lista de VIPs"
        component={Tela3}
        options={{ drawerLabel: 'Lista de VIPs' }} // Nome personalizado
      />
      <Drawer.Screen
        name="Tela4"
        component={Tela4}
        options={{ drawerLabel: 'Configurações' }} // Nome personalizado
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    marginBottom: 10,
  },
  profileImage: {
    width: 280,
    height: 100,
  },
});
