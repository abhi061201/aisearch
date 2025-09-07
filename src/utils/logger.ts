import { APP_CONFIG } from '../config/appConfig';

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LoggerConfig {
  enableProductionLogs: boolean;
  enableDebugMode: boolean;
  logLevel: LogLevel;
}

// Logger configuration
const LOGGER_CONFIG: LoggerConfig = {
  enableProductionLogs: APP_CONFIG.ENABLE_PRODUCTION_LOGS, // Controlled by app config
  enableDebugMode: APP_CONFIG.DEBUG_MODE,
  logLevel: LogLevel.INFO,
};

// Helper function to check if logging should be enabled
const shouldLog = (level: LogLevel, forceInProduction?: boolean): boolean => {
  // Always log in debug/dev mode
  if (LOGGER_CONFIG.enableDebugMode) {
    return true;
  }
  
  // If forceInProduction is true, always log regardless of config
  if (forceInProduction) {
    return true;
  }
  
  // In production, only log if production logs are enabled
  if (LOGGER_CONFIG.enableProductionLogs) {
    // Check log level hierarchy: ERROR > WARN > INFO > DEBUG
    const levelPriority = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    };
    
    return levelPriority[level] >= levelPriority[LOGGER_CONFIG.logLevel];
  }
  
  return false;
};

// Format log message with timestamp and level
const formatMessage = (level: LogLevel, message: string, data?: any): string => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (data) {
    return `${prefix} ${message} | Data: ${JSON.stringify(data, null, 2)}`;
  }
  
  return `${prefix} ${message}`;
};

// Logger functions
export const debug = (message: string, data?: any, forceInProduction?: boolean) => {
  if (shouldLog(LogLevel.DEBUG, forceInProduction)) {
    console.log(formatMessage(LogLevel.DEBUG, message, data));
  }
};

export const info = (message: string, data?: any, forceInProduction?: boolean) => {
  if (shouldLog(LogLevel.INFO, forceInProduction)) {
    console.info(formatMessage(LogLevel.INFO, message, data));
  }
};

export const warn = (message: string, data?: any, forceInProduction?: boolean) => {
  if (shouldLog(LogLevel.WARN, forceInProduction)) {
    console.warn(formatMessage(LogLevel.WARN, message, data));
  }
};

export const error = (message: string, error?: any, forceInProduction?: boolean) => {
  if (shouldLog(LogLevel.ERROR, forceInProduction)) {
    console.error(formatMessage(LogLevel.ERROR, message, error));
  }
};

// Legacy function for backward compatibility
export const log = (message: string, data?: any, forceInProduction?: boolean) => {
  info(message, data, forceInProduction);
};

// Function to update logger configuration at runtime
export const updateLoggerConfig = (config: Partial<LoggerConfig>) => {
  Object.assign(LOGGER_CONFIG, config);
};

// Function to get current configuration
export const getLoggerConfig = (): LoggerConfig => {
  return { ...LOGGER_CONFIG };
};

// Export logger object for convenience (maintains same API)
export const logger = {
  debug,
  info,
  warn,
  error,
  log,
  updateConfig: updateLoggerConfig,
  getConfig: getLoggerConfig,
};

// Export for backward compatibility
export default logger;