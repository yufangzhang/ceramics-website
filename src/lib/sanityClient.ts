import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Type definitions
export interface Work {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  year: number;
  dimensions?: string;
  category: 'vase' | 'tableware' | 'cups' | 'teaware' | 'other';
  images: Array<{
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
    caption?: string;
  }>;
  description?: string;
  featured: boolean;
  order?: number;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  link?: string;
}

export interface Profile {
  _id: string;
  aboutMe: string;
  profileImage: {
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  instagramHandle?: string;
}

export interface Stockist {
  _id: string;
  name: string;
  location: string;
  address?: string;
  website?: string;
  description?: string;
  order: number;
}
