import React, { useState } from 'react';
import Card from '../common/Card';
import GraphVisualizer from '../common/GraphVisualizer';
// Fix: Renamed MOCK_DATA_SOURCES to MOCK_DEMO_DATA_SOURCES to match exported constant.
import { MOCK_LINEAGE_GRAPH, MOCK_DEMO_DATA_SOURCES } from '../../constants';
import type { LineageGraph, LineageNodeType } from '../../types';

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-sm border-2" style={{ borderColor: color }}></div>
    <span className="text-xs text-brand-muted">{label}</span>
  </div>
);

const DataLineage: React.FC = () => {
  const [graphData, setGraphData] = useState<LineageGraph>(MOCK_LINEAGE_GRAPH);

  const handleGraphUpdate = (newGraph: LineageGraph) => {
    setGraphData(newGraph);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Data Lineage Explorer</h1>
          <p className="text-brand-muted">Visualize object dependencies for a data source.</p>
        </div>
        <div>
          <label htmlFor="source-select" className="sr-only">Select Data Source</label>
          <select 
            id="source-select"
            className="bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent"
          >
            {/* Fix: Renamed MOCK_DATA_SOURCES to MOCK_DEMO_DATA_SOURCES to match imported constant. */}
            {MOCK_DEMO_DATA_SOURCES.filter(ds => ds.status === 'connected').map(ds => (
              <option key={ds.id} value={ds.id}>{ds.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-grow relative">
        <Card className="h-full w-full p-0 overflow-hidden">
          <GraphVisualizer graph={graphData} onGraphUpdate={handleGraphUpdate} />
        </Card>
        <div className="absolute bottom-4 right-4 bg-brand-secondary/80 border border-brand-border rounded-lg p-3 backdrop-blur-sm">
            <h4 className="text-sm font-semibold mb-2 text-white">Legend</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <LegendItem color="#58A6FF" label="Table" />
                <LegendItem color="#8B949E" label="Column" />
                <LegendItem color="#238636" label="Transformation" />
                <LegendItem color="#9E6A03" label="Report" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataLineage;