import { Connection, EdgeProps, Position } from '@reactflow/core';
import { v4 as uuidv4 } from 'uuid';
import  { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  ReactFlowProvider,
  Edge
} from 'reactflow';
import * as d3 from "d3-hierarchy";
// width: 120,
// height: 20,

import 'reactflow/dist/style.css';
import CustomNode from './components/CustomNode';
import { NodeData } from './types';

const initNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'custom',
    data: {
      label: 'Input Node',
    },
    position: { x: 250, y: 5 },
  },
]

const initEdges: Edge[] =[
]

const nodeWidth = 120;
const nodeHeight = 20;

const getLayoutedElements = (nodes: Node<NodeData>[], edges: Edge[], direction = "LR") => {
  const isHorizontal = direction === "LR";
  const map = nodes.reduce((prev, node) => {
    return { ...prev, [node.id]: [] };
  }, {});
  edges.forEach((edge) => {
    const target = edge.target;
    (map[target as keyof typeof map] as  any).push(edge.source);
  });
  const root = d3
    .stratify() 
    .id((d: any) => d.id)
    .parentId((d: any) => map[d.id as keyof typeof map])(nodes);
  const tree = d3
    .tree()
    .nodeSize(
      isHorizontal
        ? [nodeHeight * 2.5, nodeWidth * 1.5]
        : [nodeWidth, nodeHeight * 2.5]
    )(root);
  const newNodes = [] as Node<NodeData>[];
  tree.each((node) => {
    (node.data as Node<NodeData>).targetPosition = isHorizontal ? Position.Left : Position.Top;
    (node.data as Node<NodeData>).sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    console.log(node.x, node.y);
    (node.data as Node<NodeData> ).position = isHorizontal
      ? {
          x: node.y,
          y: node.x
        }
      : {
          x: node.x,
          y: node.y
        };
    newNodes.push(node.data as Node<NodeData>);
  });
  return { nodes: newNodes, edges };
};



const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};


const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), []);

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example

  const addNodes = (node: Node<NodeData>) => {
    const newNodes = 
      {
        id: uuidv4(),
        type: 'custom',
        data: {
          label: 'Output Node',
        },
        position: { x: 250, y: 250 },
      }
    

    // add edges
    const newEdges: Edge = {
      id: uuidv4(),
      source: node.id,
      target: newNodes.id,
      type: 'smoothstep',
      animated: true,
    }

    console.log('====================================');
    console.log('run addNodes');
    console.log('====================================');



   const { nodes: lNodes, edges: lEdges} = getLayoutedElements([...nodes, newNodes], [...edges, newEdges]);
    setNodes([...lNodes]);
    setEdges([...lEdges]);
  }


  return (
    <ReactFlowProvider>
  <div style={{
    width: '100vw',
    height: '100vh',
  }}>

    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      onNodeClick={(event, node) => addNodes(node)}
      
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
</div>
    </ReactFlowProvider>
  );
};

export default OverviewFlow;
