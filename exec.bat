@echo off
setlocal

REM Verifica se o nome do pacote foi passado como parâmetro
if "%~1"=="" (
    echo Uso: install-package.bat "Nome do Pacote"
    exit /b 1
)

REM Recebe o nome do pacote do parâmetro
set PACKAGE=%~1

REM Instala o pacote usando winget
winget install "%PACKAGE%" --accept-source-agreements --accept-package-agreements

REM Verifica o código de saída do winget
if %ERRORLEVEL% EQU 0 (
    echo Pacote "%PACKAGE%" instalado com sucesso.
) else (
    echo Falha ao instalar o pacote "%PACKAGE%". Verifique o nome do pacote ou erros no winget.
)

exit /b %ERRORLEVEL%
