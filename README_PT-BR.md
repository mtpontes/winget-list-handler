# Winget List Handler

## 🔎 Sobre

Este projeto automatiza o processo de reinstalação de aplicativos após formatar o sistema. Utilizando o winget, ele permite gerar um relatório com todos os aplicativos instalados no Windows (incluindo aqueles que não foram instalados via winget) e facilita a reinstalação automática dos apps compatíveis.

Além disso, caso algum aplicativo não possa ser instalado automaticamente, o projeto gera um relatório (`apps_prejudicados.json`) indicando quais apps ainda precisam ser instalados manualmente.

Se você é um desenvolvedor e deseja contribuir ou personalizar a ferramenta, veja a seção [Instruções para Desenvolvedores](https://github.com/mtpontes/winget-list-handler/blob/main/README_DEV.md).

## 📌 Como funciona?

1️⃣ **Geração de relatórios de apps**: gera os arquivos de referência com a lista de aplicativos instalados.  
2️⃣ **Consumo de relatórios de apps**: consome os relatórios para efetuar as instalações.

## 👤 Instruções de uso

### ⚙️ Pré-requisitos para utilização

- ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
- ![Winget-cli](https://img.shields.io/badge/Winget_CLI-%234D4D4D.svg?style=for-the-badge&logo=windows-terminal&logoColor=white)

### 📥 Baixar e Instalar

1. Acesse a [página de releases](https://github.com/mtpontes/winget-list-handler/releases) do projeto.
2. Baixe a versão mais recente do arquivo `winget-handler.exe`.
3. Mantenha esse `.exe` em um diretório isolado para melhor utilização.

### 1️⃣ Configurar Winget

Antes de começar a utilizar a solução, verifique se está com winget instalado e configurado corretamente na sua máquina.

Por padrão, o Winget já vem instalado em sistemas Windows 10/11, mas caso não possua, obtenha-o a partir de seu [repositório](https://github.com/microsoft/winget-cli?tab=readme-ov-file) oficial. Basta ir na página de releases e baixar o pacote com extensão `.msixbundle` em _assets_ e executar a instalação.

[Winget-cli Oficial](https://github.com/microsoft/winget-cli?tab=readme-ov-file)

Utilize o seguinte comando para verificar se o Winget está instalado:

```sh
winget --version
```

Em seguida utilize o seguinte comando e aceite os termos da Microsoft Store:

```sh
winget list
```

Quando questionado sobre os termos da Microsoft Store, pressione `Y` para aceitar.

Caso esse termo não seja aceito, não será possível utilizar a solução. Esse termo é da Microsoft para utilização da
ferramenta Winget e não tem nenhuma relação direta com a aplicação, porém, esta solução é baseada na ferramenta Winget e
depende que ele esteja devidamente configurado para funcionar.

### 2️⃣ Gerar os relatórios antes de formatar

Antes de formatar, execute a geração de relatórios de aplicativos. Esses relatórios são necessários para a solução
fazer a instalação dos aplicativos atuais da máquina. Além disso, ele também fornece um relatório com a relação de
aplicativos que não serão instalados pela solução, servindo como uma orientação de quais apps você irá precisar instalar manualmente.

Execute o comando para gerar os arquivos de referência dos aplicativos instalados:

```sh
# Powershell
./winget-handler --generate-files

# CMD
winget-handler --generate-files
```

Isso criará um diretório e dois arquivos onde o `winget-handler.exe` estiver sendo executado:

📁 **`arquivos_gerados`** → Contém os relatórios de aplicativos.

📄 **`apps-com-pacotes.json`** → Contém apenas os aplicativos que podem ser reinstalados automaticamente via winget. É crucial para a próxima etapa e funcionamento da solução.

📄 **`apps-prejudicados.json`** → Lista os aplicativos que **não** podem ser reinstalados automaticamente, seja por falta de suporte no winget ou por problemas na saída do comando `winget list`.

Copie o diretório `arquivos_gerados` e o executável `winget-handler.exe` para um local seguro, livre de formatação.

Após isso já é possível formatar o sistema.

---

### 3️⃣ Reinstalar os aplicativos após a formatação

Após formatar o sistema, recupere o diretório `arquivos_gerados` e o executável `winget-handler.exe`.

Então, execute um dos três comandos:

- **Instala os apps um de cada vez**

  Os pacotes serão instalados **um por um** de forma síncrona.

  ```sh
  # Powershell
  ./winget-handler --consume-file

  # CMD
  winget-handler --consume-file
  ```

- **Instala 5 apps simultâneamente de forma enfileirada**

  Quando uma instalação acaba, inicia outra que está na fila

  ```sh
  # Powershell
  ./winget-handler --consume-file --async

  # CMD
  winget-handler --consume-file --async
  ```

- **Permite você definir até quantos apps podem ser instalados simultâneamente**

  ```sh
  # Powershell
  ./winget-handler --consume-file --async-concurrency=<SUBSTITUA_POR_UM_NUMERO_DE_1_A_100>

  # CMD
  winget-handler --consume-file --async-concurrency=<SUBSTITUA_POR_UM_NUMERO_DE_1_A_100>
  ```

---

## 📌 Observações

Esse processo pode demorar, pois depende da velocidade dos servidores dos pacotes e da capacidade do seu hardware.

- A instalação síncrona é mais lenta, mas consome menos RAM, CPU e gravação de armazenamento.
- A instalação assíncrona é mais rápida, mas o número de pacotes instalados simultaneamente pode impactar o desempenho geral da máquina, além de poder ser limitado pela velocidade de escrita do armazenamento padrão do sistema.
- O padrão para instalações assíncronas é 5 pacotes simultâneos.

## ❓ Problemas Conhecidos

- **O Winget não está instalado/configurado**: Certifique-se de que o Winget está instalado e configurado corretamente.
- **Alguns aplicativos não foram reinstalados**: Verifique o arquivo `apps-prejudicados.json` e instale manualmente.
- **Erro ao rodar o executável**: Execute como administrador e tente novamente.
- **O app não encontra o arquivo exec.bat**: Mantenha o arquivo exec.bat no mesmo nível de diretório do ``.exe`` da aplicação. O arquivo .bat foi a forma que encontrei de driblar algumas limitações de terminal. Para algumas aplicações específicas é necessário inserir um segundo input que pode variar de pacote para pacote, mas quando a execução é feita via .bat esse segundo input é ignorado e o winget segue o fluxo normal.

Caso encontre outros problemas, abra uma [issue](https://github.com/mtpontes/winget-list-handler/issues) no repositório.
