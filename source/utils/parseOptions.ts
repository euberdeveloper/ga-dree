import * as core from '@actions/core';

import { Options } from '@/types/Options.js';

export function parseOptions(): Options {
    const targetPath = core.getInput('targetPath');
    const comment = core.getInput('comment');
    const root = core.getInput('root');
    const config = core.getInput('config');
    const showMadeWithDree = core.getInput('showMadeWithDree') === 'true';
    const exclude = core.getInput('exclude').split(',');

    return {
        targetPath,
        comment,
        root,
        config,
        showMadeWithDree,
        exclude
    };
}
