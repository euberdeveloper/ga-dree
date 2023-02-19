import * as fs from 'fs';
import * as dree from 'dree';

import { Options } from '@/types/Options';

function getDreeOptions(options: Options): dree.ParseOptions | undefined {
    return options.config ? JSON.parse(fs.readFileSync(options.config, 'utf-8')) : { exclude: options.exclude };
}

function getMarkdownComments(options: Options): [string, string, string] {
    return [options.comment, `${options.comment} - BEGIN`, `${options.comment} - END`].map(
        comment => `[//]: # (${comment})`
    ) as [string, string, string];
}

function generateInjetedText(
    dreeResult: string,
    [commentBegin, commentEnd]: [string, string],
    showMadeWithDree: boolean
): string {
    const madeWithDreeText = showMadeWithDree
        ? '\nMade with [dree](https://github.com/marketplace/actions/ga-dree)\n\n'
        : '';
    return `${commentBegin}${madeWithDreeText}
\`\`\`
${dreeResult}
\`\`\`
${commentEnd}
`;
}

function getInjectedText(options: Options): string {
    const dreeOptions = getDreeOptions(options);
    const dreeResult = dree.parse(options.root, dreeOptions);
    const [_comment, commentBegin, commentEnd] = getMarkdownComments(options);
    return generateInjetedText(dreeResult, [commentBegin, commentEnd], options.showMadeWithDree);
}

function getMarkdownContentBeginEnd(
    content: string,
    commentBegin: string,
    commentEnd: string,
    injectedText: string
): string {
    // Assumption: each begin is followed by an end and between them there is not a begin. For each begin there is exactly one closing end.
    if (content.includes(commentBegin)) {
        const beginParts = content.split(commentBegin);
        return (
            beginParts[0] +
            beginParts
                .slice(1)
                .map(beginPart => {
                    const endParts = beginPart.split(commentEnd);
                    return injectedText + endParts.slice(1).join('');
                })
                .join('')
        );
    } else {
        return content;
    }
}

function getMarkdownContent(options: Options, injectedText: string): string {
    const [comment, commentBegin, commentEnd] = getMarkdownComments(options);
    const content = fs.readFileSync(options.targetPath, 'utf8');
    const contentCommentBeginEnd = getMarkdownContentBeginEnd(content, commentBegin, commentEnd, injectedText);
    const contentComment = contentCommentBeginEnd.replaceAll(comment, injectedText);
    return contentComment;
}

export function injectDree(options: Options): void {
    const injectedText = getInjectedText(options);
    const content = getMarkdownContent(options, injectedText);
    fs.writeFileSync(options.targetPath, content);
}
