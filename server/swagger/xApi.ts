export const xApiDocs = {
  '/api/xAPI': {
    post: {
      summary: 'Envoyer une déclaration xAPI',
      tags: ['xAPI'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                actor: {
                  type: 'object',
                  properties: {
                    account: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', description: "Nom de l'utilisateur" },
                        homePage: { type: 'string', description: "Page d'accueil associée à l'utilisateur" },
                      },
                      required: ['name', 'homePage'],
                    },
                  },
                  additionalProperties: true,
                  required: ['account'],
                },
              },
              additionalProperties: true,
              required: ['actor'],
            },
          },
        },
      },
      responses: {
        '204': {
          description: 'Déclaration xAPI envoyée avec succès ou aucune action nécessaire',
        },
        '500': {
          description: "Erreur lors de l'envoi de la déclaration xAPI",
        },
      },
    },
  },
};
