# Winget List Handler

## 🔎 About  

This project automates the process of reinstalling applications after formatting the system. Using **winget**, it generates a report with all installed applications on Windows (including those that **were not** installed via winget) and facilitates the automatic reinstallation of compatible apps.  

Additionally, if an application cannot be installed automatically, the project generates a report indicating which apps still need to be installed manually.  

### 📌 How does it work?  

1️⃣ **Before formatting**: generate reference files with the list of installed applications.  
2️⃣ **After formatting**: use automation to reinstall the apps.  

---

<details><summary><h2>🚀 How to use</h2></summary>

### ⚙️ Prerequisites  

- ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)  
- ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)  
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  

---

### 📌 Step by step  

#### 1️⃣ Generate reports before formatting  

Before formatting, run the following command to generate reference files with the list of installed applications:  

```sh
npm install -y
node index.js --generate-files-only
```

This will create two files in the project's root directory:  

📄 **`apps-com-pacotes.json`** → Contains only applications that can be automatically reinstalled via winget.  

📄 **`apps-prejudicados.json`** → Lists applications that **cannot** be automatically reinstalled, either due to lack of support in winget or issues with the `winget list` command output.  

Copy the `arquivos_gerados` folder (or the entire project) to a safe location before formatting the system.  

---

#### 2️⃣ Reinstall applications after formatting  

After formatting the system, retrieve the `arquivos_gerados` directory and place it in the project's root. Then, run:  

```sh
node index.js --consume-file-only
```

Packages will be installed **one by one** synchronously.  

If you prefer to install packages **asynchronously** (faster but more resource-intensive), use:  

```sh
node index.js --consume-file-only --async
```

Or define a concurrency level to control how many installations occur simultaneously:  

```sh
node index.js --consume-file-only --async-concurrency=<NUMBER>
```

📌 **Tips:**  
- Synchronous installation is slower but consumes less RAM, CPU, and storage write operations.  
- Asynchronous installation is faster, but the number of simultaneously installed packages may impact overall system performance and could be limited by the default storage write speed.  
- The default for asynchronous installations is **5 simultaneous packages**.  

This process may take time, as it depends on the package servers' speed and your hardware's capacity.  

</details>
