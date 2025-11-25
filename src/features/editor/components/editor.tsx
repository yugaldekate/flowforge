"use client";

import { useState, useCallback, useMemo } from 'react';

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

import '@xyflow/react/dist/style.css';
import { nodeComponents } from '@/config/node-components';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange, type Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import { AddNodeButton } from './add-node-button';
import { ExecuteWorkflowButton } from './execute-workflow-button';

import { useSetAtom } from 'jotai';
import { editorAtom } from '@/features/editor/store/atoms';
import { NodeType } from '@/generated/prisma/enums';

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const workflow = useSuspenseWorkflow(workflowId);

    //sending data using Jotai because we can't access Nodes & Edges data using useReactFlow() outside of reactflow canvas
    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.data.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.data.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
    }, [nodes]);

    return (
        <div className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                onInit={(data) => setEditor(data)}
                fitView
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
                panOnDrag={false}
                selectionOnDrag
                proOptions={{ hideAttribution: true }}
            >
                <Background/>
                <Controls/>
                <MiniMap/>
                <Panel position="top-right">
                    <AddNodeButton/>
                </Panel>
                {hasManualTrigger &&  (
                    <Panel position="bottom-center">
                        <ExecuteWorkflowButton workflowId={workflowId}/>
                    </Panel>
                )}
            </ReactFlow>    
        </div>
    );
}

export const EditorLoading = () => {
    return (
        <LoadingView message="Loading editor..."/>
    );
}

export const EditorError = () => {
    return (
        <ErrorView message="Error loading editor"/>
    );
}