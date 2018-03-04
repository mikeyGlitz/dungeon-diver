import { TOGGLE_SIDEBAR } from '../actions/sidebar';

const INITIAL_STATE = {
  collapsed: true,
  tab: 'dice',
};

export default (state = INITIAL_STATE, { type, ...action }) => {
  switch (type) {
    case TOGGLE_SIDEBAR:
      if (action.collapsed !== null) {
        return { ...state, collapsed: action.collapsed, tab: action.tab || 'dice' };
      }
      return { ...state, collapsed: !state.collapsed, tab: action.tab || 'dice' };
    default:
      return state;
  }
};
