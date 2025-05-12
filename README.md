# Winget List Handler

## 🔎 About

This project automates the process of reinstalling applications after reinstall the system. Using winget, it allows you to generate a report with all applications installed on Windows (including those that were not installed via winget) and facilitates the automatic reinstallation of compatible apps.

In addition, if an application cannot be installed automatically, the project generates a report (`badApps.json`) indicating which apps still need to be installed manually.

If you are a developer and want to contribute or customize the tool, see the [Instructions for Developers](https://github.com/mtpontes/winget-list-handler/blob/main/README_DEV.md) section.

## 📌 How does it work?

1️⃣ **App report generation**: generates reference files with the list of installed applications.

2️⃣ **App report consumption**: consumes the reports to perform the installations.

<details>
  <summary>
    <h2> 👤Usage instructions</h2>    
  </summary>

### ⚙️ Prerequisites for use

- ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
- ![Winget-cli](https://img.shields.io/badge/Winget_CLI-%234D4D4D.svg?style=for-the-badge&logo=windows-terminal&logoColor=white)

### 📥 Download and Install

1. Access the project's [releases page](https://github.com/mtpontes/winget-list-handler/releases).
2. Download the latest version of the `winget-handler.exe` file.
3. Keep this `.exe` in an isolated directory for better use.

<details>
  <summary><h3>1️⃣ Configure Winget</h3></summary>

Before you start using the solution, check if you have winget installed and configured correctly on your machine.

By default, Winget is already installed on Windows 10/11 systems, but if you don't have it, get it from its official [repository](https://github.com/microsoft/winget-cli?tab=readme-ov-file). Just go to the releases page and download the package with the `.msixbundle` extension in _assets_ and run the installation.

[Official Winget-cli](https://github.com/microsoft/winget-cli?tab=readme-ov-file)

Use the following command to check if Winget is installed:

```sh
winget --version
```

Then use the following command and accept the Microsoft Store terms:

```sh
winget list
```

When asked about the Microsoft Store terms, press `Y` to accept.

If this term is not accepted, it will not be possible to use the solution. This term is from Microsoft for use of the
Winget tool and has no direct relation to the application, however, this solution is based on the Winget tool and
relies on it being properly configured to work.

</details>

<details>
  <summary><h3>2️⃣ Generate reports before system reinstallation</h3></summary>

Before before system reinstallation, run the application report generation. These reports are necessary for the solution
to install the current applications on the machine. In addition, it also provides a report with the list of applications that will not be installed by the solution, serving as a guideline for which apps you will need to install manually.

Run the command to generate the reference files for the installed applications:

```sh
# Powershell
./winget-handler --generate-files

# CMD
winget-handler --generate-files
```

This will create a directory and two files where `winget-handler.exe` is running:

📁 **`generatedFiles`** → Contains the application reports.

📄 **`apps.json`** → Contains only the applications that can be reinstalled automatically via winget. It is crucial for the next step and operation of the solution.

📄 **`badApps.json`** → Lists the applications that **cannot** be reinstalled automatically, either due to lack of support in winget or due to problems with the output of the `winget list` command.

📄 **`fails.json`** → Lists the apps that presented some errors during the installation.

Copy the `generatedFiles` directory and the `winget-handler.exe` executable to a safe.

After that, you can reinstall the system.

</details>

<details>
  <summary><h3>3️⃣ Install applications after reinstalling the system</h3></summary>

After reinstall the system, recover the `generatedFiles` directory and the `winget-handler.exe` executable.

Then, run one of the three commands:

- **Install the apps one at a time**

  The packages will be installed **one by one** synchronously.

  ```sh
  # Powershell
  ./winget-handler --consume-file

  # CMD
  winget-handler --consume-file
  ```

- **Installs 5 apps simultaneously in a queue**

  When an installation is finished, start another one that is in the queue

  ```sh
  # Powershell
  ./winget-handler --consume-file --async

  # CMD
  winget-handler --consume-file --async
  ```

- **Allows you to define how many apps can be installed simultaneously**

  ```sh
  # Powershell
  ./winget-handler --consume-file --async-concurrency=<REPLACE_BY_A_NUMBER_FROM_1_TO_100>

  # CMD
  winget-handler --consume-file --async-concurrency=<REPLACE_BY_A_NUMBER_FROM_1_TO_100>
  ```

</details>

---

</details>

<details>
  <summary><h2>📌 Observations</h2></summary>

This process may take a while, as it depends on the speed of the package servers and the capacity of your hardware.

- Synchronous installation is slower, but consumes less RAM, CPU and storage writes.
- Asynchronous installation is faster, but the number of packages installed simultaneously can impact the overall performance of the machine, and may be limited by the write speed of the system's default storage.
- The default for asynchronous installations is 5 simultaneous packages.

</details>

<details>
  <summary><h2>❓ Known Issues</h2></summary>

- **Winget is not installed/configured**: Make sure Winget is installed and configured correctly.
- **Some applications were not reinstalled**: Check the `badApps.json` file and install manually.
- **Error running the executable**: Run as administrator and try again.
- **The app does not find the file exec.bat**: Keep the exec.bat file at the same `.exe` application level level. The .bat file was the way I found to circumvent some terminal limitations. For some specific applications it is necessary to insert a second input that may vary from package to package, but when the execution is done via .BAT This second input is ignored and the winget follows the normal flow.

If you encounter other problems, please open an [issue](https://github.com/mtpontes/winget-list-handler/issues) in the repository.

</details>

## ⭐ Show your support!
If this tool helped you, please consider giving the project a ⭐ on GitHub and sharing it with your friends. Your support helps keep it alive and increases its reach.

Thanks!
