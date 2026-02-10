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
      name: 'homeIntro',
      title: 'Home Page Introduction',
      type: 'text',
      rows: 3,
      description: 'Brief introduction text shown on the home page',
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
