import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import * as Sentry from '@sentry/astro';

// Create Sanity client with monitoring
const baseClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  useCdn: true,
});

// Wrap fetch with Sentry breadcrumbs for monitoring
export const sanityClient = {
  ...baseClient,
  fetch: async <T>(query: string, params?: any): Promise<T> => {
    Sentry.addBreadcrumb({
      category: 'sanity',
      message: `Fetching: ${query.substring(0, 100)}...`,
      level: 'info',
      data: { params },
    });

    try {
      const result = await baseClient.fetch<T>(query, params);
      Sentry.addBreadcrumb({
        category: 'sanity',
        message: 'Fetch successful',
        level: 'info',
      });
      return result;
    } catch (error) {
      Sentry.addBreadcrumb({
        category: 'sanity',
        message: 'Fetch failed',
        level: 'error',
        data: { error: String(error) },
      });
      throw error;
    }
  },
};

// Use baseClient for image URL builder (not the wrapped client)
const builder = imageUrlBuilder(baseClient);

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
  materials?: string;
  dishwasherSafe?: boolean;
  sold?: boolean;
  order?: number;
}

export interface HomeShowcase {
  _id: string;
  title: string;
  year: number;
  dimensions?: string;
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
  order: number;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description?: string;
  link?: string;
  isPast?: boolean;
}

export interface Profile {
  _id: string;
  logo?: {
    asset: {
      _ref: string;
    };
  };
  favicon?: {
    asset: {
      _ref: string;
    };
  };
  homeIntro: string;
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
  email: string;
  location?: string;
  buttondownUsername?: string;
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
