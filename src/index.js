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
    this.cfg = {};
    this.timers = {};
  }

  init(config) {
    const transports = [];

    this.cfg.console = Object.assign({
      level: 'none',
      colorize: true,
    }, config.console);
    
    this.cfg.loggly = Object.assign({
      level: 'none',
      token: null,
      subdomain: null,
      tags: [],
    }, config.loggly);

    if (this.cfg.console.level !== 'none') {
      transports.push(new Transports.Console({
        colorize: this.cfg.console.colorize,
        prettyPrint: true,
        timestamp: true,
        level: this.cfg.console.level,
      }));
    }

    if (this.cfg.loggly.level !== 'none') {
      transports.push(new Transports.Loggly({
        level: this.cfg.loggly.level,
        inputToken: this.cfg.loggly.token,
        subdomain: this.cfg.loggly.subdomain,
        tags: [os.hostname()].concat(this.cfg.tags).filter(tag => tag !== undefined),
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

  startTimer(name) {
    this.timers[name] = Date.now();
  }

  stopTimer(name, log = 'debug') {
    if (!this.timers[name]) {
      throw new Error(`Unknown timer ${name}`);
    }

    this[log](name, { duration: Date.now() - this.timers[name] });
    delete this.timers[name];
  }
}

export default new Logger();
