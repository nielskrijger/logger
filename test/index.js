import { expect } from 'chai';
import log from '../src';

/**
 * Captures all stream output and buffers it in an array.
 */
function captureStream(stream) {
  const oldWrite = stream.write;
  const output = [];
  stream.write = (chunk) => {
    output.push(chunk.toString()); // chunk is a String or Buffer
  }

  return {
    unhook: () => {
     stream.write = oldWrite;
    },
    captured: output,
  };
}

describe('Logger', () => {
  let stdoutCapture = null;
  let stderrCapture = null;
  let stopCapture = null;

  beforeEach(() => {
    log.init({
      console: {
        level: 'debug',
        colorize: false,
      },
    });
    stdoutCapture = captureStream(process.stdout);
    stderrCapture = captureStream(process.stderr);
    stopCapture = () => {
      stdoutCapture.unhook();
      stderrCapture.unhook();
    };
  });

  describe('log(...)', () => {
    it('should throw error when not connected', () => {
      log.debug('Debug message');
      log.info('Info message');
      log.warn('Warning message');
      log.error('Error message');
      stopCapture();

      expect(stderrCapture.captured[0]).to.contain('debug');
      expect(stderrCapture.captured[0]).to.contain('Debug message');
      expect(stderrCapture.captured[1]).to.contain('error');
      expect(stderrCapture.captured[1]).to.contain('Error message');
      expect(stdoutCapture.captured[0]).to.contain('info');
      expect(stdoutCapture.captured[0]).to.contain('Info message');
      expect(stdoutCapture.captured[1]).to.contain('warn');
      expect(stdoutCapture.captured[1]).to.contain('Warning message');
    });

    it('should throw error when not connected', () => {
      log.init({
        console: {
          level: 'none',
        }
      });
      log.debug('Debug message');
      log.info('Info message');
      log.warn('Warning message');
      log.error('Error message');
      stopCapture();

      expect(stderrCapture.captured).to.have.length(0);
      expect(stdoutCapture.captured).to.have.length(0);
    });
  });

  describe('stopTimer(...)', () => {
    it('should throw error when timer does not exist', () => {
      stopCapture();
      expect(() => { log.stopTimer('test') }).to.throw(/Unknown timer test/);
    });

    it('should print time to specified logger', (cb) => {
      log.startTimer('testTimer');
      setTimeout(() => {
        log.stopTimer('testTimer');
          stopCapture();

          expect(stderrCapture.captured[0]).to.contain('debug');
          expect(stderrCapture.captured[0]).to.contain('testTimer');
          expect(stderrCapture.captured[0]).to.match(/\{ duration: 1[0-9]{2} \}/);
          cb();
      }, 100);
    });
  });
});
