import {
  REGISTER_INSTANCE, PARENT_INSTANCE, UNREGISTER_INSTANCE, COMPONENT_ACTION,
} from './types';

export const componentAction = (componentId, instanceIds, instanceAction) => ({
  type: COMPONENT_ACTION,
  payload: { componentId, instanceIds, instanceAction },
});
export const registerInstanceAction =
  (componentId, instanceId, inititalValue, parent) => ({
    type: REGISTER_INSTANCE,
    payload: { componentId, instanceId, inititalValue, parent },
  });
export const parentInstanceAction = (componentId, instanceId, parent) => ({
  type: PARENT_INSTANCE,
  payload: { componentId, instanceId, parent },
});
export const unregisterInstanceAction = (componentId, instanceId) => ({
  type: UNREGISTER_INSTANCE,
  payload: { componentId, instanceId },
});
