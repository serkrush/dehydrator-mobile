export interface IMachineGroup {
  id: string;
  creatorId: string;
  name: string;
  location: string;
  machineIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface IMachineGroupPostData {
  creatorId: string;
  name: string;
  location: string;
  machineIds?: string[];
}
