Aplicação React Native - Tibia VIP List
Esta é uma aplicação móvel desenvolvida em React Native que permite aos usuários gerenciar uma lista de VIPs (personagens) do jogo Tibia. Os usuários podem adicionar, remover e visualizar informações detalhadas dos personagens, bem como monitorar seu status online/offline.

Funcionalidades
Adicionar VIP: Adicione novos personagens à lista de VIPs.
Remover VIP: Remova personagens da lista de VIPs.
Monitoramento de Status: Verifique o status online/offline dos personagens em intervalos regulares de 1 minuto.
Visualizar Informações: Visualize informações detalhadas dos personagens, incluindo nome, vocação, nível, mundo, residência e última vez online.
Limpar Lista de VIPs: Limpe toda a lista de VIPs com um único toque.
Tecnologias Utilizadas
React Native: Framework para desenvolvimento de aplicações móveis.
API TibiaData v4: API utilizada para obter informações dos personagens do jogo Tibia.
Instalação
Siga as etapas abaixo para configurar e executar a aplicação em seu ambiente local.

Clone o repositório:

bash
Copiar código
git clone https://github.com/seu-usuario/tibia-vip-list.git
cd tibia-vip-list
Instale as dependências:

bash
Copiar código
npm install
Execute a aplicação:

bash
Copiar código
npx react-native run-android
# ou para iOS
npx react-native run-ios

Uso
Adicionar VIP:

Toque no botão "Adicionar VIP".
Digite o nome do personagem no campo de texto.
Toque em "Adicionar".
Remover VIP:

Toque no nome do VIP na lista.
No menu de opções, selecione "Excluir da VIP".
Visualizar Informações:

Toque no nome do VIP na lista.
No menu de opções, selecione "Buscar informações".
Limpar Lista de VIPs:

Toque no botão "Limpar Lista VIP".

Estrutura do Código
Tela3.js: Componente principal da aplicação que gerencia a lista de VIPs, adiciona, remove e exibe informações dos personagens.
fetchCharacterStatus.js: Função para buscar o status online/offline de um personagem.
fetchCharacterInfo.js: Função para buscar informações detalhadas de um personagem.
checkCharacterExists.js: Função para verificar se um personagem existe.
Contribuição
Se você deseja contribuir com o projeto, siga estas etapas:

Fork o repositório

Crie uma branch de feature:

bash
Copiar código
git checkout -b minha-feature
Commit suas mudanças:

bash
Copiar código
git commit -m 'Minha nova feature'
Envie para o repositório remoto:

bash
Copiar código
git push origin minha-feature
Abra um Pull Request