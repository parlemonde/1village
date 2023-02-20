import { specificActivityPhase, getActivityPhase } from '../utils';
import { ActivityType } from 'types/activity.type';

describe('Test function getActivityPhase', () => {
  describe('for active phase 1', () => {
    const activePhase = 1;
    const activitiesArray = Object.entries(specificActivityPhase);
    describe('selectedPhase 1', () => {
      const selectedPhase = 1;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)('should return phase 1 for Mascotte, Presentation, Contenu Libre, Indice, Symbol', (type) => {
        switch (Number(type)) {
          case ActivityType.PRESENTATION:
          case ActivityType.CONTENU_LIBRE:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.MASCOTTE:
            expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(selectedPhase);
            break;
        }
      });
      it.each(activitiesArray)(
        'Mascotte, Presentation, Contenu Libre, Indice, Symbol should have selectedPhase in specificActivityPhase',
        (type, ...phaseArray) => {
          const [phases] = phaseArray;
          switch (Number(type)) {
            case ActivityType.PRESENTATION:
            case ActivityType.CONTENU_LIBRE:
            case ActivityType.INDICE:
            case ActivityType.SYMBOL:
            case ActivityType.MASCOTTE:
              expect(phases).toEqual(expect.arrayContaining([selectedPhase]));
              break;
          }
        },
      );

      it.each(activitiesArray)('should throw error for the other activities', (type) => {
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
      it.each(activitiesArray)('the other activities should not have selectedPhase in array', (type, ...phaseArray) => {
        const [phases] = phaseArray;
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(phases).not.toEqual(expect.arrayContaining([selectedPhase]));
            break;
        }
      });
    });
    describe('selectedPhase 2', () => {
      const selectedPhase = 2;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)('should throw error for the other activities except ANTHEM', (type) => {
        switch (Number(type)) {
          case ActivityType.PRESENTATION:
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.CONTENU_LIBRE:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.MASCOTTE:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
    });
    describe('selectedPhase 3', () => {
      const selectedPhase = 3;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)('should throw error for the other activities except ANTHEM', (type) => {
        switch (Number(type)) {
          case ActivityType.PRESENTATION:
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.CONTENU_LIBRE:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.MASCOTTE:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
    });
  });
  describe('for active phase 2', () => {
    const activePhase = 2;
    const activitiesArray = Object.entries(specificActivityPhase);
    describe('selectedPhase 1', () => {
      const selectedPhase = 1;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)('should return phase 1 for Mascotte, Presentation, Contenu Libre, Indice, Symbol', (type) => {
        switch (Number(type)) {
          case ActivityType.PRESENTATION:
          case ActivityType.CONTENU_LIBRE:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.MASCOTTE:
            expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(selectedPhase);
            break;
        }
      });
      it.each(activitiesArray)(
        'Mascotte, Presentation, Contenu Libre, Indice, Symbol should have selectedPhase in specificActivityPhase',
        (type, ...phaseArray) => {
          const [phases] = phaseArray;
          switch (Number(type)) {
            case ActivityType.PRESENTATION:
            case ActivityType.CONTENU_LIBRE:
            case ActivityType.INDICE:
            case ActivityType.SYMBOL:
            case ActivityType.MASCOTTE:
              expect(phases).toEqual(expect.arrayContaining([selectedPhase]));
              break;
          }
        },
      );

      it.each(activitiesArray)('should throw error for the other activities', (type) => {
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
      it.each(activitiesArray)('the other activities should not have selectedPhase in array', (type, ...phaseArray) => {
        const [phases] = phaseArray;
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(phases).not.toEqual(expect.arrayContaining([selectedPhase]));
            break;
        }
      });
    });
    describe('selectedPhase 2', () => {
      const selectedPhase = 2;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)(
        'should return phase 2 for Mascotte, Presentation, Contenu Libre, Enigme, Defi, Question, Game, Reportage, Reaction ',
        (type) => {
          switch (Number(type)) {
            case ActivityType.PRESENTATION:
            case ActivityType.ENIGME:
            case ActivityType.DEFI:
            case ActivityType.QUESTION:
            case ActivityType.GAME:
            case ActivityType.CONTENU_LIBRE:
            case ActivityType.MASCOTTE:
            case ActivityType.REPORTAGE:
            case ActivityType.REACTION:
              expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(selectedPhase);
              break;
          }
        },
      );
      it.each(activitiesArray)(
        'Mascotte, Presentation, Contenu Libre, Enigme, Defi, Question, Game, Reportage, Reaction should have selectedPhase in specificActivityPhase',
        (type, ...phaseArray) => {
          const [phases] = phaseArray;
          switch (Number(type)) {
            case ActivityType.INDICE:
            case ActivityType.SYMBOL:
            case ActivityType.VERSE_RECORD:
            case ActivityType.STORY:
            case ActivityType.RE_INVENT_STORY:
              expect(phases).not.toEqual(expect.arrayContaining([selectedPhase]));
              break;
          }
        },
      );
      it.each(activitiesArray)('should throw error for the other activities', (type) => {
        switch (Number(type)) {
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
    });
    describe('selectedPhase 3', () => {
      const selectedPhase = 3;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });

      it.each(activitiesArray)('should throw error for the other activities except ANTHEM', (type) => {
        switch (Number(type)) {
          case ActivityType.PRESENTATION:
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.CONTENU_LIBRE:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.MASCOTTE:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
    });
  });
  describe('for active phase 3', () => {
    const activePhase = 3;
    const activitiesArray = Object.entries(specificActivityPhase);
    describe('selectedPhase 1', () => {
      const selectedPhase = 1;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)('should return phase 1 for Mascotte, Presentation, Contenu Libre, Indice, Symbol', (type) => {
        switch (Number(type)) {
          case ActivityType.PRESENTATION:
          case ActivityType.CONTENU_LIBRE:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.MASCOTTE:
            expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(selectedPhase);
            break;
        }
      });
      it.each(activitiesArray)(
        'Mascotte, Presentation, Contenu Libre, Indice, Symbol should have selectedPhase in specificActivityPhase',
        (type, ...phaseArray) => {
          const [phases] = phaseArray;
          switch (Number(type)) {
            case ActivityType.PRESENTATION:
            case ActivityType.CONTENU_LIBRE:
            case ActivityType.INDICE:
            case ActivityType.SYMBOL:
            case ActivityType.MASCOTTE:
              expect(phases).toEqual(expect.arrayContaining([selectedPhase]));
              break;
          }
        },
      );

      it.each(activitiesArray)('should throw error for the other activities', (type) => {
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
      it.each(activitiesArray)('the other activities should not have selectedPhase in array', (type, ...phaseArray) => {
        const [phases] = phaseArray;
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.QUESTION:
          case ActivityType.GAME:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(phases).not.toEqual(expect.arrayContaining([selectedPhase]));
            break;
        }
      });
    });
    describe('selectedPhase 2', () => {
      const selectedPhase = 2;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)(
        'should return phase 2 for Mascotte, Presentation, Contenu Libre, Enigme, Defi, Question, Game, Reportage, Reaction ',
        (type) => {
          switch (Number(type)) {
            case ActivityType.PRESENTATION:
            case ActivityType.ENIGME:
            case ActivityType.DEFI:
            case ActivityType.QUESTION:
            case ActivityType.GAME:
            case ActivityType.CONTENU_LIBRE:
            case ActivityType.MASCOTTE:
            case ActivityType.REPORTAGE:
            case ActivityType.REACTION:
              expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(selectedPhase);
              break;
          }
        },
      );
      it.each(activitiesArray)(
        'Mascotte, Presentation, Contenu Libre, Enigme, Defi, Question, Game, Reportage, Reaction should have selectedPhase in specificActivityPhase',
        (type, ...phaseArray) => {
          const [phases] = phaseArray;
          switch (Number(type)) {
            case ActivityType.INDICE:
            case ActivityType.SYMBOL:
            case ActivityType.VERSE_RECORD:
            case ActivityType.STORY:
            case ActivityType.RE_INVENT_STORY:
              expect(phases).not.toEqual(expect.arrayContaining([selectedPhase]));
              break;
          }
        },
      );
      it.each(activitiesArray)('should throw error for the other activities', (type) => {
        switch (Number(type)) {
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.VERSE_RECORD:
          case ActivityType.STORY:
          case ActivityType.RE_INVENT_STORY:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
    });
    describe('selectedPhase 3', () => {
      const selectedPhase = 3;
      it('should return activePhase for ANTHEM', () => {
        expect(getActivityPhase(ActivityType.ANTHEM, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it.each(activitiesArray)(
        'should return phase 3 for Mascotte, Presentation, Contenu Libre, Question, Story, Reinvent story, Vers record ',
        (type) => {
          switch (Number(type)) {
            case ActivityType.PRESENTATION:
            case ActivityType.QUESTION:
            case ActivityType.CONTENU_LIBRE:
            case ActivityType.MASCOTTE:
            case ActivityType.STORY:
            case ActivityType.RE_INVENT_STORY:
            case ActivityType.VERSE_RECORD:
              expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(selectedPhase);
              break;
          }
        },
      );
      it.each(activitiesArray)(
        'Mascotte, Presentation, Contenu Libre, Question, Story, Reinvent story, Vers record should have selectedPhase in specificActivityPhase',
        (type, ...phaseArray) => {
          const [phases] = phaseArray;
          switch (Number(type)) {
            case ActivityType.ENIGME:
            case ActivityType.DEFI:
            case ActivityType.GAME:
            case ActivityType.INDICE:
            case ActivityType.SYMBOL:
            case ActivityType.REPORTAGE:
            case ActivityType.REACTION:
              expect(phases).not.toEqual(expect.arrayContaining([selectedPhase]));
              break;
          }
        },
      );
      it.each(activitiesArray)('should throw error for the other activities', (type) => {
        switch (Number(type)) {
          case ActivityType.ENIGME:
          case ActivityType.DEFI:
          case ActivityType.GAME:
          case ActivityType.INDICE:
          case ActivityType.SYMBOL:
          case ActivityType.REPORTAGE:
          case ActivityType.REACTION:
            expect(() => {
              getActivityPhase(Number(type), activePhase, selectedPhase);
            }).toThrow();
            break;
        }
      });
    });
  });
});
