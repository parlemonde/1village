export const analyticsDocs = {
  '/api/analytics': {
    get: {
      summary: 'Récupère les données analytiques agrégées',
      tags: ['Analytics'],
      parameters: [
        { in: 'query', name: 'aggregate', schema: { type: 'string', enum: ['hour', 'day', 'month'] }, description: "Type d'agrégation" },
        { in: 'query', name: 'from', schema: { type: 'number' }, description: 'Timestamp de début pour le filtrage' },
        { in: 'query', name: 'to', schema: { type: 'number' }, description: 'Timestamp de fin pour le filtrage' },
      ],
      responses: {
        '200': {
          description: 'Données analytiques récupérées avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessions: { type: 'object' },
                  pages: { type: 'object' },
                  users: { type: 'object' },
                  perf: { type: 'object' },
                  labels: { type: 'array', items: { type: 'number' } },
                  aggregation: { type: 'string', enum: ['hour', 'day', 'month'] },
                },
              },
            },
          },
        },
        '400': { description: 'Requête invalide' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
    },
    post: {
      summary: 'Ajoute des données analytiques',
      tags: ['Analytics'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                sessionId: { type: 'string', description: 'ID de la session' },
                userId: { type: 'number', description: "ID de l'utilisateur", nullable: true },
                phase: { type: 'number', description: "Phase de l'analyse" },
                event: { type: 'string', description: "Type d'événement" },
                location: { type: 'string', description: "Emplacement de l'événement" },
                referrer: { type: 'string', nullable: true, description: "Référent de l'événement" },
                width: { type: 'number', nullable: true, description: "Largeur de l'écran" },
                params: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    duration: { type: 'number', nullable: true, description: 'Durée de la session' },
                    isInitial: { type: 'boolean', nullable: true, description: 'Est-ce la session initiale ?' },
                    perf: { type: 'object', nullable: true, description: 'Données de performance' },
                  },
                  additionalProperties: false,
                },
              },
              required: ['sessionId', 'event', 'location'],
            },
          },
        },
      },
      responses: {
        '204': { description: 'Données ajoutées avec succès' },
        '400': { description: 'Données invalides fournies' },
        '403': { description: 'Accès interdit' },
        '500': { description: 'Erreur du serveur' },
      },
    },
  },
};
