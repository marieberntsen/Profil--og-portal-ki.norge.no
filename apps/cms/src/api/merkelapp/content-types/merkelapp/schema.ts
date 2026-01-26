export default {
  kind: 'collectionType',
  collectionName: 'merkelapps',
  info: {
    singularName: 'merkelapp',
    pluralName: 'merkelapps',
    displayName: 'Merkelapp',
    description: 'Kategorier og tagger',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    navn: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'uid',
      targetField: 'navn',
      required: true,
    },
    beskrivelse: {
      type: 'text',
    },
    eksempler: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::eksempel.eksempel',
      mappedBy: 'merkelapper',
    },
    veiledninger: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::veiledning.veiledning',
      mappedBy: 'kategori',
    },
    faqs: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::faq.faq',
      mappedBy: 'kategori',
    },
  },
};
