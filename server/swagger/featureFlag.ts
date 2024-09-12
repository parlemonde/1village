export const featureFlagDocs = {
  '/api/featureFlags': {
    get: {
      summary: 'Récupère tous les Feature Flags',
      tags: ['Feature Flags'],
      responses: {
        '200': {
          description: 'Liste des Feature Flags récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', description: 'ID du Feature Flag' },
                    name: { type: 'string', description: 'Nom du Feature Flag' },
                    isEnabled: { type: 'boolean', description: "Statut d'activation du Feature Flag" },
                    users: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', description: "ID de l'utilisateur" },
                          username: { type: 'string', description: "Nom d'utilisateur" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ AdminAuth: [] }],
    },
    post: {
      summary: 'Crée ou met à jour un Feature Flag existant',
      tags: ['Feature Flags'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Nom du Feature Flag' },
                isEnabled: { type: 'boolean', description: "Statut d'activation du Feature Flag" },
                users: {
                  type: 'array',
                  items: { type: 'integer' },
                  description: 'Liste des IDs des utilisateurs associés',
                },
              },
              required: ['name'],
            },
          },
        },
      },
      responses: {
        '200': { description: 'Feature Flag créé ou mis à jour avec succès' },
        '400': { description: 'Données invalides fournies' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ AdminAuth: [] }],
    },
  },
  '/api/featureFlags/{featureFlagName}': {
    get: {
      summary: 'Récupère un Feature Flag par nom',
      tags: ['Feature Flags'],
      parameters: [
        {
          in: 'path',
          name: 'featureFlagName',
          schema: { type: 'string' },
          required: true,
          description: 'Nom du Feature Flag',
        },
      ],
      responses: {
        '200': {
          description: 'Feature Flag récupéré avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', description: 'ID du Feature Flag' },
                  name: { type: 'string', description: 'Nom du Feature Flag' },
                  isEnabled: { type: 'boolean', description: "Statut d'activation du Feature Flag" },
                },
              },
            },
          },
        },
        '404': { description: 'Feature Flag non trouvé' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ AdminAuth: [] }],
    },
  },
  '/api/featureFlags/{featureFlagName}/users': {
    get: {
      summary: 'Récupère tous les utilisateurs associés à un Feature Flag',
      tags: ['Feature Flags'],
      parameters: [
        {
          in: 'path',
          name: 'featureFlagName',
          schema: { type: 'string' },
          required: true,
          description: 'Nom du Feature Flag',
        },
      ],
      responses: {
        '200': {
          description: 'Liste des utilisateurs associés récupérée avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', description: "ID de l'utilisateur" },
                    username: { type: 'string', description: "Nom d'utilisateur" },
                  },
                },
              },
            },
          },
        },
        '404': { description: 'Feature Flag non trouvé' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ AdminAuth: [] }],
    },
  },
  '/api/featureFlags/{id}': {
    put: {
      summary: 'Met à jour un Feature Flag par ID',
      tags: ['Feature Flags'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
          description: 'ID du Feature Flag',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Nom du Feature Flag' },
                isEnabled: { type: 'boolean', description: "Statut d'activation du Feature Flag" },
                userIds: {
                  type: 'array',
                  items: { type: 'integer' },
                  description: 'Liste des IDs des utilisateurs associés',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Feature Flag mis à jour avec succès' },
        '400': { description: 'Données invalides fournies' },
        '403': { description: 'Accès interdit' },
        '404': { description: 'Feature Flag non trouvé' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ AdminAuth: [] }],
    },
    delete: {
      summary: 'Supprime un Feature Flag par ID',
      tags: ['Feature Flags'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
          description: 'ID du Feature Flag',
        },
      ],
      responses: {
        '204': { description: 'Feature Flag supprimé avec succès' },
        '403': { description: 'Accès interdit' },
        '404': { description: 'Feature Flag non trouvé' },
        '500': { description: 'Erreur du serveur' },
      },
      security: [{ AdminAuth: [] }],
    },
  },
};
