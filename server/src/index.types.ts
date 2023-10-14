export type AddressItem = {
  guid: string;
  isActive: boolean;
  address: string;
  latitude: number;
  longitude: number;
  tags: string[];
};

export type IncomingMessage = {
  cityFrom: AddressItem;
  distance: number;
  requestId: string;
};

export type OutgoingMessage = {
  requestId: string;
  nearbyCities: AddressItem[];
};
