import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';


export interface AppState {
   countries: reducers.CountriesState;
   search: reducers.SearchState;
}



export const appReducers: ActionReducerMap<AppState> = {
   countries: reducers.countriesReducer,
   search: reducers.searchReducer
}