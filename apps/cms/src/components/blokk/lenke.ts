export default {
  collectionName: 'components_blokk_lenkes',
  info: {
    displayName: 'Lenke',
    description: 'Enkeltlenke',
  },
  options: {},
  attributes: {
    tekst: {
      type: 'string',
      required: true,
    },
    url: {
      type: 'string',
      required: true,
    },
    ekstern: {
      type: 'boolean',
      default: false,
    },
  },
};
