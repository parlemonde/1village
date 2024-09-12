export const teamCommentDocs = {
  '/api/team-comments': {
    get: {
      summary: 'Récupère tous les commentaires des équipes',
      tags: ['TeamComments'],
      responses: {
        '200': {
          description: 'Liste de tous les commentaires des équipes',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', description: 'ID du commentaire' },
                    text: { type: 'string', description: 'Texte du commentaire' },
                    // Ajoutez d'autres propriétés selon le modèle TeamComment
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
    },
  },
  '/api/team-comments/{commentId}': {
    put: {
      summary: "Modifie un commentaire d'équipe",
      tags: ['TeamComments'],
      parameters: [
        {
          in: 'path',
          name: 'commentId',
          schema: {
            type: 'integer',
          },
          required: true,
          description: 'ID du commentaire à modifier',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Nouveau texte du commentaire',
                },
              },
              required: ['text'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: "Commentaire d'équipe modifié avec succès",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', description: 'ID du commentaire' },
                  text: { type: 'string', description: 'Texte du commentaire' },
                  // Ajoutez d'autres propriétés selon le modèle TeamComment
                },
              },
            },
          },
        },
        '403': {
          description: 'Accès interdit',
        },
        '404': {
          description: 'Commentaire non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
