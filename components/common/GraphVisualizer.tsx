import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { LineageGraph, LineageNode } from '../../types';

interface GraphVisualizerProps {
  graph: LineageGraph;
  onGraphUpdate: (graph: LineageGraph) => void;
}

const nodeColors: { [key in LineageNode['type']]: { bg: string; border: string; text: string } } = {
  Table: { bg: '#161B22', border: '#58A6FF', text: '#E6EDF3' },
  Column: { bg: '#161B22', border: '#8B949E', text: '#C9D1D9' },
  Transformation: { bg: '#238636', border: '#30363D', text: '#E6EDF3' },
  Report: { bg: '#9E6A03', border: '#30363D', text: '#E6EDF3' },
};

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ graph, onGraphUpdate }) => {
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1200, height: 800 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
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

    setViewBox({
      width: newWidth,
      height: newHeight,
      x: viewBox.x + (svgX - viewBox.x) * (1 - newWidth / viewBox.width),
      y: viewBox.y + (svgY - viewBox.y) * (1 - newHeight / viewBox.height),
    });
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.ctrlKey) { // Middle mouse button or Ctrl+Click
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNode(null);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = (e.clientX - panStart.x) * (viewBox.width / (svgRef.current?.clientWidth ?? 1));
      const dy = (e.clientY - panStart.y) * (viewBox.height / (svgRef.current?.clientHeight ?? 1));
      setViewBox(vb => ({ ...vb, x: vb.x - dx, y: vb.y - dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    } else if (draggingNode) {
        const svg = svgRef.current;
        if (!svg) return;

        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM()?.inverse());

        const newX = svgX - draggingNode.offset.x;
        const newY = svgY - draggingNode.offset.y;

        const updatedNodes = graph.nodes.map(n =>
            n.id === draggingNode.id ? { ...n, position: { x: newX, y: newY } } : n
        );
        onGraphUpdate({ ...graph, nodes: updatedNodes });
    }
  };

  const onNodeMouseDown = (e: React.MouseEvent, node: LineageNode) => {
     if (e.button !== 0) return; // Only left click
     e.stopPropagation();

    const svg = svgRef.current;
    if (!svg) return;
    
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setDraggingNode({
        id: node.id,
        offset: { x: svgX - node.position.x, y: svgY - node.position.y },
    });
  };

  const getNodeById = useCallback((id: string) => graph.nodes.find(n => n.id === id), [graph.nodes]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="cursor-grab active:cursor-grabbing"
    >
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8B949E" />
            </marker>
        </defs>

      {graph.edges.map(edge => {
        const sourceNode = getNodeById(edge.source);
        const targetNode = getNodeById(edge.target);
        if (!sourceNode || !targetNode) return null;

        const sx = sourceNode.position.x + NODE_WIDTH;
        const sy = sourceNode.position.y + NODE_HEIGHT / 2;
        const tx = targetNode.position.x;
        const ty = targetNode.position.y + NODE_HEIGHT / 2;
        
        return (
            <path
                key={edge.id}
                d={`M ${sx} ${sy} C ${sx + 50} ${sy}, ${tx - 50} ${ty}, ${tx} ${ty}`}
                fill="none"
                stroke="#8B949E"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
        );
      })}

      {graph.nodes.map(node => (
        <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y})`}
           onMouseDown={(e) => onNodeMouseDown(e, node)}
           className="cursor-pointer"
        >
          <rect
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx="8"
            ry="8"
            fill={nodeColors[node.type].bg}
            stroke={nodeColors[node.type].border}
            strokeWidth="2"
          />
          <text
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={nodeColors[node.type].text}
            className="select-none font-semibold text-sm"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default GraphVisualizer;
