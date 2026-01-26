export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Configure public permissions for API access
    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) {
      strapi.log.warn("Public role not found, skipping permission setup");
      return;
    }

    // Content types that should have public read access
    const contentTypes = [
      "api::artikkel.artikkel",
      "api::side.side",
      "api::eksempel.eksempel",
      "api::veiledning.veiledning",
      "api::faq.faq",
      "api::merkelapp.merkelapp",
    ];

    // Actions to enable for public access
    const actions = ["find", "findOne"];

    for (const contentType of contentTypes) {
      for (const action of actions) {
        const existingPermission = await strapi.db
          .query("plugin::users-permissions.permission")
          .findOne({
            where: {
              role: publicRole.id,
              action: `${contentType}.${action}`,
            },
          });

        if (!existingPermission) {
          await strapi.db.query("plugin::users-permissions.permission").create({
            data: {
              role: publicRole.id,
              action: `${contentType}.${action}`,
            },
          });
          strapi.log.info(`Granted public ${action} permission for ${contentType}`);
        }
      }
    }

    strapi.log.info("Public API permissions configured");

    // Seed test content (only if no content exists)
    await seedTestContent(strapi);
  },
};

async function seedTestContent(strapi) {
  // Check if we already have PUBLISHED content
  const existingArtikler = await strapi.documents("api::artikkel.artikkel").findMany({
    status: "published",
  });
  if (existingArtikler.length > 0) {
    strapi.log.info("Published content already exists, skipping seed");
    return;
  }

  strapi.log.info("Seeding test content...");

  // Create merkelapper (tags) first - these don't have draft/publish
  const tagKI = await strapi.documents("api::merkelapp.merkelapp").create({
    data: {
      navn: "Kunstig intelligens",
      slug: "kunstig-intelligens",
      beskrivelse: "Innhold relatert til kunstig intelligens",
    },
  });

  const tagOffentlig = await strapi.documents("api::merkelapp.merkelapp").create({
    data: {
      navn: "Offentlig sektor",
      slug: "offentlig-sektor",
      beskrivelse: "Innhold for offentlig sektor",
    },
  });

  const tagVeiledning = await strapi.documents("api::merkelapp.merkelapp").create({
    data: {
      navn: "Veiledning",
      slug: "veiledning",
      beskrivelse: "Veiledninger og retningslinjer",
    },
  });

  // Create articles
  await strapi.documents("api::artikkel.artikkel").create({
    data: {
      tittel: "KI-strategien for offentlig sektor lansert",
      slug: "ki-strategien-lansert",
      innhold: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Regjeringen har lansert en ny nasjonal strategi for kunstig intelligens i offentlig sektor. Strategien skal sikre ansvarlig og effektiv bruk av KI-teknologi i offentlige tjenester." }],
        },
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Hovedmål" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Strategien har tre hovedmål: styrke digital kompetanse, fremme innovasjon, og sikre etisk bruk av KI." }],
        },
        {
          type: "list",
          format: "unordered",
          children: [
            { type: "list-item", children: [{ type: "text", text: "Øke kompetansen på KI i offentlig sektor" }] },
            { type: "list-item", children: [{ type: "text", text: "Etablere felles rammeverk for ansvarlig KI" }] },
            { type: "list-item", children: [{ type: "text", text: "Støtte innovasjon og eksperimentering" }] },
          ],
        },
      ],
      },
    status: "published",
  });

  await strapi.documents("api::artikkel.artikkel").create({
    data: {
      tittel: "Nye retningslinjer for KI i saksbehandling",
      slug: "retningslinjer-ki-saksbehandling",
      innhold: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Digitaliseringsdirektoratet har utarbeidet nye retningslinjer for bruk av kunstig intelligens i saksbehandling. Retningslinjene gir veiledning om hvordan KI kan brukes på en måte som ivaretar borgernes rettssikkerhet." }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Retningslinjene dekker blant annet krav til transparens, kvalitetssikring av data, og menneskelig tilsyn ved automatiserte beslutninger." }],
        },
      ],
      },
    status: "published",
  });

  await strapi.documents("api::artikkel.artikkel").create({
    data: {
      tittel: "Slik kommer du i gang med KI i din virksomhet",
      slug: "kom-i-gang-med-ki",
      innhold: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Mange offentlige virksomheter ønsker å ta i bruk kunstig intelligens, men vet ikke hvor de skal begynne. Her er noen råd for å komme i gang." }],
        },
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Start med et konkret problem" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Identifiser et konkret problem eller en oppgave som kan løses eller forbedres med KI. Unngå å lete etter problemer som passer til en løsning." }],
        },
      ],
      },
    status: "published",
  });

  // Create FAQs
  await strapi.documents("api::faq.faq").create({
    data: {
      sporsmal: "Hva er kunstig intelligens (KI)?",
      svar: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Kunstig intelligens (KI) er datamaskinsystemer som kan utføre oppgaver som normalt krever menneskelig intelligens. Dette inkluderer oppgaver som å gjenkjenne mønstre, forstå språk, ta beslutninger og lære av erfaring." }],
        },
      ],
      rekkefølge: 1,
      kategori: { connect: [{ documentId: tagKI.documentId }] },
    },
    status: "published",
  });

  await strapi.documents("api::faq.faq").create({
    data: {
      sporsmal: "Hvordan sikrer vi ansvarlig bruk av KI?",
      svar: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Ansvarlig bruk av KI innebærer å følge etiske prinsipper som transparens, rettferdighet, og personvern. Det er viktig å ha menneskelig tilsyn, dokumentere beslutninger, og regelmessig evaluere systemenes ytelse og konsekvenser." }],
        },
      ],
      rekkefølge: 2,
      kategori: { connect: [{ documentId: tagKI.documentId }] },
    },
    status: "published",
  });

  await strapi.documents("api::faq.faq").create({
    data: {
      sporsmal: "Hvilke lovkrav gjelder for bruk av KI i offentlig sektor?",
      svar: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Offentlige virksomheter må overholde personvernforordningen (GDPR), forvaltningsloven, og arkivloven ved bruk av KI. EU's AI Act vil også stille krav til KI-systemer basert på risikonivå." }],
        },
      ],
      rekkefølge: 3,
      kategori: { connect: [{ documentId: tagOffentlig.documentId }] },
    },
    status: "published",
  });

  // Create examples
  await strapi.documents("api::eksempel.eksempel").create({
    data: {
      tittel: "NAV - Chatbot for brukerveiledning",
      slug: "nav-chatbot",
      organisasjon: "NAV",
      beskrivelse: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "NAV har utviklet en chatbot som hjelper brukere med å finne informasjon og navigere på nav.no. Chatboten bruker naturlig språkprosessering for å forstå brukerens spørsmål og gi relevante svar." }],
        },
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Resultater" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Chatboten har redusert antall henvendelser til kundesenteret med 15% og forbedret brukertilfredshet betydelig." }],
        },
      ],
      status: "i_drift",
      resultater: "Redusert henvendelser med 15%, forbedret brukertilfredshet",
      merkelapper: { connect: [{ documentId: tagKI.documentId }, { documentId: tagOffentlig.documentId }] },
      },
    status: "published",
  });

  await strapi.documents("api::eksempel.eksempel").create({
    data: {
      tittel: "Skatteetaten - Automatisk dokumentklassifisering",
      slug: "skatteetaten-dokumentklassifisering",
      organisasjon: "Skatteetaten",
      beskrivelse: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Skatteetaten bruker maskinlæring til å automatisk klassifisere innkommende dokumenter. Systemet analyserer dokumentenes innhold og ruter dem til riktig saksbehandler." }],
        },
      ],
      status: "pilot",
      resultater: "Pilotfase - foreløpige resultater viser 40% reduksjon i manuelt sorteringsarbeid",
      merkelapper: { connect: [{ documentId: tagKI.documentId }] },
      },
    status: "published",
  });

  // Create veiledning
  await strapi.documents("api::veiledning.veiledning").create({
    data: {
      tittel: "Kom i gang med KI",
      slug: "kom-i-gang",
      innhold: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Denne veiledningen hjelper deg med å komme i gang med kunstig intelligens i din virksomhet. Vi dekker alt fra grunnleggende forståelse til praktisk implementering." }],
        },
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Forstå behovene" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Start med å kartlegge hvilke oppgaver i virksomheten som kan ha nytte av KI. Se etter repetitive oppgaver, beslutninger basert på store datamengder, eller prosesser som krever mønstergjenkjenning." }],
        },
      ],
      rekkefølge: 1,
      kategori: { connect: [{ documentId: tagVeiledning.documentId }] },
      },
    status: "published",
  });

  // Create a side (page)
  await strapi.documents("api::side.side").create({
    data: {
      tittel: "Om KI Norge",
      slug: "om-oss",
      template: "standard",
      innhold: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "KI Norge er en nasjonal satsing for å fremme ansvarlig bruk av kunstig intelligens i offentlig sektor." }],
        },
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Vår visjon" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Vi ønsker at Norge skal være ledende i Europa på ansvarlig og innovativ bruk av KI i offentlige tjenester." }],
        },
      ],
      seoTittel: "Om KI Norge - Kunstig intelligens i offentlig sektor",
      seoBeskrivelse: "Les om KI Norge og vår satsing på ansvarlig bruk av kunstig intelligens i offentlig sektor.",
      },
    status: "published",
  });

  strapi.log.info("Test content seeded successfully");
}
