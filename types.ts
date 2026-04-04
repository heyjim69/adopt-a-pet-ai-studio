
export enum PetType {
  DOG = 'Dog',
  CAT = 'Cat',
  RABBIT = 'Rabbit',
  BIRD = 'Bird',
  OTHER = 'Other'
}

export enum PetAge {
  BABY = 'Baby',
  YOUNG = 'Young',
  ADULT = 'Adult',
  SENIOR = 'Senior'
}

export enum PetSize {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
  EXTRA_LARGE = 'Extra Large'
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: PetAge;
  size: PetSize;
  distance: number;
  location: string;
  description: string;
  images: string[];
  gender: 'Male' | 'Female';
  ownerName: string;
  ownerAvatar: string;
  postedAt: string;
  isVaccinated: boolean;
  isNeutered: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  phone: string;
}

export type SortOption = 'distance' | 'newest' | 'alphabetical' | 'age-young' | 'age-old';
