export default {
  collectionName: 'components_blokk_faq_innholds',
  info: {
    displayName: 'FAQ Innhold',
    description: 'Inline FAQ element',
  },
  options: {},
  attributes: {
    sporsmal: {
      type: 'string',
      required: true,
    },
    svar: {
      type: 'blocks',
    },
  },
};
