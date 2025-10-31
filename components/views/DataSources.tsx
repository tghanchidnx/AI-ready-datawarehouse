import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import { MOCK_DEMO_DATA_SOURCES, MOCK_DB_CONNECTIONS } from '../../constants';
import type { DataSource, DatabaseConnection, View } from '../../types';
import { DataSourceType, DatabaseConnectionType } from '../../types';
import { Database, PlusCircle, BrainCircuit } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const StatusIndicator: React.FC<{ status: DataSource['status'] }> = ({ status }) => {
    const statusClasses = {
        connected: 'bg-green-500',
        disconnected: 'bg-gray-500',
        error: 'bg-red-500',
    };
    return (
        <Tooltip text={status.charAt(0).toUpperCase() + status.slice(1)}>
            <div className={`w-3 h-3 rounded-full ${statusClasses[status]}`}></div>
        </Tooltip>
    );
};

const connectionTypeToDataSourceType: Partial<Record<DatabaseConnectionType, DataSourceType>> = {
    [DatabaseConnectionType.Snowflake]: DataSourceType.Snowflake,
    [DatabaseConnectionType.Databricks]: DataSourceType.Databricks,
    [DatabaseConnectionType.AzureSynapse]: DataSourceType.Synapse,
};

const userConfiguredSources = MOCK_DB_CONNECTIONS
    .filter(conn => connectionTypeToDataSourceType[conn.type])
    .map((conn: DatabaseConnection): DataSource => ({
        id: conn.id,
        name: conn.name,
        type: connectionTypeToDataSourceType[conn.type]!,
        status: conn.status === 'Connected' ? 'connected' : 'disconnected',
        lastIngested: conn.status === 'Connected' ? '2025-10-31 10:00 UTC' : 'N/A',
        schemaDescription: `User-configured connection from Settings. Schema: ${conn.schema || 'default'}. AI analysis is available.`
    }));

interface DataSourcesProps {
    setCurrentView: (view: View) => void;
}

const DataSources: React.FC<DataSourcesProps> = ({ setCurrentView }) => {
    const allDataSources = useMemo(() => [...userConfiguredSources, ...MOCK_DEMO_DATA_SOURCES], []);
    const [selectedSource, setSelectedSource] = useState<DataSource | null>(allDataSources[0] || null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-1 flex flex-col">
          <Card className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Data Sources</h2>
                  <Tooltip text="Add Connection in Settings">
                      <button 
                        onClick={() => setCurrentView('settings')}
                        className="p-2 text-brand-muted hover:text-brand-accent transition-colors">
                          <PlusCircle size={22} />
                      </button>
                  </Tooltip>
              </div>
              <ul className="space-y-2">
                  {allDataSources.map(source => (
                      <li key={source.id}>
                          <button 
                              onClick={() => setSelectedSource(source)}
                              className={`w-full text-left p-3 rounded-md transition-colors flex items-center space-x-4 ${selectedSource?.id === source.id ? 'bg-brand-accent/20' : 'hover:bg-brand-border'}`}
                          >
                              <StatusIndicator status={source.status} />
                              <div>
                                  <p className={`font-semibold ${selectedSource?.id === source.id ? 'text-brand-accent' : 'text-gray-200'}`}>{source.name}</p>
                                  <p className="text-sm text-brand-muted">{source.type}</p>
                              </div>
                          </button>
                      </li>
                  ))}
              </ul>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedSource ? (
              <Card className="h-full">
                  <div className="flex justify-between items-center mb-4">
                      <div>
                          <h3 className="text-2xl font-bold text-white">{selectedSource.name}</h3>
                          <p className="text-brand-muted">Last Ingested: {selectedSource.lastIngested}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                          <StatusIndicator status={selectedSource.status} />
                          <span>{selectedSource.status.charAt(0).toUpperCase() + selectedSource.status.slice(1)}</span>
                      </div>
                  </div>

                  <div className="mt-6">
                      <h4 className="flex items-center space-x-2 text-lg font-semibold text-brand-accent mb-2">
                          <BrainCircuit size={20}/>
                          <span>AI-Driven Data Catalog</span>
                      </h4>
                      <div className="p-4 bg-brand-primary border border-brand-border rounded-md prose prose-invert prose-sm max-w-none text-gray-300">
                          <p>{selectedSource.schemaDescription}</p>
                      </div>
                  </div>

                  <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">Configuration</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-brand-primary p-3 rounded-md border border-brand-border">
                              <p className="text-brand-muted">Source Type</p>
                              <p className="font-semibold">{selectedSource.type}</p>
                          </div>
                          <div className="bg-brand-primary p-3 rounded-md border border-brand-border">
                              <p className="text-brand-muted">Unique ID</p>
                              <p className="font-mono">{selectedSource.id}</p>
                          </div>
                      </div>
                  </div>

              </Card>
          ) : (
              <Card className="h-full flex items-center justify-center">
                  <p className="text-brand-muted">Select a data source to view details.</p>
              </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default DataSources;