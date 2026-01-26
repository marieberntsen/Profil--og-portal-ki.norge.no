export default {
  kind: 'collectionType',
  collectionName: 'eksempels',
  info: {
    singularName: 'eksempel',
    pluralName: 'eksempels',
    displayName: 'Eksempel',
    description: 'Eksempler og brukstilfeller',
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
    organisasjon: {
      type: 'string',
    },
    beskrivelse: {
      type: 'blocks',
    },
    verktoy: {
      type: 'json',
    },
    resultater: {
      type: 'text',
    },
    status: {
      type: 'enumeration',
      enum: ['i_utvikling', 'pilot', 'i_drift', 'avsluttet'],
      default: 'i_utvikling',
    },
    bilde: {
      type: 'media',
      multiple: false,
      required: false,
      allowedTypes: ['images'],
    },
    merkelapper: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::merkelapp.merkelapp',
      inversedBy: 'eksempler',
    },
  },
};
