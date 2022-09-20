import chalk from 'chalk';

type LogType = 'error' | 'warn' | 'success' | 'info';
interface Log {
  type: LogType,
  message: string;
  data?: any;
}

class Logger {
  #logs: Log[] = [];

  #insertLog(type: LogType, message: string, data?: any) {
    this.#logs.push({ type, message, data });
  }
  
  public get logs() : Log[] {
    return this.#logs;
  }

  error(message: string, data?: any) {
    console.log(chalk.red(`[Error] ${message}`));
    this.#insertLog('error', message, data);
  }

  info(message: string, data?: any) {
    console.log(chalk.blue(`[Info] ${message} | ${new Date().toLocaleString()}`));
    this.#insertLog('info', message, data);
  }

  success(message: string, data?: any) {
    console.log(chalk.green(`[Success] ${message}`));
    this.#insertLog('success', message, data);
  }

  warn(message: string, data?: any) {
    console.log(chalk.yellow(`[Warn] ${message}`));
    this.#insertLog('warn', message, data);
  }
}

const logger = new Logger();
export default logger;