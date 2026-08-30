import { BaseSourceAdapter } from './base-adapter';
import { Scenepacks411Adapter } from './scenepacks411';
import { VeelAdapter } from './veel';
import { EditPacksAdapter } from './editpacks';
import { SuitsAdapter } from './suits';
import { Source, SourceId } from '../types';

export const registeredAdapters: Record<SourceId, BaseSourceAdapter> = {
  '411': new Scenepacks411Adapter(),
  'veel': new VeelAdapter(),
  'editpacks': new EditPacksAdapter(),
  'suits': new SuitsAdapter(),
};

export function getAdapter(sourceId: SourceId): BaseSourceAdapter | undefined {
  return registeredAdapters[sourceId];
}

export function getAllAdapters(): BaseSourceAdapter[] {
  return Object.values(registeredAdapters);
}

export function getAllSources(): Source[] {
  return Object.values(registeredAdapters).map((adapter) => adapter.getSourceInfo());
}

export * from './base-adapter';
export * from './scenepacks411';
export * from './veel';
export * from './editpacks';
export * from './suits';
