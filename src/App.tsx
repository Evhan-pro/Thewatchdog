import React, { useEffect, useState } from 'react';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { TreeNode } from 'primereact/treenode';
import transformData from './utils/transformData';
import RegisterDetails from './components/RegisterDetails';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface Register {
    name: string;
    topic: string;
    unit: string;
    value: number;
}

const App: React.FC = () => {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [filteredNodes, setFilteredNodes] = useState<TreeNode[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
    const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
    const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);

    useEffect(() => {
        fetch('/registers.json')
            .then(response => response.json())
            .then(data => {
                const transformedData: TreeNode[] = transformData(data);
                setNodes(transformedData);
                setFilteredNodes(transformedData);
            });
    }, []);

    const filterTree = (nodes: TreeNode[], searchTerm: string): TreeNode[] => {
        let newExpandedKeys: { [key: string]: boolean } = {};

        const filterNodes = (nodeList: TreeNode[], parentMatched: boolean = false): TreeNode[] => {
            return nodeList.map(node => {
                const newNode = { ...node };
                let matches = newNode.label!.toLowerCase().includes(searchTerm.toLowerCase());

                if (newNode.children) {
                    newNode.children = filterNodes(newNode.children, matches || parentMatched);
                }

                if (matches || parentMatched || (newNode.children && newNode.children.length > 0)) {
                    newExpandedKeys[newNode.key as string] = true;
                    return newNode;
                }

                return null;
            }).filter(node => node !== null) as TreeNode[];
        };

        const filtered = filterNodes(nodes);
        setExpandedKeys(newExpandedKeys);
        return filtered;
    };

    useEffect(() => {
        if (searchTerm) {
            setFilteredNodes(filterTree(nodes, searchTerm));
        } else {
            setFilteredNodes(nodes);
            setExpandedKeys({});
        }
    }, [searchTerm, nodes]);

    const onNodeSelect = (event: any) => {
        if (event.node.data) {
            setSelectedRegister(event.node.data);
        } else {
            setSelectedRegister(null);
        }

        let keys = { ...expandedKeys };
        keys[event.node.key] = true;
        setExpandedKeys(keys);
    };

    return (
        <div className="container mt-5">
            <div className="header">
                <img src="/logo.webp" alt="Logo" className="logo"/>
                <h1>Registres des systèmes électroniques</h1>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <InputText 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher des systèmes..."
                        className="w-100"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="tree-container card">
                        <div className="card-header">Liste des systèmes</div>
                        <div className="card-body">
                            <Tree
                                value={filteredNodes}
                                expandedKeys={expandedKeys}
                                onToggle={e => setExpandedKeys(e.value)}
                                selectionMode="single"
                                selectionKeys={selectedNodeKey}
                                onSelectionChange={e => setSelectedNodeKey(e.value)}
                                onSelect={onNodeSelect}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    {selectedRegister && (
                        <div className="details-container card">
                            <div className="card-header">Détails du système</div>
                            <div className="card-body">
                                <RegisterDetails register={selectedRegister} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
