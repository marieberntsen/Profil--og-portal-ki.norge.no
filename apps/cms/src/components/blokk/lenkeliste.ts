export default {
  collectionName: 'components_blokk_lenkelistes',
  info: {
    displayName: 'Lenkeliste',
    description: 'Liste med lenker',
  },
  options: {},
  attributes: {
    tittel: {
      type: 'string',
    },
    lenker: {
      type: 'component',
      repeatable: true,
      component: 'blokk.lenke',
    },
  },
};
