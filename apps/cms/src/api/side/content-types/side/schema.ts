export default {
  kind: 'collectionType',
  collectionName: 'sides',
  info: {
    singularName: 'side',
    pluralName: 'sides',
    displayName: 'Side',
    description: 'Statiske sider',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    tittel: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'uid',
      targetField: 'tittel',
      required: true,
    },
    innhold: {
      type: 'blocks',
    },
    template: {
      type: 'enumeration',
      enum: ['standard', 'bred', 'landingsside'],
      default: 'standard',
    },
    seoTittel: {
      type: 'string',
    },
    seoBeskrivelse: {
      type: 'text',
    },
  },
};
