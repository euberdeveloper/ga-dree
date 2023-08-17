import * as core from '@actions/core';
import logger from 'euberlog';

import { parseOptions } from './utils/parseOptions.js';
import { injectDree } from './utils/injectDree.js';

try {
    logger.info('Parsing options...');
    const options = parseOptions();
    logger.debug('Options', options);
    logger.info('Injecting dree in file...');
    const changed = injectDree(options);
    logger.info('Setting output fileChanged with', changed);
    core.setOutput('fileChanged', changed);
    logger.success('Action finished successfully!!!');
} catch (error: any) {
    console.error('Error in executing action', error);
    core.setFailed(error.message);
}
