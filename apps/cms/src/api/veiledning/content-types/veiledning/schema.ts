export default {
  kind: 'collectionType',
  collectionName: 'veilednings',
  info: {
    singularName: 'veiledning',
    pluralName: 'veilednings',
    displayName: 'Veiledning',
    description: 'Veiledninger og retningslinjer',
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
    kategori: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::merkelapp.merkelapp',
      inversedBy: 'veiledninger',
    },
    lenker: {
      type: 'json',
    },
    rekkefølge: {
      type: 'integer',
      default: 0,
    },
  },
};
