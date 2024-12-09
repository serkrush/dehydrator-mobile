import { PermissionLevel } from "src/constants";

export interface IMachineAccess {
  id: string;
  userId: string;
  machineGroupId?: string;
  machineId?: string;
  permissionLevel: PermissionLevel;
}

export interface IMachineAccessPostData {
  userId?: string;
  email?: string;
  machineGroupId?: string;
  machineId?: string;
  permissionLevel: PermissionLevel;
}
