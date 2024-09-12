export const gamesDocs = {
  '/api/games': {
    get: {
      summary: 'Récupère tous les jeux',
      tags: ['Games'],
      parameters: [
        {
          in: 'query',
          name: 'villageId',
          schema: {
            type: 'integer',
          },
          description: 'ID du village pour filtrer les jeux',
        },
        {
          in: 'query',
          name: 'type',
          schema: {
            type: 'integer',
          },
          description: 'Type de jeu',
        },
        {
          in: 'query',
          name: 'userId',
          schema: {
            type: 'string',
          },
          description: "ID de l'utilisateur ou 'self' pour filtrer par utilisateur",
        },
      ],
      responses: {
        '200': {
          description: 'Liste des jeux récupérés avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                },
              },
            },
          },
        },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ TeacherAuth: [] }],
    },
  },
  '/api/games/{id}': {
    get: {
      summary: 'Récupère un jeu par ID',
      tags: ['Games'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
          description: 'ID du jeu',
        },
      ],
      responses: {
        '200': {
          description: 'Jeu récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
        '404': { description: 'Jeu non trouvé' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ TeacherAuth: [] }],
    },
  },
  '/api/games/play': {
    get: {
      summary: 'Récupère un jeu aléatoire à jouer',
      tags: ['Games'],
      parameters: [
        {
          in: 'query',
          name: 'type',
          schema: { type: 'integer' },
          required: true,
          description: 'Type de jeu',
        },
      ],
      responses: {
        '200': {
          description: 'Jeu aléatoire récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
        '404': { description: 'Jeu non trouvé' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ TeacherAuth: [] }],
    },
  },
  '/api/games/stats/{gameId}': {
    get: {
      summary: 'Récupère les réponses des utilisateurs pour un jeu donné',
      tags: ['Games'],
      parameters: [
        {
          in: 'path',
          name: 'gameId',
          schema: { type: 'integer' },
          required: true,
          description: 'ID du jeu',
        },
      ],
      responses: {
        '200': {
          description: 'Réponses des utilisateurs récupérées avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', description: 'ID de la réponse' },
                    userId: { type: 'integer', description: "ID de l'utilisateur ayant répondu" },
                    value: { type: 'string', description: 'Valeur de la réponse' },
                  },
                },
              },
            },
          },
        },
        '404': { description: 'Réponses non trouvées' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ TeacherAuth: [] }],
    },
  },
};
