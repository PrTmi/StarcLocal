export enum AssetStatus {
  // asset_created = 'asset_created',
  // pending_validation = 'pending_validation',
  ready_for_augmentation = 'ready_for_augmentation',
  augment_started = 'augment_started',
  // augment_complete = 'augment_complete',
  // initial_training_started = 'initial_training_started',
  initial_model_ready = 'initial_model_ready',
  model_ready = 'model_ready',
  archived = 'archived',
  training_started = 'training_started'
}

export interface Client {
  id: string | null;
  name: string;
  archived?: boolean | null;
  contactEmail: string | null;
}

export interface ClientToSave {
  id: string | null;
  name: string;
  contactEmail: string;
}

export interface ClientDetails {
  description?: string;
}

export interface Asset {
  id: string | null;
  name: string;
  imageUrl?: string;
  fileFullName?: string | null;
  fileThumbAsBase64?: string | null;
  fileAsBase64?: string | null;
  archived?: boolean | null;
  status: AssetStatus;
  clientId: string | null;
}

export interface AssetDetails extends Asset {
  description?: string;
}

export interface AssetToSave {
  id: string | null;
  name: string;
  image: File | null;
  clientId: string | null;
}

export interface User {}

export interface ResetPasswordResponse {
  successful: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ResetPasswordRequest {
  username: string;
}

export interface LoginResponse {
  successful: boolean;
  token: string;
}

export interface UserInformation {
  accountName: string;
}

export interface OrderStats {
  type: OrderStatus;
  count: number;
}

export enum OrderStatus {
  archived = 'archived',
  requires_approval = 'requires_approval',
  //requires_augmentation = 'requires_augmentation',
  //requires_training = 'equires_training',
  in_production = 'in_production',
  delivered = 'delivered',
  approved = 'approved'
  //ready_for_augmentation = 'ready_for_augmentation',
  //augment_started = 'augment_started'
  //requires_augmentation = 'requires_augmentation'
}

export interface EventOrder {
  id: string;
  campaignId: string | null;
  assetId: string;
  eventId: string;
  adPlacementId: string;
  status: OrderStatus;
  event?: Event;
  asset?: Asset;
  dateCreated: string;
  clientId: string;
}

export interface Event {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  ad_Positions: string;
  broadcast: string;
  eventTypeId: string;
  status: string;
}

export interface BoundingBox {
  imageURL: string;
  probability: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ReportLoadResult {
  report: OrderReport;
  boxes: BoundingBox[][];
}

export interface OrderReport {
  id: string;
  name?: string | null;
  eventId: string;
  assetId: string;
  frameCount: number;
  videoDuration: number;
  frameHitCount: number;
  minimumProbabilityPercentage: number;
  adSeconds: boolean[];
  videoResultUrl: string;
  totalAdCost: number;
}
