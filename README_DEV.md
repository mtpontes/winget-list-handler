# Winget List Handler

## 📌 How does it work?

1️⃣ **App report generation**: generates reference files with the list of installed applications.

2️⃣ **App report consumption**: consumes the reports to perform installations.

---

## 🚀 How to use

### ⚙️ Prerequisites

- ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
- ![Winget-CLI](https://img.shields.io/badge/Winget_CLI-%234D4D4D.svg?style=for-the-badge&logo=windows-terminal&logoColor=white)
- ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

---

### 📌 Step by step

- Install and configure Winget

  [Official Winget CLI](https://github.com/microsoft/winget-cli)

  Check if it is installed:

  ```sh
  winget --version
  ```

  Accept Microsoft's terms:

  ```sh
  winget list
  Y
  ```

- Install the project dependencies

  ```sh
  npm install -y
  ```

#### 1️⃣ Generate reports

Run the command to generate the reference files for the installed applications:

```sh
node dist/index.js --generate-files
```

This will create a directory and two files where `winget-handler.exe` is running:

📁 **`generated_files`** → Contains the application reports.

📄 **`apps-with-packages.json`** → Contains only the applications that can be automatically reinstalled via winget.

📄 **`damaged-apps.json`** → Lists the applications that **cannot** be automatically reinstalled, either due to lack of support in winget or due to problems with the output of the `winget list` command.

Copy the `generated_files` folder (or the entire project) to a safe location before formatting the system.

---

#### 2️⃣ Consume report

The application consumes the `./generated_files/apps-with-packages.json` report to perform the installations.

Package installation commands:

- **Installs the apps one at a time**

  The packages will be installed **one by one** synchronously.

  ```sh
  node dist/index.js --consume-file
  ```

- **Installs 5 apps simultaneously in a queued fashion**

  When an installation is finished, start another one that is in the queue

  ```sh
  node dist/index.js --consume-file --async
  ```

- **Allows you to define how many apps can be installed simultaneously**

  ```sh
  node dist/index.js --consume-file --async-concurrency=<REPLACE_WITH_A_NUMBER_FROM_1_TO_100>
  ```

## ❓ Known Issues

- **Winget is not installed/configured**: Make sure Winget is installed and configured correctly.
- **Some apps were not reinstalled**: Check the `apps-damaged.json` file and install manually. - **Error running executable**: Run as administrator and try again.

If you encounter other problems, open an [issue](https://github.com/mtpontes/winget-list-handler/issues) in the repository.
