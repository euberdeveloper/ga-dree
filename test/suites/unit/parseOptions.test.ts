import { mockActionsCoreGetInput, MockActionsCoreGetInput } from '@test/utils/mockActionsCore.js';

import { parseOptions } from '@src/utils/parseOptions.js';

describe('Test utility parseOptions', function () {
    it('Should work with options of a default status`', function () {
        const status: MockActionsCoreGetInput = {
            targetPath: './README.md',
            config: '',
            comment: 'dree',
            exclude: '.git/',
            root: '.',
            showMadeWithDree: 'true'
        };
        mockActionsCoreGetInput.mockImplementation((name: string) => status[name]);

        const options = parseOptions();
        expect(options).toEqual({
            ...status,
            showMadeWithDree: true,
            exclude: [status.exclude]
        });
    });

    it('Should work with options of a custom status`', function () {
        const status: MockActionsCoreGetInput = {
            targetPath: './docs/README.md',
            config: './config.dree.json',
            comment: 'mycomment',
            exclude: '.boh/',
            root: '.',
            showMadeWithDree: 'true'
        };
        mockActionsCoreGetInput.mockImplementation((name: string) => status[name]);

        const options = parseOptions();
        expect(options).toEqual({
            ...status,
            showMadeWithDree: true,
            exclude: [status.exclude]
        });
    });

    it('Should handle well array split and boolean`', function () {
        const status: MockActionsCoreGetInput = {
            targetPath: './README.md',
            config: '',
            comment: 'dree',
            exclude: '.git/,.github/',
            root: '.',
            showMadeWithDree: 'false'
        };
        mockActionsCoreGetInput.mockImplementation((name: string) => status[name]);

        const options = parseOptions();
        expect(options).toEqual({
            ...status,
            showMadeWithDree: false,
            exclude: ['.git/', '.github/']
        });
    });
});
