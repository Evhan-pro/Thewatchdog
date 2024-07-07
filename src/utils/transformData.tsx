import { TreeNode } from 'primereact/treenode';

interface Register {
    name: string;
    topic: string;
    unit: string;
    value: number;
}

const transformData = (data: Register[]): TreeNode[] => {
    const root: TreeNode[] = [];

    data.forEach(register => {
        const levels = register.topic.split('/');
        let currentLevel = root;

        levels.forEach((level, index) => {
            let existingNode = currentLevel.find(node => node.label === level);

            if (!existingNode) {
                existingNode = {
                    key: levels.slice(0, index + 1).join('/'),
                    label: level,
                    children: []
                };
                currentLevel.push(existingNode);
            }

            if (index === levels.length - 1) {
                existingNode.data = register;
            } else {
                currentLevel = existingNode.children as TreeNode[];
            }
        });
    });

    return root;
};

export default transformData;
