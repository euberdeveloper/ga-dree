export interface MockActionsCoreGetInput {
    targetPath?: string;
    comment?: string;
    root?: string;
    config?: string;
    showMadeWithDree?: string;
    exclude?: string;
}

export const mockActionsCoreGetInput = jest.fn();

jest.mock('@actions/core', () => ({
    getInput: mockActionsCoreGetInput
}));
