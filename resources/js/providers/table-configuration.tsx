import React from 'react';

const defaultTableConfiguration: TableConfiguration = {
  toolbar: true,
}

interface TableConfiguration {
  toolbar: boolean;
}

const TableConfigurationContext = React.createContext<TableConfiguration | undefined>(defaultTableConfiguration)

export const TableConfigurationProvider = TableConfigurationContext.Provider;

export function useTableConfiguration() {
  const context = React.useContext(TableConfigurationContext);
  if (context === undefined) {
    return defaultTableConfiguration;
  }
  return context;
}
