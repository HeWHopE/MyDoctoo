export type FilterState = {
  doctors: string[];
  specializations: string[];
  hospitals: string[];
};

export type FilterAction =
  | { type: 'SET_SPECIALIZATIONS'; payload: string[] }
  | { type: 'SET_DOCTORS'; payload: string[] }
  | { type: 'SET_HOSPITALS'; payload: string[] };

export const initialFilterState: FilterState = {
  specializations: ['All specializations'],
  doctors: ['All doctors'],
  hospitals: ['All hospitals'],
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'SET_SPECIALIZATIONS':
      return { ...state, specializations: action.payload };
    case 'SET_HOSPITALS':
      return { ...state, hospitals: action.payload };
    default:
      return state;
  }
}
