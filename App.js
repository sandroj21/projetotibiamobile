import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Tela1 from './telas/Tela1';
import Tela2 from './telas/Tela2';
import Tela3 from './telas/Tela3';
import Tela4 from './telas/Tela4';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tela1"
        component={Tela1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tela2"
        component={Tela2}
        options={{ 
          title: 'Buscar Informações',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          headerLeft: ({ navigation }) => (
            <Icon
              name="arrow-back"
              size={20}
              color="white"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Tela3"
        component={Tela3}
        options={{ 
          title: 'Lista de VIPs',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          headerLeft: ({ navigation }) => (
            <Icon
              name="arrow-back"
              size={20}
              color="white"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Tela4"
        component={Tela4}
        options={{ 
          title: 'Sobre',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          headerLeft: ({ navigation }) => (
            <Icon
              name="arrow-back"
              size={20}
              color="white"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: 'https://3.bp.blogspot.com/-nyus8VfJSfQ/XGxUhS8AiEI/AAAAAAAANmc/Tfj44yln3xMjcjSA2Z4KpaYKNpJSbMBJgCLcBGAs/s1600/hq720.jpg' }}
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
      drawerStyle={{
        backgroundColor: '#c6cbef',
        width: 240,
      }}
      screenOptions={{
        activeTintColor: 'white',
        activeBackgroundColor: 'black',
        inactiveTintColor: 'black',
        itemStyle: { marginVertical: 5 },
        labelStyle: { fontSize: 18 },
      }}
    >
      <Drawer.Screen
        name="Página Inicial"
        component={MainStackNavigator}
        options={{
          drawerLabel: 'Página Inicial',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white'
        }} 
      />
      <Drawer.Screen
        name="Buscar Informações"
        component={Tela2}
        options={{ 
          drawerLabel: 'Buscar Informações',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white'
        }}
      />
      <Drawer.Screen
        name="Lista de VIPs"
        component={Tela3}
        options={{ 
          drawerLabel: 'Lista de VIPs',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white'
        }}
      />
      <Drawer.Screen
        name="Sobre"
        component={Tela4}
        options={{ 
          drawerLabel: 'Sobre',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white'
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    paddingVertical: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 280,
    height: 150
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
