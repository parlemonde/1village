export const languagesDocs = {
  '/api/languages': {
    get: {
      summary: 'Récupère toutes les langues disponibles',
      tags: ['Languages'],
      responses: {
        '200': {
          description: 'Liste des langues récupérées avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Nom de la langue',
                    },
                    alpha2: {
                      type: 'string',
                      description: 'Code ISO 639-1 de la langue',
                      nullable: true,
                    },
                    alpha3_b: {
                      type: 'string',
                      description: 'Code ISO 639-2/B de la langue',
                      nullable: true,
                    },
                    alpha3_t: {
                      type: 'string',
                      description: 'Code ISO 639-2/T de la langue',
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
