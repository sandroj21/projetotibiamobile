import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

const fetchWorldStatus = async (worldName, characterName) => {
  try {
    const response = await fetch(`https://api.tibiadata.com/v4/world/${worldName}`);
    const data = await response.json();

    if (data.world && data.world.online_players) {
      const onlinePlayers = data.world.online_players;
      const isOnline = onlinePlayers.some(player => player.name === characterName);
      return isOnline ? 'online' : 'offline';
    } else {
      return 'offline';
    }
  } catch (error) {
    console.error('Erro ao buscar status do mundo:', error);
    return 'offline';
  }
};

const fetchCharacterInfo = async (characterName) => {
  try {
    const response = await fetch(`https://api.tibiadata.com/v4/character/${characterName}`);
    const data = await response.json();

    if (data.character && data.character.character) {
      const characterData = data.character.character;
      const otherCharacters = data.character.other_characters || [];

      const name = characterData.name || 'Unknown';
      const world = characterData.world || 'Unknown';
      const residence = characterData.residence || 'Unknown';
      const level = characterData.level || 'Unknown';
      const guild = characterData.guild ? characterData.guild.name : 'No Guild';
      const vocation = characterData.vocation || 'Unknown';
      const status = await fetchWorldStatus(world, name);

      const newCharacterInfo = { name, world, residence, level, vocation, status, guild };
      return newCharacterInfo;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar informações do personagem:', error);
    return null;
  }
};

export default function Tela2() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleFetchCharacterInfo = async () => {
    setLoading(true);
    setError(null);

    const info = await fetchCharacterInfo(characterName);
    if (info) {
      setCharacterInfo(info);
      setHistory([...history, info]);
    } else {
      Alert.alert('Erro', 'Personagem não encontrado');
    }

    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setCharacterInfo(null);
        setCharacterName('');
        setError(null);
      };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Personagem</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do Personagem"
          placeholderTextColor='gray'
          value={characterName}
          onChangeText={setCharacterName}
        />
        <TouchableOpacity style={styles.button} onPress={handleFetchCharacterInfo}>
          <Icon name="search" size={20} color="#fff" />
          <Text style={styles.buttonText}> Buscar</Text>
        </TouchableOpacity>
        {loading ? <Text style={styles.carregando}>Carregando...</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {characterInfo && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personagem encontrado:</Text>
            <Text style={styles.cardInfo}>Nome: {characterInfo.name}</Text>
            <Text style={styles.cardInfo}>Mundo: {characterInfo.world}</Text>
            <Text style={styles.cardInfo}>Residência: {characterInfo.residence}</Text>
            <Text style={styles.cardInfo}>Nível: {characterInfo.level}</Text>
            <Text style={styles.cardInfo}>Vocação: {characterInfo.vocation}</Text>
            <Text style={styles.cardInfo}>Status: {characterInfo.status}</Text>
            <Text style={styles.cardInfo}>Guild: {characterInfo.guild}</Text>
          </View>
        )}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Pesquisas</Text>
          {history.length > 0 ? (
            <>
              {history.map((character, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>{character.name} - {character.world}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                <Text style={styles.clearButtonText}>Limpar Histórico</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noHistoryText}>Nenhum personagem pesquisado ainda.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
    color: 'white',
  },
  button: {
    backgroundColor: '#ffd700',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  carregando: {
    color: '#0f0',
    fontSize: 16
  },
  card: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    color: '#ffd700',
    marginBottom: 10,
  },
  cardInfo: {
    fontSize: 16,
    marginVertical: 4,
    color: '#fff',
  },
  historyContainer: {
    marginTop: 30,
    width: '100%',
  },
  historyTitle: {
    fontSize: 20,
    color: '#ffd700',
    marginBottom: 10,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomColor: '#666',
    borderBottomWidth: 1,
  },
  historyText: {
    fontSize: 16,
    color: '#fff',
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noHistoryText: {
    color: 'gray',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginVertical: 4,
  },
});
