import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as countriesActions from '../actions/countries.actions';
import { tap, mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CountryService } from '../../services/country/country.service';
import { Country } from '../../models/country.model';



@Injectable()
export class CountriesEffects {

    constructor(
        private actions$: Actions,
        private countriesService: CountryService
    ){}


    cargarCountries$ = createEffect(
        () => this.actions$.pipe(
            ofType( countriesActions.loadCountries ),
            mergeMap(
                () => this.countriesService.getAllCountries()
                    .pipe(
                        map( countries  => countriesActions.loadCountriesSuccess({ countries: countries as Country [] }) ),
                        catchError( err => of(countriesActions.loadCountriesError({ payload: err })) )
                    )
            )
        )
    );

}