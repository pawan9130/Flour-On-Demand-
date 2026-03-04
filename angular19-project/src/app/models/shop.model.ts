export interface Address {
  line1?: string;
  line2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ShopProfile {
  id: string;
  name: string;
  ownerName?: string;
  contactNumber?: string;
  altNumber?: string;
  email?: string;
  gstNumber?: string;
  fssaiNumber?: string;
  description?: string;
  coverImage?: string | null;
  logo?: string | null;
  gallery?: string[];
  verified?: boolean;
  isOpen?: boolean;
  address?: Address;
  businessHours?: BusinessHoursDay[];
  holidays?: Holiday[];
  deliverySettings?: DeliverySettings;
}

export interface BusinessHoursDay {
  day: string; // Monday..Sunday
  enabled: boolean;
  shifts: Array<{ open: string; close: string; breakFrom?: string; breakTo?: string }>;
}

export interface Holiday {
  date: string; // ISO
  name: string;
  fullDay: boolean;
  recurringYearly?: boolean;
}

export interface DeliverySlab {
  fromKm: number;
  toKm: number;
  charge: number;
}

export interface DeliverySettings {
  shopPickup: boolean;
  homeDelivery: boolean;
  deliveryRadiusKm: number;
  freeAboveAmount: number;
  perKmCharge?: number;
  fixedFee?: number;
  slabs?: DeliverySlab[];
  slotBookingEnabled?: boolean;
  slotDurationMinutes?: number;
  maxOrdersPerSlot?: number;
  slots?: string[]; // e.g. ['08:00-11:00']
  minOrderValue?: number;
  maxOrderValue?: number;
  preparationTimeMinutes?: number;
  autoAccept?: boolean;
  cutOffTimeMinutes?: number;
}
