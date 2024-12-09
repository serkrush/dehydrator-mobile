import {BaseEntity} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY} from '../constants';
import action from '../../src/decorators/action';
import {call} from 'redux-saga/effects';
import alias from 'src/decorators/alias';
import uuid from 'react-native-uuid';
import {RecipeStageType} from './EntityTypes';
import {Alert} from 'react-native';
import {schema} from 'normalizr';

@alias('RecipeEntity')
@reducer(ENTITY.RECIPES)
export default class RecipeEntity extends BaseEntity<RecipeEntity> {
    constructor(opts: any) {
        super(opts);
        const recipeFavorites = new schema.Entity(
            ENTITY.RECIPE_FAVORITES,
            {},
            {},
        );
        this.initSchema(
            ENTITY.RECIPES,
            {
                favoriteByUsers: [recipeFavorites],
            },
            {},
        );
    }

    @action()
    public *getPresets(data = {}) {
        yield call(this.pageEntity, '/presets/page', data);
    }

    @action()
    public *getBenchFoods(data) {
        console.log('getBenchFoods data', data);
        yield call(this.pageEntity, '/recipes/page', data);
    }

    @action()
    public *getRecipeById({id}: {id: string}) {
        yield call(this.xRead, `/recipes/${id}`);
    }

    @action()
    public *getRecipeUserById({id}: {id: string}) {
        yield call(this.xRead, `/recipes/${id}/user`);
    }

    @action()
    public *saveRecipe(data) {
        console.log('saveRecipe 1 ');
        const {media_resources_buffer, type, ...restValues} = data;
        let dataValues = restValues;
        let id = data.id;
        if (!id) {
            id = uuid.v4();
            dataValues = {...dataValues, id: id};
        }

        console.log('saveRecipe 2 ');
        let media_resources = data?.media_resources ?? [];
        if (media_resources_buffer?.length > 0) {
            for (
                let index = 0;
                index < media_resources_buffer.length;
                index++
            ) {
                const name_file = `${uuid.v4()}.png`;
                yield this.di.Firebase.sendToStorage({
                    base64String: media_resources_buffer[index],
                    path: `recipes/${id}/${name_file}`,
                });
                media_resources = [...media_resources, ...[name_file]];
            }
        }

        let modifiedRecipeIngredients = [];
        if (dataValues.recipe_ingredients?.length > 0) {
            for (let j = 0; j < dataValues.recipe_ingredients.length; j++) {
                const {media_resource_buffer, ...restValuesIngredients} =
                    dataValues.recipe_ingredients[j];
                if (media_resource_buffer) {
                    let name_file = `${uuid.v4()}.png`;
                    yield this.di.Firebase.sendToStorage({
                        base64String: media_resource_buffer,
                        path: `recipes/${id}/${name_file}`,
                    });
                    modifiedRecipeIngredients = [
                        ...modifiedRecipeIngredients,
                        ...[
                            {
                                ...restValuesIngredients,
                                media_resource: name_file,
                            },
                        ],
                    ];
                } else {
                    modifiedRecipeIngredients = [
                        ...modifiedRecipeIngredients,
                        ...[restValuesIngredients],
                    ];
                }
            }
        }

        const modifiedData = {
            ...dataValues,
            recipe_ingredients: modifiedRecipeIngredients,
            stages: dataValues.stages.map((stage, index) => {
                if (dataValues.type_session === RecipeStageType.Time) {
                    return {
                        ...stage,
                        weight: 0,
                    };
                } else if (
                    dataValues.type_session === RecipeStageType.Weight &&
                    dataValues.stages.length === index + 1
                ) {
                    return {...stage, duration: 0};
                }
                return stage;
            }),
            media_resources: media_resources,
        };
        console.log('modifiedData', modifiedData);
        const res = yield call(this.xSave, '/recipes/save/user', modifiedData);

        if (res.success) {
            const {navigator} = this.di;
            navigator.navigate('MyRecipesScreen');
            const {t} = this.di;
            Alert.alert('', t(res.response.message));
        }
        console.log('saveRecipe 4');
    }

    @action()
    public *getRecipesUser(data) {
        const {redux} = this.di;
        console.log('getRecipesUser !!!!!!!!!!!!!!!!!!!1', data);
        // const {redux} = this.di;
        yield call(this.pageEntity, '/recipes/page/user', data);
    }

    @action()
    public *deleteRecipe({id}: {id: string}) {
        yield call(this.xDelete, '/recipes/delete/user', {
            id,
        });
        this.di.Firebase.deleteFolder(`recipes/${id}`);
        const {navigator} = this.di;
        navigator.navigate('MyRecipesScreen');
    }

    @action()
    public *shareRecipe({
        receiverFirstName,
        receiverLastName,
        receiverEmail,
        accessData,
    }) {
        const {t} = this.di;
        try {
            const resData = yield call(this.xSave, '/recipes/invite', {
                data: {
                    receiverFirstName,
                    receiverLastName,
                    receiverEmail,
                    accessData,
                },
            });
            if (resData.success) {
                Alert.alert(t('send-ivite-success'));
            } else {
                this.handleUnsuccessResponse(resData?.response);
            }
        } catch (error) {
            console.log('error', error);
            Alert.alert(t(error));
        }
    }
}
