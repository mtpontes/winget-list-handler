# Winget List Handler

## 🔎 About

This project automates the process of reinstalling applications after formatting the system. Using **winget**, it allows you to generate a report of all installed applications on Windows (including those **not** installed via winget) and facilitates the automatic reinstallation of compatible apps.

Additionally, if some applications cannot be installed automatically, the project generates a report indicating which apps still need to be installed manually.

### 📌 How does it work?

1️⃣ **Before formatting**: generate reference files with a list of installed applications.  
2️⃣ **After formatting**: use the automation to reinstall the apps.

---

<details><summary><h2>🚀 How to use</h2></summary>

### ⚙️ Prerequisites

- ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
- ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

---

### 📌 Step by step

#### 1️⃣ Generate reports before formatting

Before formatting, run the command to generate reference files for installed applications:

```sh
npm install -y
node index.js --generate-files
```

This will create two files in the project's root directory:

📄 **`apps-com-pacotes.json`** → Contains only applications that can be automatically reinstalled via winget.

📄 **`apps-prejudicados.json`** → Lists applications that **cannot** be reinstalled automatically, either due to lack of support in winget or issues with the `winget list` command output.

Copy the `arquivos_gerados` folder (or the entire project) to a safe location before formatting the system.

---

#### 2️⃣ Reinstall applications after formatting

Before proceeding, ensure that **Node.js** and **NPM** are installed on the system. If not, download and install them from the official website:

🔗 [Node.js Official](https://nodejs.org/)

After formatting the system, retrieve the `arquivos_gerados` directory and place it in the project root. Then, run one of the three commands:

- **Installs apps one by one**

  The packages will be installed **one at a time** synchronously.

  ```sh
  node index.js --consume-file
  ```

- **Installs 5 apps simultaneously in a queue**

  When one installation finishes, another from the queue starts.

  ```sh
  node index.js --consume-file --async
  ```

- **Allows you to define how many apps can be installed simultaneously**

  ```sh
  node index.js --consume-file --async-concurrency=<NUMBER>
  ```

📌 **Tips:**

- Synchronous installation is slower but consumes less RAM, CPU, and storage write cycles.
- Asynchronous installation is faster, but the number of packages installed simultaneously can impact overall system performance and may be limited by the system's default storage write speed.
- The default for asynchronous installations is **5 simultaneous packages**.

This process may take time, as it depends on package server speeds and your hardware capabilities.

</details>
