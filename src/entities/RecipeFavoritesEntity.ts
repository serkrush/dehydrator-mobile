import {schema} from 'normalizr';
import {call} from 'redux-saga/effects';
import {ENTITY} from 'src/constants';
import action from 'src/decorators/action';
import alias from 'src/decorators/alias';
import reducer from 'src/decorators/reducer';
import {BaseEntity} from './BaseEntity';

@alias('RecipeFavoritesEntity')
@reducer(ENTITY.RECIPE_FAVORITES)
export default class RecipeFavoritesEntity extends BaseEntity<RecipeFavoritesEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.RECIPE_FAVORITES, {
            recipe_id: new schema.Entity(ENTITY.RECIPES),
        });
    }

    @action()
    public *saveRecipeFavorites(data) {
        yield call(this.xSave, '/recipe-favorites/save/user', data);
    }

    @action()
    public *deleteRecipeFavorites(data) {
        yield call(this.xDelete, '/recipe-favorites/delete/user', data);
    }
}
