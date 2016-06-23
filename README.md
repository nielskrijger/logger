# Logger

A small wrapper around the [Winston loggly](https://github.com/winstonjs/winston-loggly) library.

**NOTE**: this library is not very customizable nor will it be, its intent is to serve as a standard for my projects.

# Install

```
npm install --save @nielskrijger/logger
```

# Configuration

Use the library like this:

```
import log from '@nielskrijger/logger';

log.init({
  console: {
    level: 'debug',
  },
  loggly: {
    level: 'info',
    subdomain: 'test',
    token: '99f026e6-fb0b-443c-8b1b-c6e666f5a6c1',
    tags: ['my-domain'],
  },
});

log.debug('Debug this', { object: 'value' });
log.info('Starting server');
log.warn('Watch out!');
log.error('Error', { test: 'Extra properties!' });
```

**Options**

- `console.level`: possible values `none`, `debug`, `info`, `warn`, `error`. To disable all logging set to `none`. Default `none`.
- `loggly.level`: possible values `none`, `debug`, `info`, `warn`, `error`. To disable all logging set to `none`. Default `none`.
- `loggly.token`: the Loggly token, required when `loggly.level !== 'none'`.
- `loggly.subdomain`: the Loggly subdomain, required when `loggly.level !== 'none'`.
- `loggly.tags`: tags added to the log statement. The `os.hostname()` is always added in addition to any tags you specify. Default `[]`.
