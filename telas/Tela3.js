import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const fetchWorldName = async (characterName) => {
  try {
    const response = await fetch(`https://api.tibiadata.com/v4/character/${characterName}`);
    const data = await response.json();
    return data.character ? data.character.character.world : null;
  } catch (error) {
    console.error('Erro ao buscar o nome do mundo do personagem:', error);
    return null;
  }
};

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
    return !!data.character;
  } catch (error) {
    console.error('Erro ao verificar a existência do personagem:', error);
    return false;
  }
};

export default function Tela3() {
  const isFocused = useIsFocused();
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
      const worldName = await fetchWorldName(vip.name);
      if (worldName) {
        updatedStatuses[vip.name] = await fetchWorldStatus(worldName, vip.name);
      } else {
        updatedStatuses[vip.name] = 'offline';
      }
    }
    setStatusMap(updatedStatuses);
  };

  useEffect(() => {
    let interval;
    if (isFocused) {
      updateStatuses();
      interval = setInterval(updateStatuses, 60000);
    }
    return () => clearInterval(interval);
  }, [isFocused, vipList]);

  const handleAddVIP = async () => {
    if (newVIP.trim() && !vipList.some(vip => vip.name === newVIP.trim())) {
      const exists = await checkCharacterExists(newVIP.trim());
      if (exists) {
        setVipList([...vipList, { name: newVIP.trim() }]);
        setNewVIP('');
        setModalVisible(false);
        setErrorMessage('');
      } else {
        setErrorMessage('Personagem não encontrado. Por favor, verifique o nome e tente novamente.');
      }
    }
  };

  const handleRemoveVIP = (name) => {
    setVipList(vipList.filter(vip => vip.name !== name));
  };

  const handleClearVIPList = () => {
    setVipList([]);
  };

  const handleVIPClick = async (name) => {
    setSelectedVIP(name);
    setOptionsModalVisible(true);
  };

  const handleFetchInfo = async () => {
    const info = await fetchCharacterInfo(selectedVIP);
    setSelectedCharacter(info);
    setOptionsModalVisible(false);
    setInfoModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.vipContainer, { backgroundColor: statusMap[item.name] === 'online' ? 'green' : 'red' }]}
      onPress={() => handleVIPClick(item.name)}
    >
      <Text style={styles.vipName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de VIPs</Text>
      <View style={styles.legenda}>
        <Text style={styles.legenda}>Legenda: </Text>
        <Text style={styles.legendaG}>Online</Text>
        <Text style={styles.legendaR}>Offline</Text>

      </View>

      <Button styles={styles.buttonAdd} color="#0040ff" title="Adicionar VIP" onPress={() => setModalVisible(true)} />
      {vipList.length > 0 && (
        <Text style={styles.legendaDetalhes}>Clique nos personagens para mais detalhes</Text>
      )}


      <FlatList
        data={vipList}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Não há personagens na lista de VIPs</Text>}
      />

      <TouchableOpacity style={styles.clearButton} onPress={handleClearVIPList}>
        <Text style={styles.clearButtonText}>Limpar Lista VIP</Text>
      </TouchableOpacity>

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
            <View style={styles.botoes}>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <Button color="#0040ff" title="Adicionar" onPress={handleAddVIP} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={[styles.modalButton, {backgroundColor: 'green'}]} onPress={handleFetchInfo}>
              <Text style={styles.modalButtonText}>Buscar informações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonDelete]}
              onPress={() => {
                handleRemoveVIP(selectedVIP);
                setOptionsModalVisible(false);
              }}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonDeleteText]}>Excluir da VIP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => setOptionsModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>

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
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  vipContainer: {
    marginTop: 10,
    marginVertical: 2,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  vipName: {
    color: '#fff'
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#0040ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalButtonDelete: {
    backgroundColor: 'red',
  },
  modalButtonDeleteText: {
    color: '#fff',
  },

  legendaDetalhes: {
    marginTop: 2,
    color: '#fff',
    fontSize: 10
  },
  botoes: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-around',
    width: '80%'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  legenda: {
    flexDirection: 'row',
    color: '#fff'
  },
  legendaG: {
    marginBottom: 10,
    color: '#0f0',
    paddingRight: 5
  },
  legendaR: {
    color: '#f00'
  },
  emptyText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  }
});
