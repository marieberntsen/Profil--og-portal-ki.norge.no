export default {
  kind: 'collectionType',
  collectionName: 'faqs',
  info: {
    singularName: 'faq',
    pluralName: 'faqs',
    displayName: 'FAQ',
    description: 'Ofte stilte sporsmal',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    sporsmal: {
      type: 'string',
      required: true,
    },
    svar: {
      type: 'blocks',
    },
    kategori: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::merkelapp.merkelapp',
      inversedBy: 'faqs',
    },
    rekkefølge: {
      type: 'integer',
      default: 0,
    },
  },
};
