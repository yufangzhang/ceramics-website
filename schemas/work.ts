import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(2100),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'e.g., "15cm H x 10cm W" or "6" H x 4" W"',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Vase', value: 'vase'},
          {title: 'Table-ware', value: 'tableware'},
          {title: 'Cups & Mugs', value: 'cups'},
          {title: 'Tea-ware', value: 'teaware'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for this image',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'string',
      description: 'e.g., "Porcelain" or "Stoneware" or "Porcelain with oxide decoration"',
    }),
    defineField({
      name: 'dishwasherSafe',
      title: 'Dishwasher Safe',
      type: 'boolean',
      description: 'Is this piece dishwasher safe?',
      initialValue: false,
    }),
    defineField({
      name: 'sold',
      title: 'Sold',
      type: 'boolean',
      description: 'Mark as sold',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for displaying in Selected Works page (lower numbers appear first). Leave as 999 for newest-first default ordering.',
      initialValue: 999,
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      category: 'category',
      images: 'images',
      sold: 'sold',
      order: 'order',
    },
    prepare(selection) {
      const {title, year, category, images, sold, order} = selection
      const orderPrefix = order !== 999 ? `[${order}] ` : ''
      return {
        title: title,
        subtitle: `${orderPrefix}${year} • ${category}${sold ? ' • SOLD' : ''}`,
        media: images?.[0],
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Year, Newest',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
    {
      title: 'Year, Oldest',
      name: 'yearAsc',
      by: [{field: 'year', direction: 'asc'}],
    },
  ],
})
