export interface CreatePostArgs {
  title: string;
  description: string;
  customerId: string;
  location: string;
  customer: string;
  latitude: number;
  longitude: number;
}

export type CreatePostFormFields = keyof CreatePostArgs;
