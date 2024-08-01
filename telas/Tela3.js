import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const fetchCharacterStatus = async (characterName) => {
  try {
    const response = await fetch(`https://api.tibiadata.com/v4/character/${characterName}`);
    const data = await response.json();
    const character = data.character.other_characters.find(c => c.name === characterName);
    return character ? character.status : 'offline';
  } catch (error) {
    console.error('Erro ao buscar status do personagem:', error);
    return 'offline';
  }
};

const fetchCharacterInfo = async (characterName) => {
  try {
    const response = await fetch(`https://api.tibiadata.com/v4/character/${characterName}`);
    const data = await response.json();
    return data.character ? data.character.character : null;
  } catch (error) {
    console.error('Erro ao buscar informações do personagem:', error);
    return null;
  }
};

const checkCharacterExists = async (characterName) => {
  try {
    const response = await fetch(`https://api.tibiadata.com/v4/character/${characterName}`);
    const data = await response.json();
    return !!data.character; // Retorna true se o personagem existe
  } catch (error) {
    console.error('Erro ao verificar a existência do personagem:', error);
    return false;
  }
};

export default function Tela3() {
  const isFocused = useIsFocused(); // Hook para saber se a tela está em foco
  const [vipList, setVipList] = useState([]);
  const [newVIP, setNewVIP] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [statusMap, setStatusMap] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedVIP, setSelectedVIP] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const updateStatuses = async () => {
    const updatedStatuses = {};
    for (const vip of vipList) {
      updatedStatuses[vip.name] = await fetchCharacterStatus(vip.name);
    }
    setStatusMap(updatedStatuses);
  };

  // Atualiza o status dos VIPs a cada 1 minuto
  useEffect(() => {
    let interval;
    if (isFocused) {
      updateStatuses(); // Atualiza o status ao entrar na tela
      interval = setInterval(updateStatuses, 60000); // Atualiza a cada 1 minuto
    }
    return () => clearInterval(interval); // Limpa o intervalo ao sair da tela
  }, [isFocused, vipList]);

  // Adiciona um novo VIP à lista
  const handleAddVIP = async () => {
    if (newVIP.trim() && !vipList.some(vip => vip.name === newVIP.trim())) {
      const exists = await checkCharacterExists(newVIP.trim());
      if (exists) {
        setVipList([...vipList, { name: newVIP.trim() }]);
        setNewVIP('');
        setModalVisible(false);  // Fecha o modal após adicionar
        setErrorMessage('');     // Limpa qualquer mensagem de erro anterior
      } else {
        setErrorMessage('Personagem não encontrado. Por favor, verifique o nome e tente novamente.');
      }
    }
  };

  // Remove um VIP da lista
  const handleRemoveVIP = (name) => {
    setVipList(vipList.filter(vip => vip.name !== name));
  };

  // Limpa toda a lista de VIPs
  const handleClearVIPList = () => {
    setVipList([]);
  };

  // Mostra o menu de opções
  const handleVIPClick = async (name) => {
    setSelectedVIP(name);
    setOptionsModalVisible(true);
  };

  // Buscar informações e mostrar no modal
  const handleFetchInfo = async () => {
    const info = await fetchCharacterInfo(selectedVIP);
    setSelectedCharacter(info);
    setOptionsModalVisible(false);
    setInfoModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de VIPs</Text>
      <Button title="Adicionar VIP" onPress={() => setModalVisible(true)} />

      <ScrollView contentContainerStyle={styles.listContainer}>
        {vipList.map(vip => (
          <View key={vip.name} style={styles.vipContainer}>
            <Button
              title={vip.name}
              onPress={() => handleVIPClick(vip.name)}
              color={statusMap[vip.name] === 'online' ? 'green' : 'red'}
            />
          </View>
        ))}
      </ScrollView>

      {/* Botão para limpar a lista de VIPs */}
      <TouchableOpacity style={styles.clearButton} onPress={handleClearVIPList}>
        <Text style={styles.clearButtonText}>Limpar Lista VIP</Text>
      </TouchableOpacity>

      {/* Modal para adicionar novos VIPs */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo VIP</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Personagem"
              value={newVIP}
              onChangeText={setNewVIP}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <Button title="Adicionar" onPress={handleAddVIP} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>

      {/* Modal para opções do VIP */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Buscar informações" onPress={handleFetchInfo} />
            <Button title="Excluir da VIP" onPress={() => {
              handleRemoveVIP(selectedVIP);
              setOptionsModalVisible(false);
            }} color="red" />
            <Button title="Cancelar" onPress={() => setOptionsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal para mostrar informações do personagem */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCharacter ? (
              <>
                <Text style={styles.modalTitle}>Informações do Personagem</Text>
                <Text>Nome: {selectedCharacter.name}</Text>
                <Text>Vocation: {selectedCharacter.vocation}</Text>
                <Text>Level: {selectedCharacter.level}</Text>
                <Text>World: {selectedCharacter.world}</Text>
                <Text>Residence: {selectedCharacter.residence}</Text>
                <Text>Last Login: {selectedCharacter.last_login}</Text>
                <Button title="Fechar" onPress={() => setInfoModalVisible(false)} color="red" />
              </>
            ) : (
              <Text>Carregando informações...</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  vipContainer: {
    marginVertical: 8,
  },
  clearButton: {
    marginVertical: 16,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});
