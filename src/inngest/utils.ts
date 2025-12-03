import toposort from "toposort";

import { inngest } from "./client";
import { Node, Connection} from "@/generated/prisma/client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = ( nodes: Node[], connections: Connection[]): Node[] => {
    // If no connections return nodes as-is (all nodes are independent)
    if(connections.length === 0){
        return nodes;
    }

    // Create the edges array for topo-sort
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ]);

    // Add nodes with no connections as self-edges to ensure they are included
    const connectedNodeIds = new Set<string>();
    for(const conn of connections){
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id, node.id]);
        }
    }

    //Perform topo-sort
    let sortedNodeIds: string[];

    try{
        sortedNodeIds = toposort(edges);
        //Remove duplicates(from self edges)
        sortedNodeIds = [...new Set(sortedNodeIds)]; // insertion order will node change as in C++

    } catch(error) {
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow contains a cycle");
        }
        throw error;
    }

    // Map sorted IDs back to node objects
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean); //Node[]
}

export const sendExecutionWorkflow = async (data: { workflowId: string; [key: string]: any }) => {
    return inngest.send({
        name: "workflows/execute.workflow",
        data: data,
        id: createId(),
    });
}