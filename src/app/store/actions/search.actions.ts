import { createAction, props  } from '@ngrx/store';

export const search = createAction(
    '[Search] Search by string',
    props<{term: string}>()
);

export const searchOption = createAction(
    '[Search] Search by Option',
    props<{option: string}>()
);