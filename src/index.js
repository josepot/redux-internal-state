import R from './ramda-custom';
import * as actionTypes from './actions/types';
import * as actionCreators from './actions/creators';
import * as helpers from './helpers';

const clients = {};
let rootKey;

const DEFAULT_ROOT_KEY = 'componentsInternalState';

export const registerComponent = (componentId, reducer) => {
  clients[componentId] = {
    reducer,
    instances: new Set(),
  };
};

export const registerInstance = (componentId, instanceId) => {
  const client = clients[componentId];
  if (!client) {
    throw new Error(`Component: "${componentId}" is not registered`);
  }
  if (client.instances.has(instanceId)) {
    throw new Error(`Duplicate instance ${instanceId}`);
  }

  return client.instances.add(instanceId);
};

export const unregisterInstance = (componentId, instanceId) => {
  const client = clients[componentId];
  if (!client) {
    throw new Error(`Component: "${componentId}" is not registered`);
  }
  if (!client.instances.has(instanceId)) {
    throw new Error(`Unexisting instance: ${instanceId}`);
  }

  return client.instances.delete(instanceId);
};

export function getComponentState(componentId, instanceId, storeState) {
  return {
    instance: R.path([rootKey, 'states', componentId, instanceId], storeState),
    children: R.compose(
      R.mapObjIndexed((instances, compId) => R.map(
        instId => getComponentState(compId, instId, storeState),
        instances
      )),
      R.path([rootKey, 'tree', componentId, instanceId, 'children'])
    )(storeState),
  };
}

const stateReducer = (
  state = {},
  { type, payload: { componentId, instanceId, instanceIds, instanceAction } = {} }
) => {
  const reducer = R.path([componentId, 'reducer'], clients);
  if (R.type(reducer) !== 'Function') return state;

  const instancePath = [componentId, instanceId];
  switch (type) {
    case actionTypes.REGISTER_INSTANCE:
      return R.assocPath(
        instancePath, reducer(R.path(instancePath, state), {}), state
      );
    case actionTypes.COMPONENT_ACTION:
      return R.assoc(componentId, R.merge(
        state[componentId] || {}, R.converge(R.zipObj, [
          R.identity,
          R.map(id => reducer(R.path([componentId, id], state), instanceAction)),
        ])(instanceIds)
      ), state);
    case actionTypes.UNREGISTER_INSTANCE:
      return R.dissocPath(instancePath, state);
    default:
      return state;
  }
};

const treeReducer = (
  state, { type, payload: { componentId, instanceId, parent } = {} }
) => {
  switch (type) {
    case actionTypes.UNREGISTER_INSTANCE:
      return R.dissocPath([componentId, instanceId], state);
    case actionTypes.REGISTER_INSTANCE:
      return R.compose(
        parent ? R.assocPath([
          parent.componentId, parent.instanceId,
          'children', componentId, instanceId,
        ], instanceId) : R.identity,
        R.assocPath([componentId, instanceId], { parent, children: {} })
      )(state);
    case actionTypes.PARENT_INSTANCE:
      return R.assocPath([
        parent.componentId, parent.instanceId,
        'children', componentId, instanceId,
      ], instanceId, state);
    default:
      return state;
  }
};

export default (key = DEFAULT_ROOT_KEY) => {
  rootKey = key;
  return (state = { states: {}, tree: {} }, action = {}) => {
    if (!(action.type || '').startsWith('REDUX-COMPONENTS')) return state;

    return ({
      states: stateReducer(state.states, action),
      tree: treeReducer(state.tree, action),
    });
  };
};

export { actionTypes, actionCreators, helpers };
