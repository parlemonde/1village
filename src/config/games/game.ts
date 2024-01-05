import { getCurrencies } from 'src/api/currencie/currencies.get';
import { getLanguages } from 'src/api/language/languages.get';
import { GameType } from 'types/game.type';

export enum InputTypeEnum {
  INPUT = 0,
  RADIO = 1,
  SELECT = 2,
}

export type inputType = {
  id: number;
  type: InputTypeEnum;
  values?: string[];
  label?: string;
  placeHolder?: string;
  methodType?: methodType;
  selectedValue?: string;
  hidden?: {
    id: number;
    value: string;
  };
};

type StepsType = {
  title?: string;
  description?: string;
  inputs?: inputType[];
};

type GameFieldConfigType = {
  [type in GameType]: {
    steps: Array<StepsType[]>;
  };
};

enum methodType {
  LANGUE = 'language',
  CURRENCY = 'currency',
}

export const keyMapping = {
  [methodType.CURRENCY]: 'name',
  [methodType.LANGUE]: 'french',
};

export const SelectTypeMappingMethode = {
  [methodType.CURRENCY]: getCurrencies,
  [methodType.LANGUE]: getLanguages,
};

export const GAME_FIELDS_CONFIG: GameFieldConfigType = {
  [GameType.MIMIC]: {
    steps: [
      [
        {
          title: 'Présentez en vidéo une 1ère mimique à vos Pélicopains',
          description:
            'Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise.. Gardez le mystère, et ne révélez pas à l’oral sa signification !',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.INPUT,
              label: 'Que signifie cette mimique ?',
              placeHolder: 'Signification réelle',
            },
            {
              id: 1,
              type: InputTypeEnum.INPUT,
              label: 'Quelle est l’origine de cette mimique ?',
              placeHolder: 'Origine',
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette mimique',
          description:
            'Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 1',
            },
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 2',
            },
          ],
        },
      ],
      [
        {
          title: 'Présentez en vidéo une 2ème mimique à vos Pélicopains',
          description:
            'Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise.. Gardez le mystère, et ne révélez pas à l’oral sa signification !',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.INPUT,
              label: 'Que signifie cette mimique ?',
              placeHolder: 'Signification réelle',
            },
            {
              id: 1,
              type: InputTypeEnum.INPUT,
              label: 'Quelle est l’origine de cette mimique ?',
              placeHolder: 'Origine',
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette mimique',
          description:
            'Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 1',
            },
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 2',
            },
          ],
        },
      ],
    ],
  },

  [GameType.MONEY]: {
    steps: [
      [
        {
          title: 'Choisissez votre monnaie',
          description: 'Choisissez avec quelle monnaie vous allez donner le prix de vos objets : ',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.SELECT,
              placeHolder: 'Monnaie',
              values: [],
            },
          ],
        },
      ],
      [
        {
          title: 'Choisissez un objet',
          description: 'Choissisez un objet dont le prix moyen est faible',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.INPUT,
              label: 'Quel est le nom de cet objet ?',
            },
            {
              id: 1,
              type: InputTypeEnum.INPUT,
              label: 'Quel est son prix moyen en euro ? (Écrire la valeur en nombre)',
            },
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              label: 'À quoi sert cet objet ? Quand est-il acheté ?',
            },
          ],
        },
        {
          title: 'Inventez deux prix faux à cet objet',
          description:
            'Vos Pélicopains verront l’image de votre objet, et devront trouver son prix parmi le vrai, et les deux faux, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 1',
            },
            {
              id: 4,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 2',
            },
          ],
        },
      ],
      [
        {
          title: 'Choisissez un objet',
          description: 'Choissisez un objet dont le prix moyen modéré',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.INPUT,
              label: 'Quel est le nom de cet objet ?',
            },
            {
              id: 1,
              type: InputTypeEnum.INPUT,
              label: 'Quel est son prix moyen en euro ? (Écrire la valeur en nombre)',
            },
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              label: 'À quoi sert cet objet ? Quand est-il acheté ?',
            },
          ],
        },
        {
          title: 'Inventez deux prix faux à cet objet',
          description:
            'Vos Pélicopains verront l’image de votre objet, et devront trouver son prix parmi le vrai, et les deux faux, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 1',
            },
            {
              id: 4,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 2',
            },
          ],
        },
      ],
      [
        {
          title: 'Choisissez un objet',
          description: 'Choissisez un objet dont le prix moyen élevé',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.INPUT,
              label: 'Quel est le nom de cet objet ?',
            },
            {
              id: 1,
              type: InputTypeEnum.INPUT,
              label: 'Quel est son prix moyen en euro ? (Écrire la valeur en nombre)',
            },
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              label: 'À quoi sert cet objet ? Quand est-il acheté ?',
            },
          ],
        },
        {
          title: 'Inventez deux prix faux à cet objet',
          description:
            'Vos Pélicopains verront l’image de votre objet, et devront trouver son prix parmi le vrai, et les deux faux, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 1',
            },
            {
              id: 4,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 2',
            },
          ],
        },
      ],
      [
        {
          title: 'Pré-visualisez vos objets et publiez les !',
          description: 'Vous pouvez modifier chaque objet si vous le souhaitez. Quand vous êtes prêts : publiez-les dans votre village-monde ! ',
        },
      ],
    ],
  },

  [GameType.EXPRESSION]: {
    steps: [
      [
        {
          title: 'Choisissez dans quelle langue vous souhaitez lancer le défi',
          description: 'Vous pourrez ensuite commencer votre défi.',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.SELECT,
              placeHolder: 'Langues',
              methodType: methodType.LANGUE,
              values: [],
            },
          ],
        },
        {
          description: 'Dans votre classe, la langue parlée est : ',
          inputs: [
            {
              id: 1,
              type: InputTypeEnum.RADIO,
              values: [
                'maternelle chez tous les élèves',
                'maternelle chez certains élèves',
                'qu’on utilise pour faire cours',
                'qu’on apprend comme langue étrangère',
              ],
            },
          ],
        },
      ],

      [
        {
          title: 'Dessinez votre expression',
          description: 'Réalisez votre dessin sur une feuille au format paysage',
          inputs: [
            {
              id: 0,
              label: 'Écrivez l’expression dans la langue que vous avez choisie',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 1,
              hidden: { id: 0, value: 'Français' },
              label: 'Écrivez la traduction “mot à mot” en français',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 2,
              label: 'Que signifie cette expression ?',
              placeHolder: 'Signification réelle',
              type: InputTypeEnum.INPUT,
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette expression',
          description:
            'Vos Pélicopains verront le dessin de votre expression, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              placeHolder: 'Signification inventée 1',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 4,
              placeHolder: 'Signification inventée 2',
              type: InputTypeEnum.INPUT,
            },
          ],
        },
      ],

      [
        {
          title: 'Dessinez votre expression',
          description: 'Réalisez votre dessin sur une feuille au format paysage',
          inputs: [
            {
              id: 0,
              label: 'Écrivez l’expression en',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 1,
              label: 'Écrivez la traduction “mot à mot” en français',
              hidden: { id: 0, value: 'Français' },
              type: InputTypeEnum.INPUT,
            },
            {
              id: 2,
              label: 'Que signifie cette expression ?',
              placeHolder: 'Signification réelle',
              type: InputTypeEnum.INPUT,
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette expression',
          description:
            'Vos Pélicopains verront le dessin de votre expression, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              placeHolder: 'Signification inventée 1',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 4,
              placeHolder: 'Signification inventée 2',
              type: InputTypeEnum.INPUT,
            },
          ],
        },
      ],

      [
        {
          title: 'Dessinez votre expression',
          description: 'Réalisez votre dessin sur une feuille au format paysage',
          inputs: [
            {
              id: 0,
              label: 'Écrivez l’expression en',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 1,
              label: 'Écrivez la traduction “mot à mot” en français',
              hidden: { id: 0, value: 'Français' },
              type: InputTypeEnum.INPUT,
            },
            {
              id: 2,
              label: 'Que signifie cette expression ?',
              placeHolder: 'Signification réelle',
              type: InputTypeEnum.INPUT,
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette expression',
          description:
            'Vos Pélicopains verront le dessin de votre expression, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              placeHolder: 'Signification inventée 1',
              type: InputTypeEnum.INPUT,
            },
            {
              id: 4,
              placeHolder: 'Signification inventée 2',
              type: InputTypeEnum.INPUT,
            },
          ],
        },
      ],

      [
        {
          title: 'Pré-visualisez votre activité et publiez-la.',
          description:
            'Voici la pré-visualisation de votre activité. Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !',
        },
      ],
    ],
  },
};
