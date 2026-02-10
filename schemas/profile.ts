import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Profile',
      }
    },
  },
})
