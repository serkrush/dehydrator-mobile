import {asClass} from 'awilix';
import UserEntity from './UserEntity';
import Identity from './Identity';
import Firebase from './Firebase';
//import Flagger from './Flagger';
import MachineEntity from './MachineEntity';
import MachineGroupEntity from './MachineGroupEntity';
import MachineAccessEntity from './MachineAccessEntity';
import MachinesUpdateEntity from './MachinesUpdateEntity';
import PMStateEntity from './PMStateEntity';
import ZMStateEntity from './ZMStateEntity';
import MachineModelEntity from './MachineModelEntity';
import CycleEntity from './CycleEntity';
import MachineNetwork from './MachineNetwork';
import RecipeEntity from './RecipeEntity';
import CategoryEntity from './CategoryEntity';
import RecipeFavoritesEntity from './RecipeFavoritesEntity';
import NotificationEntity from './NotificationEntity';

export interface IEntityContainer {
    UserEntity: UserEntity;
    Identity: Identity;
    Firebase: Firebase;
    //Flagger: Flagger;
    MachineEntity: MachineEntity;
    MachineModelEntity: MachineModelEntity;
    MachineGroupEntity: MachineGroupEntity;
    MachineAccessEntity: MachineAccessEntity;
    MachinesUpdateEntity: MachinesUpdateEntity;
    PMStateEntity: PMStateEntity;
    ZMStateEntity: ZMStateEntity;
    CycleEntity: CycleEntity;
    MachineNetwork: MachineNetwork;
    RecipeEntity: RecipeEntity;
    CategoryEntity: CategoryEntity;
    RecipeFavoritesEntity: RecipeFavoritesEntity;
    NotificationEntity: NotificationEntity;
}

export default {
    UserEntity: asClass(UserEntity).singleton(),
    Identity: asClass(Identity).singleton(),
    Firebase: asClass(Firebase).singleton(),
    //Flagger: asClass(Flagger).singleton(),
    MachineEntity: asClass(MachineEntity).singleton(),
    MachineModelEntity: asClass(MachineModelEntity).singleton(),
    MachineGroupEntity: asClass(MachineGroupEntity).singleton(),
    MachineAccessEntity: asClass(MachineAccessEntity).singleton(),
    MachinesUpdateEntity: asClass(MachinesUpdateEntity).singleton(),
    PMStateEntity: asClass(PMStateEntity).singleton(),
    ZMStateEntity: asClass(ZMStateEntity).singleton(),
    CycleEntity: asClass(CycleEntity).singleton(),
    MachineNetwork: asClass(MachineNetwork).singleton(),
    RecipeEntity: asClass(RecipeEntity).singleton(),
    CategoryEntity: asClass(CategoryEntity).singleton(),
    RecipeFavoritesEntity: asClass(RecipeFavoritesEntity).singleton(),
    NotificationEntity: asClass(NotificationEntity).singleton(),
};
