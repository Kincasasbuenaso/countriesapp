import { createReducer, on } from '@ngrx/store';
import { search, searchOption } from '../actions/search.actions';


export interface SearchState {
    termino:string,
    option :string,
};


export const SearchinitialState: SearchState = {
    termino : '',
    option  :'all'
};

const _searchReducer = createReducer(SearchinitialState,
    on( search, ( state, { term } ) => ({...state, termino:term }) ),
    on( searchOption, ( state, { option } ) => ({...state, option }) ),
);

export function searchReducer(state, action) {
    return _searchReducer(state, action);
}