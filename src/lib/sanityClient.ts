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

export const WORK_FIELDS = `
  _id,
  title,
  slug,
  year,
  dimensions,
  category,
  "collection": collection->{title, "slug": slug.current},
  featured,
  images,
  description,
  materials,
  dishwasherSafe,
  sold,
  order
`;

// Events created before the sessions field have only date/endDate.
export const EVENT_FIELDS = `
  _id,
  title,
  "sessions": select(
    count(sessions) > 0 => sessions[]{start, end},
    defined(date) => [{"start": date, "end": endDate}],
    []
  ),
  location,
  description,
  link,
  isPast
`;

// Type definitions
export interface SanityImage {
  asset: {
    _ref: string;
  };
  hotspot?: {
    x: number;
    y: number;
  };
  caption?: string;
}

export interface CollectionRef {
  title: string;
  slug: string;
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: SanityImage;
  order?: number;
}

export interface Work {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  year: number;
  dimensions?: string;
  category: 'vase' | 'tableware' | 'cups' | 'teaware' | 'other';
  collection?: CollectionRef;
  featured?: boolean;
  images: SanityImage[];
  description?: string;
  materials?: string;
  dishwasherSafe?: boolean;
  sold?: boolean;
  order?: number;
}

export interface EventSession {
  start: string;
  end?: string;
}

export interface Event {
  _id: string;
  title: string;
  sessions: EventSession[];
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
  homeIntroHeading?: string;
  homeIntroBody?: string;
  heroImage?: SanityImage;
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
