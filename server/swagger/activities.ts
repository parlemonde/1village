export const activitiesDocs = {
    '/api/activities': {
      get: {
        summary: 'Récupère toutes les activités',
        tags: ['Activities'],
        parameters: [
          { in: 'query', name: 'limit', schema: { type: 'integer' }, description: 'Limite du nombre de résultats' },
          { in: 'query', name: 'page', schema: { type: 'integer' }, description: 'Page des résultats' },
          { in: 'query', name: 'villageId', schema: { type: 'integer' }, description: 'ID du village pour filtrer' },
          { in: 'query', name: 'countries', schema: { type: 'string' }, description: 'Pays pour filtrer' },
          // Ajoutez tous les autres paramètres ici
        ],
        responses: {
          '200': {
            description: 'Liste des activités récupérées',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', description: "ID de l'activité" },
                      type: { type: 'integer', description: "Type de l'activité" },
                      // Ajoutez d'autres propriétés ici
                    },
                  },
                },
              },
            },
          },
          '403': { description: 'Accès interdit' },
          '500': { description: 'Erreur du serveur' },
        },
      },
      post: {
        summary: 'Crée une nouvelle activité',
        tags: ['Activities'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'integer', description: "Type de l'activité" },
                  subType: { type: 'integer', nullable: true, description: "Sous-type de l'activité" },
                  status: { type: 'integer', nullable: true, description: "Statut de l'activité" },
                  // Ajoutez d'autres champs ici
                },
                required: ['type', 'data', 'content'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Activité créée avec succès' },
          '400': { description: 'Données invalides fournies' },
          '403': { description: 'Accès interdit' },
          '500': { description: 'Erreur du serveur' },
        },
      },
    },
    '/api/activities/{id}': {
      get: {
        summary: 'Récupère une activité par ID',
        tags: ['Activities'],
        parameters: [
          { in: 'path', name: 'id', schema: { type: 'integer' }, required: true, description: "ID de l'activité" },
        ],
        responses: {
          '200': {
            description: 'Activité récupérée avec succès',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
          '404': { description: 'Activité non trouvée' },
          '500': { description: 'Erreur du serveur' },
        },
      },
      put: {
        summary: 'Met à jour une activité',
        tags: ['Activities'],
        parameters: [
          { in: 'path', name: 'id', schema: { type: 'integer' }, required: true, description: "ID de l'activité" },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'integer', nullable: true, description: 'Statut de l\'activité' },
                  // Ajoutez d'autres propriétés ici
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Activité mise à jour avec succès' },
          '400': { description: 'Données invalides fournies' },
          '404': { description: 'Activité non trouvée' },
          '500': { description: 'Erreur du serveur' },
        },
      },
      delete: {
        summary: 'Supprime une activité',
        tags: ['Activities'],
        parameters: [
          { in: 'path', name: 'id', schema: { type: 'integer' }, required: true, description: "ID de l'activité" },
        ],
        responses: {
          '204': { description: 'Activité supprimée avec succès' },
          '403': { description: 'Accès interdit' },
          '404': { description: 'Activité non trouvée' },
          '500': { description: 'Erreur du serveur' },
        },
      },
    },
}