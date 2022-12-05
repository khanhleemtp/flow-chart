import { Handle, NodeProps, Position } from '@reactflow/core'
import { Node } from 'reactflow'
import { NodeData } from '../types'



function CustomNode (nodeProps: NodeProps<NodeData>) {
  return (
    <div style={{
      background: '#25c361',
      padding: '10px',
      width: 120,
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      }}>
      <Handle type="target" position={Position.Left} />
      <p>{nodeProps.id.substring(1,4) || 'Start'}</p>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default CustomNode