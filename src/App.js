import logo from './logo.svg';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNodeFlow from './Node';

const initialEdges = JSON.parse(localStorage.getItem("edges"))?JSON.parse(localStorage.getItem("edges")):[]
let initialNodes=JSON.parse(localStorage.getItem("nodes"))?JSON.parse(localStorage.getItem("nodes")):[]
let id_cnt=0
if(JSON.parse(localStorage.getItem("nodes")))
  {JSON.parse(localStorage.getItem("nodes")).map((e)=>{if(e['id']>id_cnt){id_cnt=e.id}})
    id_cnt=1+parseInt(id_cnt)
  }
function App() {
  const [rd,set_rd] = useState([])
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)),[setEdges],);
  
  const [setting_flag,set_setting_flag]=useState("none")
  const [nodes_flag,set_nodes_flag]=useState("block")

  const [target_node,set_target_node]=useState("")
  const [target_node_content,set_target_node_content]=useState("")

  const [save_st,set_save_st]=useState("Save Changes")
  useEffect(()=>set_rd(0))

  function flip_display(e){
    if(e){
      set_setting_flag(setting_flag==="block"?"none":"block")
    set_nodes_flag(nodes_flag==="block"?"none":"block")
    }
    else{
      set_setting_flag("block")
      set_nodes_flag("none")
    }
    
  }

  function handle_drop(e){
    e.preventDefault();
  }

  function add_nodes(){
    initialNodes=[...nodes]
    initialNodes=[...initialNodes,{ id: String(id_cnt), position: { x: 100, y: 100 }, data: { label: String(id_cnt) } }]
    setNodes(initialNodes)
    id_cnt=id_cnt+1
  }

  function save(){
    console.log("saves, ",String(nodes))
    set_save_st("Saving")
    
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    console.log(localStorage.getItem("nodes"))
    console.log(localStorage.getItem("edges"))
    
    setTimeout(()=>{set_save_st("Save Changes")},1000)
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

  function erase(){
    setNodes([])
    setEdges([])
    id_cnt=0

  }

  function handle_node_click(e){

    console.log("clicked")
    
    set_target_node(e.target.dataset.id)
    set_target_node_content(e.target.innerText)
    console.log(e.target.dataset.id)
    console.log(e.target.innerText)
    flip_display(0)
  }

  return (
    <div className="App">
      <div className="nav">
        <div className='message'>hi</div>
        <div><button className="save" onClick={()=>save()}>{save_st}</button>
        <button onClick={erase}>Clear Board</button>
        </div>
      </div>

      <div className="content_parent">
        <div className="content" onDragOver={(e)=>handle_drop(e)} onDrop={()=>{add_nodes()}} >
            
            <CustomNodeFlow/>

        </div>
        <div className="nodes_panel" style={{display: nodes_flag}}>
          <div className='node_type' draggable="true"  title="message">Messages</div>
        </div>
        <div className="settings_panel" style={{display: setting_flag}} >
          <div className='settings_content'>
            <input value={target_node_content} onKeyDown={(e)=>{if(e.key === 'Enter'){edit_nodes()}}} onChange={(e)=>{console.log(nodes);set_target_node_content(e.target.value);}}></input>
            <button onClick={()=>edit_nodes()}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
