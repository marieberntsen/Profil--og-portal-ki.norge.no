import type { Schema, Struct } from '@strapi/strapi';

export interface BlokkAdvarsel extends Struct.ComponentSchema {
  collectionName: 'components_blokk_advarsels';
  info: {
    description: 'Varselboks for viktig informasjon';
    displayName: 'Advarsel';
  };
  attributes: {
    innhold: Schema.Attribute.Blocks;
    tittel: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['info', 'advarsel', 'viktig', 'suksess']
    > &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface BlokkFaqInnhold extends Struct.ComponentSchema {
  collectionName: 'components_blokk_faq_innholds';
  info: {
    description: 'Inline FAQ element';
    displayName: 'FAQ Innhold';
  };
  attributes: {
    sporsmal: Schema.Attribute.String & Schema.Attribute.Required;
    svar: Schema.Attribute.Blocks;
  };
}

export interface BlokkLenke extends Struct.ComponentSchema {
  collectionName: 'components_blokk_lenkes';
  info: {
    description: 'Enkeltlenke';
    displayName: 'Lenke';
  };
  attributes: {
    ekstern: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    tekst: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlokkLenkeliste extends Struct.ComponentSchema {
  collectionName: 'components_blokk_lenkelistes';
  info: {
    description: 'Liste med lenker';
    displayName: 'Lenkeliste';
  };
  attributes: {
    lenker: Schema.Attribute.Component<'blokk.lenke', true>;
    tittel: Schema.Attribute.String;
  };
}

export interface BlokkTekst extends Struct.ComponentSchema {
  collectionName: 'components_blokk_teksts';
  info: {
    description: 'Generisk riktekst-blokk';
    displayName: 'Tekst';
  };
  attributes: {
    innhold: Schema.Attribute.Blocks;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blokk.advarsel': BlokkAdvarsel;
      'blokk.faq-innhold': BlokkFaqInnhold;
      'blokk.lenke': BlokkLenke;
      'blokk.lenkeliste': BlokkLenkeliste;
      'blokk.tekst': BlokkTekst;
    }
  }
}
