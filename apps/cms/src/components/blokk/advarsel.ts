export default {
  collectionName: 'components_blokk_advarsels',
  info: {
    displayName: 'Advarsel',
    description: 'Varselboks for viktig informasjon',
  },
  options: {},
  attributes: {
    tittel: {
      type: 'string',
    },
    innhold: {
      type: 'blocks',
    },
    type: {
      type: 'enumeration',
      enum: ['info', 'advarsel', 'viktig', 'suksess'],
      default: 'info',
    },
  },
};
