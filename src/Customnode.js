import React, { memo } from 'react';
import { Position, useNodeId } from 'reactflow';
import CustomHandle from './CustomHandle';

const CustomNode = ({ id,data }) => {
    return (
        
        <div idc={id} style={{ background: 'white',display:'flex',justifyContent:'center',width:50, padding: 10, border: '1px solid black' }}>
            <CustomHandle type="target" position={Position.Left}/>
            <CustomHandle type="source" position={Position.Right} isConnectable={1} />
            {data.label}
        </div>    );
};

export default memo(CustomNode);
