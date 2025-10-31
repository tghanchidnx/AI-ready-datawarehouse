import React, { useState, useRef, useCallback } from 'react';
import type { Workflow, WorkflowNode, WorkflowEdge, AgentConfig } from '../../types';
import { Play, StopCircle, GitBranch, Bot, Database, Cog, Trash2, MousePointer2 } from 'lucide-react';
import Tooltip from '../common/Tooltip';

interface WorkflowEditorProps {
  workflow: Workflow;
  agents: AgentConfig[];
  onUpdate: (workflow: Workflow) => void;
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;
const PORT_SIZE = 8;

const nodeIcons: { [key: string]: React.ReactNode } = {
    Start: <Play className="text-green-400" size={20} />,
    End: <StopCircle className="text-red-400" size={20} />,
    Condition: <GitBranch className="text-yellow-400" size={20} />,
    Agent: <Bot className="text-purple-400" size={20} />,
    Action: <Cog className="text-blue-400" size={20} />,
};

const DraggableNode: React.FC<{ type: string; label: string; icon: React.ReactNode; data?: any }> = ({ type, label, icon, data }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/reactflow', JSON.stringify({ type, label, data }));
        e.dataTransfer.effectAllowed = 'move';
    };
    return (
        <div draggable onDragStart={handleDragStart} className="flex items-center gap-2 p-2 rounded-md bg-brand-secondary border border-brand-border cursor-grab hover:bg-brand-border">
            {icon} <span className="text-sm">{label}</span>
        </div>
    );
};

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflow, agents, onUpdate }) => {
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1200, height: 800 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
    const [drawingEdge, setDrawingEdge] = useState<{ source: string; x: number; y: number } | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const { clientX, clientY } = e;
        const svg = svgRef.current;
        if (!svg) return;

        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM()?.inverse());
        const newWidth = e.deltaY < 0 ? viewBox.width / zoomFactor : viewBox.width * zoomFactor;
        const newHeight = e.deltaY < 0 ? viewBox.height / zoomFactor : viewBox.height * zoomFactor;
        setViewBox({ width: newWidth, height: newHeight, x: viewBox.x + (svgX - viewBox.x) * (1 - newWidth / viewBox.width), y: viewBox.y + (svgY - viewBox.y) * (1 - newHeight / viewBox.height) });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || e.ctrlKey) {
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY });
        }
        setSelectedEdge(null); // Deselect edges when clicking canvas
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setDraggingNode(null);
        setDrawingEdge(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const svg = svgRef.current;
        if (!svg) return;
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM()?.inverse());
        
        if (isPanning) {
            const dx = (e.clientX - panStart.x) * (viewBox.width / svg.clientWidth);
            const dy = (e.clientY - panStart.y) * (viewBox.height / svg.clientHeight);
            setViewBox(vb => ({ ...vb, x: vb.x - dx, y: vb.y - dy }));
            setPanStart({ x: e.clientX, y: e.clientY });
        } else if (draggingNode) {
            const newX = svgX - draggingNode.offset.x;
            const newY = svgY - draggingNode.offset.y;
            const updatedNodes = workflow.nodes.map(n => n.id === draggingNode.id ? { ...n, position: { x: newX, y: newY } } : n);
            onUpdate({ ...workflow, nodes: updatedNodes });
        } else if (drawingEdge) {
            setDrawingEdge(d => d ? { ...d, x: svgX, y: svgY } : null);
        }
    };

    const onNodeMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
        if (e.button !== 0) return; e.stopPropagation();
        const svg = svgRef.current; if (!svg) return;
        const point = svg.createSVGPoint(); point.x = e.clientX; point.y = e.clientY;
        const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM()?.inverse());
        setDraggingNode({ id: node.id, offset: { x: svgX - node.position.x, y: svgY - node.position.y } });
    };

    const handlePortMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setDrawingEdge({ source: nodeId, x: e.clientX, y: e.clientY });
    };

    const handlePortMouseUp = (e: React.MouseEvent, targetNodeId: string) => {
        e.stopPropagation();
        if (drawingEdge && drawingEdge.source !== targetNodeId) {
            const newEdge: WorkflowEdge = { id: `e-${drawingEdge.source}-${targetNodeId}-${Date.now()}`, source: drawingEdge.source, target: targetNodeId };
            onUpdate({ ...workflow, edges: [...workflow.edges, newEdge] });
        }
        setDrawingEdge(null);
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const svg = svgRef.current; if (!svg) return;
        const data = JSON.parse(e.dataTransfer.getData('application/reactflow'));
        
        const point = svg.createSVGPoint(); point.x = e.clientX; point.y = e.clientY;
        const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM()?.inverse());
        
        const newNode: WorkflowNode = {
            id: `${data.type.toLowerCase()}-${Date.now()}`,
            type: data.type,
            position: { x: svgX - NODE_WIDTH / 2, y: svgY - NODE_HEIGHT / 2 },
            data: { label: data.label, ...data.data },
        };
        onUpdate({ ...workflow, nodes: [...workflow.nodes, newNode] });
    };
    
    const deleteEdge = (edgeId: string) => {
        onUpdate({...workflow, edges: workflow.edges.filter(e => e.id !== edgeId) });
    };
    
    const getNodeById = useCallback((id: string) => workflow.nodes.find(n => n.id === id), [workflow.nodes]);

    return (
        <div className="flex h-full bg-brand-primary border border-brand-border rounded-lg overflow-hidden">
            <div className="w-64 bg-brand-secondary p-3 border-r border-brand-border overflow-y-auto">
                <h4 className="font-semibold text-white mb-3">Toolbox</h4>
                <div className="space-y-2">
                    <p className="text-xs text-brand-muted uppercase font-bold">Core</p>
                    <DraggableNode type="Start" label="Start" icon={nodeIcons.Start} />
                    <DraggableNode type="End" label="End" icon={nodeIcons.End} />
                    <DraggableNode type="Condition" label="Condition" icon={nodeIcons.Condition} />
                    <p className="text-xs text-brand-muted uppercase font-bold pt-2">Actions</p>
                    <DraggableNode type="Action" label="Read from Source" icon={nodeIcons.Action} data={{ actionType: 'Read' }} />
                    <DraggableNode type="Action" label="Write to GraphDB" icon={nodeIcons.Action} data={{ actionType: 'WriteGraph' }} />
                    <DraggableNode type="Action" label="Write to VectorDB" icon={nodeIcons.Action} data={{ actionType: 'WriteVector' }} />
                    <p className="text-xs text-brand-muted uppercase font-bold pt-2">AI Agents</p>
                    {agents.map(agent => (
                        <DraggableNode key={agent.id} type="Agent" label={agent.name} icon={nodeIcons.Agent} data={{ agentId: agent.id }} />
                    ))}
                </div>
            </div>
            <div className="flex-grow relative">
                <svg ref={svgRef} width="100%" height="100%" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onDrop={handleDrop} onDragOver={e => e.preventDefault()} className="cursor-grab active:cursor-grabbing">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#30363D" strokeWidth="0.5"/></pattern>
                        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8B949E" /></marker>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" transform={`translate(${viewBox.x}, ${viewBox.y})`}/>

                    {workflow.edges.map(edge => {
                        const sourceNode = getNodeById(edge.source); const targetNode = getNodeById(edge.target);
                        if (!sourceNode || !targetNode) return null;
                        const sx = sourceNode.position.x + NODE_WIDTH; const sy = sourceNode.position.y + NODE_HEIGHT / 2;
                        const tx = targetNode.position.x; const ty = targetNode.position.y + NODE_HEIGHT / 2;
                        return <path key={edge.id} d={`M ${sx} ${sy} C ${sx + 60} ${sy}, ${tx - 60} ${ty}, ${tx} ${ty}`} fill="none" stroke={selectedEdge === edge.id ? '#58A6FF' : "#8B949E"} strokeWidth="2" markerEnd="url(#arrowhead)" onClick={(e) => { e.stopPropagation(); setSelectedEdge(edge.id); }}/>;
                    })}

                    {drawingEdge && <path d={`M ${getNodeById(drawingEdge.source)!.position.x + NODE_WIDTH} ${getNodeById(drawingEdge.source)!.position.y + NODE_HEIGHT/2} L ${drawingEdge.x} ${drawingEdge.y}`} stroke="#58A6FF" strokeDasharray="5,5" strokeWidth="2" />}
                    
                    {workflow.nodes.map(node => (
                        <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y})`} onMouseDown={e => onNodeMouseDown(e, node)} className="cursor-pointer">
                            <rect width={NODE_WIDTH} height={NODE_HEIGHT} rx="8" ry="8" fill="#161B22" stroke="#30363D" strokeWidth="2" />
                            <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT} x="0" y="0">
                               <div className="w-full h-full flex items-center justify-start p-3 gap-3 select-none">
                                 {nodeIcons[node.type] || nodeIcons['Action']}
                                 <div className="flex-1 overflow-hidden">
                                     <p className="text-sm font-semibold text-white truncate">{node.data.label}</p>
                                     <p className="text-xs text-brand-muted">{node.type}</p>
                                 </div>
                               </div>
                            </foreignObject>
                            {node.type !== 'Start' && <circle cx="0" cy={NODE_HEIGHT / 2} r={PORT_SIZE} fill="#58A6FF" onMouseUp={e => handlePortMouseUp(e, node.id)} />}
                            {node.type !== 'End' && <circle cx={NODE_WIDTH} cy={NODE_HEIGHT / 2} r={PORT_SIZE} fill="#58A6FF" onMouseDown={e => handlePortMouseDown(e, node.id)} />}
                        </g>
                    ))}
                </svg>
                 <div className="absolute top-2 right-2 flex items-center gap-2">
                    {selectedEdge && (
                        <Tooltip text="Delete Edge">
                            <button onClick={() => deleteEdge(selectedEdge)} className="p-2 bg-brand-secondary/80 border border-brand-border rounded-md text-brand-danger hover:bg-brand-danger hover:text-white transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </Tooltip>
                    )}
                    <div className="p-2 bg-brand-secondary/80 border border-brand-border rounded-md text-brand-muted text-xs flex items-center gap-1.5">
                       <MousePointer2 size={14} /> <span>Pan: Ctrl+Drag or Middle-Mouse</span>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default WorkflowEditor;