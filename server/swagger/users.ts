export const usersDocs = {
  '/api/users': {
    get: {
      summary: 'Récupère tous les utilisateurs',
      tags: ['Users'],
      parameters: [
        {
          in: 'query',
          name: 'villageId',
          schema: {
            type: 'integer',
          },
          description: 'Filtre par ID de village',
        },
      ],
      responses: {
        '200': {
          description: 'Liste des utilisateurs récupérés',
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
        '404': {
          description: 'Aucun utilisateur trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    post: {
      summary: 'Crée un nouvel utilisateur',
      tags: ['Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                pseudo: {
                  type: 'string',
                },
                // Ajoutez tous les autres champs ici
              },
              required: ['email', 'pseudo'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Utilisateur créé avec succès',
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
  '/api/users/{id}': {
    get: {
      summary: 'Récupère un utilisateur par ID',
      tags: ['Users'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur",
        },
      ],
      responses: {
        '200': {
          description: 'Utilisateur récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
        '404': {
          description: 'Utilisateur non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
    put: {
      summary: 'Met à jour un utilisateur',
      tags: ['Users'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur",
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                },
                // Ajoutez tous les autres champs ici
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Utilisateur mis à jour avec succès',
        },
        '400': {
          description: 'Données invalides fournies',
        },
        '404': {
          description: 'Utilisateur non trouvé',
        },
        '500': {
          description: 'Erreur du serveur',
        },
      },
    },
  },
};
