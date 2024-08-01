import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function Tela2() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacterInfo = async () => {
    setLoading(true);
    setError(null);
    const url = `https://api.tibiadata.com/v4/character/${characterName}`;
    try {
      const response = await fetch(url);
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
        const status = otherCharacters.find(c => c.name === name)?.status || 'Unknown';

        setCharacterInfo({ name, world, residence, level, vocation, status, guild });
      } else {
        setCharacterInfo(null);
        setError('Character not found');
      }
    } catch (error) {
      console.error('Erro ao buscar informações do personagem:', error);
      setError('Erro ao buscar informações do personagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personagem</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Personagem"
        value={characterName}
        onChangeText={setCharacterName}
      />
      <Button title="Buscar" onPress={fetchCharacterInfo} />
      {loading ? <Text>Carregando...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {characterInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Nome: {characterInfo.name}</Text>
          <Text style={styles.info}>Mundo: {characterInfo.world}</Text>
          <Text style={styles.info}>Residência: {characterInfo.residence}</Text>
          <Text style={styles.info}>Nível: {characterInfo.level}</Text>
          <Text style={styles.info}>Vocação: {characterInfo.vocation}</Text>
          <Text style={styles.info}>Status: {characterInfo.status}</Text>
          <Text style={styles.info}>Guild: {characterInfo.guild}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  infoContainer: {
    marginTop: 16,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
  error: {
    color: 'red',
    marginVertical: 4,
  },
});
