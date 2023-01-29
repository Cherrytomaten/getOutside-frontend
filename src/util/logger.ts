import { LogLevel } from '@/types/LogLevel';
import { LOG_LEVEL } from '@/types/constants';

interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

export interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

const NO_OP: LogFn = (_message?: any, ..._optionalParams: any[]) => {};

class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    this.error = console.error.bind(console);

    if (level === 'error') {
      this.warn = NO_OP;
      this.log = NO_OP;

      return;
    }

    this.warn = console.warn.bind(console);

    if (level === 'warn') {
      this.log = NO_OP;

      return;
    }

    this.log = console.log.bind(console);
  }

  static log(message?: any, ...optionalParams: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...optionalParams);
    }
  }

  static warn(message?: any, ...optionalParams: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, ...optionalParams);
    }
  }

  static error(message?: any, ...optionalParams: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, ...optionalParams);
    }
  }
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });
