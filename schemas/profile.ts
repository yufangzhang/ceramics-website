import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Your logo for the navigation (optional). If not provided, text name will be shown.',
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon (Browser Tab Icon)',
      type: 'image',
      description: 'Custom favicon for browser tabs. Recommended: 64x64 PNG with rounded corners and background. If not provided, logo will be used.',
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: 'homeIntroHeading',
      title: 'Home Intro - Heading',
      type: 'string',
      description: 'Lead-in heading for home page (e.g., "Functional forms inspired by Eastern minimalism.")',
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'homeIntroBody',
      title: 'Home Intro - Body',
      type: 'text',
      rows: 3,
      description: 'Supporting paragraph for home page intro (e.g., "Hand-painted and wheel-thrown in Chiswick...")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aboutMe',
      title: 'About Me',
      type: 'text',
      rows: 10,
      description: 'Tell your story',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Your Instagram handle (without @)',
      placeholder: 'yufangzhangceramics',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Your contact email',
      placeholder: 'yufang@example.com',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Your location/city',
      placeholder: 'Chiswick, London',
    }),
    defineField({
      name: 'buttondownUsername',
      title: 'Buttondown Username',
      type: 'string',
      description: 'Your Buttondown username for newsletter subscriptions (without @)',
      placeholder: 'yufangceramics',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Profile',
      }
    },
  },
})
