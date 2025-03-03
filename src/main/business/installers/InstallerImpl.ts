import shelljs from "shelljs";
import { Queue } from "async-await-queue";

import type IInstaller from "./IInstaller";
import Constants from "../../domain/constants/Constants";
import type { ArgsType } from "../../infra/types/ArgsType";
import type { AppsComPackageType } from "../../infra/types/AppsComPackageType";
import FileUtils from "../../infra/utils/FileUtils";
const { exec } = shelljs;

export default class InstallerImpl implements IInstaller {
  /**
   * Instala os pacotes de forma síncrona, um por vez.
   *
   * @param {Array<AppsComPackageType>} packages - Lista de pacotes a serem instalados.
   */
  private instalacaoSync(packages: Array<AppsComPackageType>): void {
    for (const pkg of packages) {
      const command = `${Constants.ARQUIVO_BAT} ${pkg.id}`;
      console.log(command);

      exec(command, { silent: false });
      console.log("\n");
    }
  }

  /**
   * Instala os pacotes de forma assíncrona, com controle de concorrência.
   *
   * @param {Array<AppsComPackageType>} packages - Lista de pacotes a serem instalados.
   * @param {number} concurrency - Número máximo de instalações simultâneas.
   * @returns {Promise<void>} Uma Promise que resolve quando todos os pacotes forem instalados.
   */
  private async instalacaoAsync(packages: Array<AppsComPackageType>, concurrency: number): Promise<void> {
    console.log(`Iniciando a instalação de ${packages.length} pacotes com concorrência de ${concurrency}.`);
    const fails: Array<AppsComPackageType> = [];

    const queue = new Queue(concurrency);
    const tasks = packages.map((pkg, index) =>
      queue.run(async () => {
        const command = `${Constants.ARQUIVO_BAT} ${pkg.id}`;
        console.log(
          `[Pacote ${index + 1}/${packages.length}] Iniciando instalação do pacote ${pkg.id} com o comando: ${command}`
        );

        try {
          await new Promise((resolve, reject) => {
            exec(command, { silent: false, async: true }, (error, stdout, stderr) => {
              if (error) {
                console.error(`[Pacote ${index + 1}/${packages.length}] Erro ao instalar o pacote ${pkg.id}:`, error);
                reject(error);
              } else {
                console.log(`[Pacote ${index + 1}/${packages.length}] Pacote ${pkg.id} instalado com sucesso.`);
                resolve(stdout);
              }
            });
          });
        } catch (error) {
          console.error(`[Pacote ${index + 1}/${packages.length}] Falha na instalação do pacote ${pkg.id}.`, error);
          FileUtils.writeFails(fails);
        }
      })
    );
  }

  /**
   * Instala os pacotes de acordo com a opção de execução (síncrona ou assíncrona).
   *
   * @param {Array<AppsComPackageType>} packages - Lista de pacotes a serem instalados.
   * @param {Object} args - Opções de instalação.
   * @param {boolean} args.isAsync - Se true, a instalação será assíncrona.
   * @param {number} args.concurrency - Número máximo de instalações simultâneas (apenas para instalação assíncrona).
   * @returns {Promise<void>} Uma Promise que resolve quando a instalação for concluída.
   */
  public async install(packages: Array<AppsComPackageType>, args: ArgsType): Promise<void> {
    if (!args.isAsync) {
      this.instalacaoSync(packages);
    } else {
      this.instalacaoAsync(packages, args.concurrency!);
    }
  }
}
