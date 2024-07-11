export type FilterState = {
  time: string[];
  statuses: string[];
  doctors: string[];
  order: string[];
};

export type FilterAction =
  | { type: 'SET_TIME'; payload: string[] }
  | { type: 'SET_STATUSES'; payload: string[] }
  | { type: 'SET_DOCTORS'; payload: string[] }
  | { type: 'SET_ORDER'; payload: string[] };

export const initialFilterState: FilterState = {
  time: ['All time'],
  statuses: ['All statuses'],
  doctors: ['All doctors'],
  order: ['Latest to oldest'],
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_TIME':
      return { ...state, time: action.payload };
    case 'SET_STATUSES':
      return { ...state, statuses: action.payload };
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'SET_ORDER':
      return { ...state, order: action.payload };
    default:
      return state;
  }
}
