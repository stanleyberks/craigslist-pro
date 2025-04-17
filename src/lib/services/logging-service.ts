import { captureError, captureMessage } from '../sentry';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string;
  alertId?: string;
  matchId?: string;
  [key: string]: any;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextString = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextString}`;
  }

  public debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LogLevel.INFO, message, context));
    if (!this.isDevelopment) {
      captureMessage(message, context);
    }
  }

  public warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
    if (!this.isDevelopment) {
      captureMessage(message, { level: 'warning', ...context });
    }
  }

  public error(error: Error | string, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : error;
    console.error(this.formatMessage(LogLevel.ERROR, errorMessage, context));
    
    if (!this.isDevelopment) {
      if (error instanceof Error) {
        captureError(error, context);
      } else {
        captureError(new Error(error), context);
      }
    }
  }

  public async logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): Promise<void> {
    const message = `${method} ${path} | Status: ${statusCode} | Duration: ${duration}ms`;
    
    if (statusCode >= 500) {
      this.error(message, context);
    } else if (statusCode >= 400) {
      this.warn(message, context);
    } else {
      this.debug(message, context);
    }

    // Log to database for analytics if in production
    if (!this.isDevelopment) {
      try {
        await this.logToDatabase('api_request', {
          method,
          path,
          statusCode,
          duration,
          ...context,
        });
      } catch (error) {
        this.error('Failed to log to database', { error, context });
      }
    }
  }

  private async logToDatabase(
    eventType: string,
    data: Record<string, any>
  ): Promise<void> {
    // Implementation for database logging
    // This could write to a separate logging table in Supabase
    // or send to a dedicated logging service
  }
}

export const logger = Logger.getInstance();
