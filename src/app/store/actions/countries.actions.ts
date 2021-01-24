import { createAction, props } from '@ngrx/store';
import { Country } from '../../models/country.model';

export const loadCountries = createAction('[Countries] Load Countries');

export const loadCountriesSuccess = createAction('[Countries] Load Countries Success', props<{ countries: Country[] }>() );

export const loadCountriesError = createAction('[Countries] Load Countries Error', props<{ payload: any }>() );