export const countriesDocs = {
  '/api/countries': {
    get: {
      summary: 'Récupère la liste de tous les pays',
      tags: ['Countries'],
      responses: {
        '200': {
          description: 'Liste des pays récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    alpha2: { type: 'string', description: 'Code alpha-2 du pays' },
                    alpha3: { type: 'string', description: 'Code alpha-3 du pays' },
                    name: { type: 'string', description: 'Nom du pays en français' },
                    numeric: { type: 'string', description: 'Code numérique du pays' },
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
