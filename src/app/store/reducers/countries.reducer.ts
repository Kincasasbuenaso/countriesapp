import { createReducer, on } from '@ngrx/store';
import {loadCountries, loadCountriesSuccess, loadCountriesError} from '../actions';
import { Country } from '../../models/country.model';

export interface CountriesState {
    countries: Country[],
    loaded: boolean,
    loading: boolean,
    error: any
};

const CountriesinitialState: CountriesState = {
    countries: [],
    loaded: false,
    loading: false,
    error: null  
};

export const _countriesReducer = createReducer(CountriesinitialState,
    
    on(loadCountries, state => ({...state, loading: true })),

    on(loadCountriesSuccess, ( state, {countries}) => ({
        ...state, 
        loading: false,
        loaded:true,
        countries: [...countries],
    })),


    on(loadCountriesError, (state, {payload}) => ({
        ...state, 
        loading: false,
        loaded: false,
        error: payload
    })),
);

export function countriesReducer( state, action){
    return _countriesReducer(state,action);
}