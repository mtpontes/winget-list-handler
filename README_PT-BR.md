# Winget List Handler

## 🔎 Sobre

Este projeto automatiza o processo de reinstalação de aplicativos após formatar o sistema. Utilizando o **winget**, ele permite gerar um relatório com todos os aplicativos instalados no Windows (incluindo aqueles que **não** foram instalados via winget) e facilita a reinstalação automática dos apps compatíveis.

Além disso, caso algum aplicativo não possa ser instalado automaticamente, o projeto gera um relatório indicando quais apps ainda precisam ser instalados manualmente.

### 📌 Como funciona?

1️⃣ **Antes de formatar**: gere os arquivos de referência com a lista de aplicativos instalados.  
2️⃣ **Depois de formatar**: utilize a automação para reinstalar os apps.

---

<details><summary><h2>🚀 Como usar</h2></summary>

### ⚙️ Pré-requisitos

- ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
- ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

---

### 📌 Passo a passo

#### 1️⃣ Gerar os relatórios antes de formatar

Antes de formatar, execute o comando para gerar os arquivos de referência dos aplicativos instalados:

```sh
npm install -y
node index.js --generate-files
```

Isso criará dois arquivos no diretório raiz do projeto:

📄 **`apps-com-pacotes.json`** → Contém apenas os aplicativos que podem ser reinstalados automaticamente via winget.

📄 **`apps-prejudicados.json`** → Lista os aplicativos que **não** podem ser reinstalados automaticamente, seja por falta de suporte no winget ou por problemas na saída do comando `winget list`.

Copie a pasta `arquivos_gerados` (ou o projeto inteiro) para um local seguro antes de formatar o sistema.

---

#### 2️⃣ Reinstalar os aplicativos após a formatação

Antes de prosseguir, certifique-se de que o **Node.js** e o **NPM** estão instalados no sistema. Caso ainda não tenha instalado, faça o download e a instalação a partir do site oficial:

🔗 [Node.js Oficial](https://nodejs.org/)

Após formatar o sistema, recupere o diretório `arquivos_gerados` e coloque-o na raiz do projeto. Depois, execute um dos três comandos:

- **Instala os apps um de cada vez**

  Os pacotes serão instalados **um por um** de forma síncrona.

  ```sh
  node index.js --consume-file
  ```

- **Instala 5 apps simultâneamente de forma enfileirada**

  Quando uma instalação acaba, inicia outra que está na fila

  ```sh
  node index.js --consume-file --async
  ```

- **Permite você definir até quantos apps podem ser instalados simultâneamente**

  ```sh
  node index.js --consume-file --async-concurrency=<NÚMERO>
  ```

📌 **Dicas:**

- A instalação síncrona é mais lenta, mas consome menos RAM e CPU e gravação de armazenamento.
- A instalação assíncrona é mais rápida, mas o número de pacotes instalados simultaneamente pode impactar o desempenho geral da máquina, além de poder ser limitado pela velocidade de escrita do armazenamento padrão do sistema.
- O padrão para instalações assíncronas é **5 pacotes simultâneos**.

Esse processo pode demorar, pois depende da velocidade dos servidores dos pacotes e da capacidade do seu hardware.

</details>
