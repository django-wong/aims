import { createContext, useContext } from 'react';
import { Project } from '@/types';

export const ProjectContext = createContext<Project|null>(null);

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export const ProjectProvider = ProjectContext.Provider;
