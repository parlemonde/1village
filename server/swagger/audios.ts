export const audiosDocs = {
  '/api/audios/{id}/{filename}': {
    get: {
      summary: 'Récupère un fichier audio',
      tags: ['Audios'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur associé au fichier audio",
        },
        {
          in: 'path',
          name: 'filename',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Nom du fichier audio à récupérer',
        },
      ],
      responses: {
        '200': {
          description: 'Fichier audio récupéré avec succès',
        },
        '404': {
          description: 'Fichier audio non trouvé',
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
    head: {
      summary: "Vérifie l'existence d'un fichier audio",
      tags: ['Audios'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur associé au fichier audio",
        },
        {
          in: 'path',
          name: 'filename',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Nom du fichier audio à vérifier',
        },
      ],
      responses: {
        '200': {
          description: 'Fichier audio existe',
        },
        '404': {
          description: 'Fichier audio non trouvé',
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
    delete: {
      summary: 'Supprime un fichier audio',
      tags: ['Audios'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer',
          },
          required: true,
          description: "ID de l'utilisateur associé au fichier audio",
        },
        {
          in: 'path',
          name: 'filename',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Nom du fichier audio à supprimer',
        },
      ],
      responses: {
        '204': {
          description: 'Fichier audio supprimé avec succès',
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
  '/api/audios': {
    post: {
      summary: 'Télécharge un nouveau fichier audio',
      tags: ['Audios'],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                audio: {
                  type: 'string',
                  format: 'binary',
                },
              },
              required: ['audio'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Fichier audio téléchargé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    description: 'URL du fichier audio téléchargé',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Fichier audio manquant ou invalide',
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
  '/api/audios/mix': {
    post: {
      summary: 'Crée un mix audio à partir de plusieurs pistes',
      tags: ['Audios'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                tracks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'number',
                      },
                      label: { type: 'string' },
                      sampleUrl: { type: 'string' },
                      sampleDuration: { type: 'number' },
                      sampleStartTime: { type: 'number' },
                      sampleVolume: { type: 'number', nullable: true },
                      sampleTrim: {
                        type: 'object',
                        properties: {
                          start: { type: 'number', nullable: true },
                          end: { type: 'number', nullable: true },
                        },
                        nullable: true,
                      },
                      iconUrl: { type: 'string' },
                    },
                    required: ['type', 'label', 'sampleUrl', 'sampleDuration', 'sampleStartTime', 'iconUrl'],
                  },
                },
              },
              required: ['tracks'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Mix audio créé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    description: 'URL du mix audio créé',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Données de mix audio manquantes ou invalides',
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
