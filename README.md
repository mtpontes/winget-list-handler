# Winget List Handler

## 🔎 About

This project was created to solve the tedious process of installing applications one by one after formatting your system. It uses Winget to handle the installation process and to generate a list of all the app packages installed on your Windows machine (not limited to apps installed via Winget).

The purpose of this project is to automate the installation of your applications on a formatted system and generate a report of apps that couldn't be installed automatically—giving you a clear idea of what remains to be installed.

- First, you generate files with references to your apps BEFORE formatting.
- Then, you run the automation to install the apps.

<details><summary><h2>🚀 How to Use</h2></summary>

### Prerequisites

![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Step-by-Step

1.  Before formatting your machine, generate the app reports.

    - These reports are the processed list of programs installed on your current machine.
    - Two files will be generated during this process: `apps-com-pacotes.json` and `apps-prejudicados.json`.
      - **apps-com-pacotes.json:** This is the main file for automating app installations. It is already processed and contains only apps that can be installed via Winget.
      - **apps-prejudicados.json:** This is a list of all apps that cannot be installed via Winget. These are apps without a published Winget package or those with formatting errors caused by the output of the `winget list` command.
    - The directory containing the generated files is located in the root of the project and is created when executed.

    Run the commands in the root of the project.

    Install the project dependencies:

        npm install -y

    Generate the reports:

        node index.js --generate-files-only

2.  After generating the files, copy the `_arquivos_gerados_` directory—or the entire project—and keep it in a safe place to avoid losing it during formatting.
    - Feel free to adjust the `apps-com-pacotes.json` file, removing entries as needed, but be careful not to break the JSON format.
3.  On your formatted machine, clone the project again and paste the `_arquivos_gerados_` directory into the root of the project—or bring your complete project backup—and run the automation to install the apps.

        Use the following command in the project root:

            node index.js --consume-file-only

        Each package will be installed one at a time synchronously.

        To install packages asynchronously, use the command:

            node index.js --consume-file-only --async

        After that, just wait for the process to complete.

        The synchronous installation can take a long time but uses minimal processing, RAM, and disk writing. The asynchronous installation is much faster but is not yet optimized. As a result, it can demand significant processing, RAM, and disk writing if a large number of apps need to be installed. Avoid using it on legacy computers.

        This process may take some time, as it depends on the speed of the package servers.

    </details>
