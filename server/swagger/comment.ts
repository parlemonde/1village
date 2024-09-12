export const commentDocs = {
  '/api/comments': {
    get: {
      summary: 'Récupère tous les commentaires pour une activité donnée',
      tags: ['Comments'],
      parameters: [
        {
          in: 'query',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'activité",
        },
      ],
      responses: {
        '200': {
          description: 'Liste des commentaires récupérés',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    activityId: { type: 'integer' },
                    userId: { type: 'integer' },
                    text: { type: 'string' },
                    createDate: { type: 'string', format: 'date-time' },
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
    post: {
      summary: 'Ajoute un commentaire à une activité donnée',
      tags: ['Comments'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string', nullable: false },
              },
              required: ['text'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Commentaire ajouté avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  activityId: { type: 'integer' },
                  userId: { type: 'integer' },
                  text: { type: 'string' },
                  createDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        '400': {
          description: 'Données invalides fournies',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
  '/api/comments/{commentId}': {
    get: {
      summary: 'Récupère un commentaire par ID pour une activité donnée',
      tags: ['Comments'],
      parameters: [
        {
          in: 'path',
          name: 'commentId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du commentaire',
        },
        {
          in: 'query',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'activité",
        },
      ],
      responses: {
        '200': {
          description: 'Commentaire récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  activityId: { type: 'integer' },
                  userId: { type: 'integer' },
                  text: { type: 'string' },
                  createDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        '404': {
          description: 'Commentaire ou activité non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    put: {
      summary: 'Modifie un commentaire par ID pour une activité donnée',
      tags: ['Comments'],
      parameters: [
        {
          in: 'path',
          name: 'commentId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du commentaire',
        },
        {
          in: 'query',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'activité",
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string', nullable: false },
              },
              required: ['text'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Commentaire modifié avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  activityId: { type: 'integer' },
                  userId: { type: 'integer' },
                  text: { type: 'string' },
                  createDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        '404': {
          description: 'Commentaire ou activité non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    delete: {
      summary: 'Supprime un commentaire par ID pour une activité donnée',
      tags: ['Comments'],
      parameters: [
        {
          in: 'path',
          name: 'commentId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du commentaire',
        },
        {
          in: 'query',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'activité",
        },
      ],
      responses: {
        '204': {
          description: 'Commentaire supprimé avec succès',
        },
        '404': {
          description: 'Commentaire ou activité non trouvée',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
