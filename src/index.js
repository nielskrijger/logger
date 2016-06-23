import {
  Logger as WinstonLogger,
  transports as Transports,
} from 'winston';
import 'winston-loggly';
import os from 'os';

/**
 * Configures logger.
 */
class Logger {

  constructor() {
    this.logger = null;
  }

  init(config) {
    const transports = [];
    const cfg = Object.assign({
      console: {
        level: 'none',
      },
      loggly: {
        level: 'none',
        token: null,
        subdomain: null,
        tags: [],
      },
    }, config);

    if (cfg.console.level !== 'none') {
      transports.push(new Transports.Console({
        colorize: true,
        prettyPrint: true,
        timestamp: true,
        level: cfg.console.level,
      }));
    }

    if (cfg.loggly.level !== 'none') {
      transports.push(new Transports.Loggly({
        level: cfg.loggly.level,
        inputToken: cfg.loggly.token,
        subdomain: cfg.loggly.subdomain,
        tags: [os.hostname()].concat(config.tags).filter(tag => tag !== undefined),
        json: true,
      }));
    }

    this.logger = new WinstonLogger({ transports });
  }

  debug() {
    this.logger.debug.apply(this, arguments);
  }

  info() {
    this.logger.info.apply(this, arguments);
  }

  warn() {
    this.logger.warn.apply(this, arguments);
  }

  error() {
    this.logger.error.apply(this, arguments);
  }
}

export default new Logger();
