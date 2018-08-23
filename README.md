# Cadê meu Remédio?
Frontend - Passo a passo para dar build no app (Android):
* Instalar o NodeJS (versão 10.9.0 ou posterior), disponível em https://nodejs.org/en/;
* Instalar o Git, disponível em https://git-scm.com/downloads;
* Após instalar o NodeJS, abrir uma janela do terminal e executar os comandos “npm install -g cordova” e “npm install -g ionic”;
* Para baixar o projeto use o comando "git clone https://github.com/rodgasp/cademeuremedio.git";
* Ainda no terminal, dentro da pasta do projeto (cademeuremedio), execute o comando "npm install" para baixar as dependências do projeto atualizadas;
* Para testar a execução do aplicativo em um browser pode-se usar o comando "ionic serve" na pasta do projeto;
* Para vincular a plataforma Android no projeto, o comando é "ionic cordova platform add android"
* Para gerar a versão do Android, é necessário instalar o "Java JDK" e o "SDK Manager". A maneira mais fácil é instalando o Android Studio, disponível em https://developer.android.com/studio/;
* Para compilar o projeto, o comando é "ionic cordova build android" dentro da pasta do projeto.
* Para implantar o aplicativo em um dispositivo Android ligado na porta USB do dispositivo (devidamente configurado com as "Opções de desenvolvedor") o comando é "ionic cordova run android --device" na pasta do projeto.
