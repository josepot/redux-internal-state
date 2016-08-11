import R from './ramda-custom';
import { componentAction } from './actions/creators';

export const getScopedDispatch = (dispatch, componentId, instanceId) => action =>
  R.compose(dispatch, componentAction)(componentId, [instanceId], action);

export const bindScopedActionCreators =
  (dispatch, componentId, instanceId, scopedActionCreators) => R.map(
    scopedActionCreator => (...args) => dispatch(
      componentAction(componentId, [instanceId], scopedActionCreator(...args))
    )
  )(scopedActionCreators);
