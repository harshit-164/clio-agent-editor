import { FileSystemTree } from '@webcontainer/api';
import { TemplateFolder, TemplateFile } from '@/features/playground/types';

/**
 * Converts TemplateFolder structure to WebContainer FileSystemTree format
 */
export function convertToFileSystemTree(template: TemplateFolder): FileSystemTree {
    const tree: FileSystemTree = {};

    function processItems(items: (TemplateFile | TemplateFolder)[], parentTree: FileSystemTree) {
        for (const item of items) {
            if ('folderName' in item) {
                // It's a folder
                const folderTree: FileSystemTree = {};
                processItems(item.items, folderTree);
                parentTree[item.folderName] = {
                    directory: folderTree
                };
            } else {
                // It's a file
                const fileName = `${item.filename}.${item.fileExtension}`;
                parentTree[fileName] = {
                    file: {
                        contents: item.content || ''
                    }
                };
            }
        }
    }

    processItems(template.items, tree);
    return tree;
}
