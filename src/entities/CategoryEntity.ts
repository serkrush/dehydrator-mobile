import {BaseEntity, HTTP_METHOD} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY} from '../constants';
import action from '../../src/decorators/action';
import {call} from 'redux-saga/effects';
import alias from 'src/decorators/alias';
import uuid from 'react-native-uuid';
import {Alert} from 'react-native';

@alias('CategoryEntity')
@reducer(ENTITY.CATEGORIES)
export default class CategoryEntity extends BaseEntity {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.CATEGORIES, {}, {});
    }

    @action()
    public *getCategories() {
        yield call(this.xRead, `/categories`);
    }

    @action()
    public *getCategoriesUser() {
        yield call(this.xRead, `/categories/user`, {}, HTTP_METHOD.POST);
    }

    @action()
    public *saveCategoryUser(data) {
        const {media_resource_buffer, type, formikRecipeValues, ...restValues} =
            data;
        let dataValues = restValues;
        let id = data.id;
        if (!id) {
            id = uuid.v4();
            dataValues = {...dataValues, id: id};
        }
        let name_file;
        if (media_resource_buffer) {
            name_file = `${uuid.v4()}.png`;
            yield this.di.Firebase.sendToStorage({
                base64String: media_resource_buffer,
                path: `categories/${id}/${name_file}`,
            });
        }
        const res = yield call(this.xSave, `/categories/save/user`, {
            ...dataValues,
            media_resource: name_file,
        });
        if (res.success) {
            const {navigator} = this.di;
            if (formikRecipeValues) {
                navigator.navigate('AddRecipeScreen', {
                    recipe: {
                        ...formikRecipeValues,
                        categories: [
                            ...(formikRecipeValues.categories
                                ? formikRecipeValues.categories
                                : []),
                            ...[id],
                        ],
                    },
                });
            } else {
                navigator.navigate('CategoriesScreen');
            }
            const {t} = this.di;
            Alert.alert('', t(res.response.message));
        }
    }

    @action()
    public *deleteCategoriesUser(data) {
        const {media_resource, type, id, ...restValues} = data;
        const res = yield call(this.xDelete, `/categories/delete/user`, {
            id: id,
        });
        if (media_resource) {
            this.di.Firebase.deleteFolder(`categories/${data.id}`);
        }
        if (res.success) {
            const {navigator} = this.di;
            navigator.navigate('CategoriesScreen');
        }
    }
}
