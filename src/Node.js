import { useCallback } from 'react';
import ReactFlow, { addEdge, Position, useNodesState, useEdgesState } from 'reactflow';
import {  useEffect, useState } from 'react';
import './App.css';
import 'reactflow/dist/style.css';

import CustomNode from './Customnode';

const nodeTypes = {
    custom: CustomNode,
};

let initialNodes = JSON.parse(localStorage.getItem("nodes"))?JSON.parse(localStorage.getItem("nodes")):[]
let initialEdges=JSON.parse(localStorage.getItem("edges"))?JSON.parse(localStorage.getItem("edges")):[]
let id_cnt=0
if(JSON.parse(localStorage.getItem("nodes")).length !==0)
  {
    JSON.parse(localStorage.getItem("nodes")).map((e)=>{if(e['id']>id_cnt){id_cnt=e.id}})
    id_cnt=1+parseInt(id_cnt)
  }
  const onElementClick = (event, element) => console.log("click", element);

const CustomNodeFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const [target_node,set_target_node]=useState("")
    const [target_node_content,set_target_node_content]=useState("")
    const [setting_flag,set_setting_flag]=useState("none")
    const [nodes_flag,set_nodes_flag]=useState("block")
    const [save_st,set_save_st]=useState("Save Changes")
    const [message,set_message]=useState("")
  
    function add_nodes(){
        console.log(nodes)
        initialNodes=[...nodes]
        initialNodes=[...initialNodes,{ id: String(id_cnt),type:'custom' ,position: { x: 100, y: 100 }, data: { label: String(id_cnt) } }]
        setNodes(initialNodes)
        console.log(initialNodes)
        id_cnt=id_cnt+1
      }

    function edit_nodes(){
        console.log("yes")
    setNodes((nds)=>
    nds.map((node)=>{
      if (node.id === target_node){
        node.data = {
          ...node.data,
          label:target_node_content
        }
      }return node;
    }))
    flip_display(1)
    }
    function flip_display(e){
      console.log(e)
        if(e===0){
          set_setting_flag(setting_flag==="block"?"none":"block")
        set_nodes_flag(nodes_flag==="block"?"none":"block")
        }
        else if(e===1){
          set_setting_flag("none")
          set_nodes_flag("block")
        }
        else if(e===2){
          console.log('here')
          set_setting_flag("block")
          set_nodes_flag("none")
        }
        
    }
    function save(){
        set_save_st("Saving")
        console.log(nodes)
        console.log(edges)
        let li=nodes.map((e)=>{return e['id']})
        let lt=edges.map((e)=>{return e['target']})
        let intersection = li.filter(x => !lt.includes(x));
        if(intersection.length> 1){
          set_message("More than one node having Empty Target handles !!!")
          setTimeout(()=>{set_message("")},2000)
        }
  
        localStorage.setItem("nodes", JSON.stringify(nodes));
        localStorage.setItem("edges", JSON.stringify(edges));

        
        setTimeout(()=>{set_save_st("Save Changes")},1000)
    }
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );
    function erase(){
        setNodes([])
        setEdges([])
        flip_display(1)
        id_cnt=0
    
      }
      function handle_drop(e){
        e.preventDefault();
      }
      function handle_node_click(e){


        let obj = e.target[Object.keys(e.target)[1]]

        set_target_node(obj['idc'])
        set_target_node_content(e.target.innerText)

        flip_display(2)
      }
    return (
        <div className="App">
      <div className="nav">
        <div className='message'>{message}</div>
        <div><button className="save" onClick={()=>{save()}}>{save_st}</button>
        <button onClick={erase} className='clear'>Clear Board</button>
        </div>
      </div>

      <div className="content_parent">
        <div className="content" onDragOver={(e)=>handle_drop(e)} onDrop={()=>{add_nodes()}} >
            
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(e)=>handle_node_click(e)}
            fitView
        />

        </div>
        <div className="nodes_panel" style={{display: nodes_flag}}>
          <div className='node_type' draggable="true"  title="message">Messages</div>
        </div>
        <div className="settings_panel" style={{display: setting_flag}} >
          
          <div className='settings_content'>
          <button className='back' onClick={()=>flip_display(1)}>Back</button>
            <input className='ip' value={target_node_content} onKeyDown={(e)=>{if(e.key === 'Enter'){edit_nodes()}}} onChange={(e)=>{console.log(nodes);set_target_node_content(e.target.value);}}></input>
            <button className='update' onClick={()=>edit_nodes()}>Update</button>
          </div>
        </div>
      </div>
    </div>
        
    );
};

export default CustomNodeFlow;
