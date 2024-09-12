export const currenciesDocs = {
  '/api/currencies': {
    get: {
      summary: 'Récupère la liste de toutes les devises',
      tags: ['Currencies'],
      responses: {
        '200': {
          description: 'Liste des devises récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', description: 'Code de la devise (ISO 4217)' },
                    number: { type: 'string', description: 'Numéro de la devise (ISO 4217)' },
                    name: { type: 'string', description: 'Nom de la devise en français' },
                    countries: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Liste des pays utilisant la devise',
                    },
                  },
                },
              },
            },
          },
        },
        '403': {
          description: 'Accès interdit',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
      security: [
        {
          TeacherAuth: [],
        },
      ],
    },
  },
};
