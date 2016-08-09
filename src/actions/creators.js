import types from './types';

export const componentAction = (componentId, instanceIds, instanceAction) => ({
  type: types.COMPONENT_ACTION,
  payload: { componentId, instanceIds, instanceAction },
});
export const registerInstanceAction = (componentId, instanceId, parent) => ({
  type: types.REGISTER_INSTANCE,
  payload: { componentId, instanceId, parent },
});
export const parentInstanceAction = (componentId, instanceId, parent) => ({
  type: types.PARENT_INSTANCE,
  payload: { componentId, instanceId, parent },
});
export const unregisterInstanceAction = (componentId, instanceId) => ({
  type: types.UNREGISTER_INSTANCE,
  payload: { componentId, instanceId },
});
