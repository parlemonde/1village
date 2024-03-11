import { getCurrencies } from 'src/api/currencie/currencies.get';
import { getLanguages } from 'src/api/language/languages.get';
import { GameType } from 'types/game.type';

export enum InputTypeEnum {
  INPUT = 0,
  RADIO = 1,
  SELECT = 2,
  IMAGE = 3,
  VIDEO = 4,
}

export type hiddenType = {
  id: number;
  value: string;
};

export type inputType = {
  id: number;
  type: InputTypeEnum;
  values?: string[];
  label?: string;
  response?: boolean;
  isDisplayedInRecap?: boolean;
  placeHolder?: string;
  methodType?: methodType;
  selectedValue?: string;
  hidden?: hiddenType;
  required?: boolean;
};

export type StepsType = {
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
              type: InputTypeEnum.VIDEO,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 1,
              type: InputTypeEnum.INPUT,
              label: 'Que signifie cette mimique ?',
              placeHolder: 'Signification réelle',
              isDisplayedInRecap: true,
              response: true,
              required: true,
              selectedValue: '',
            },
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              label: 'Quelle est l’origine de cette mimique ?',
              placeHolder: 'Origine',
              isDisplayedInRecap: true,
              selectedValue: '',
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette mimique',
          description:
            'Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 1',
              required: true,
              isDisplayedInRecap: true,
              response: false,
              selectedValue: '',
            },
            {
              id: 4,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 2',
              required: true,
              isDisplayedInRecap: true,
              response: false,
              selectedValue: '',
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
              id: 5,
              type: InputTypeEnum.VIDEO,
              selectedValue: '',
              required: true,
              isDisplayedInRecap: true,
            },
            {
              id: 6,
              type: InputTypeEnum.INPUT,
              label: 'Que signifie cette mimique ?',
              placeHolder: 'Signification réelle',
              required: true,
              isDisplayedInRecap: true,
              response: true,
              selectedValue: '',
            },
            {
              id: 7,
              type: InputTypeEnum.INPUT,
              label: 'Quelle est l’origine de cette mimique ?',
              placeHolder: 'Origine',
              isDisplayedInRecap: true,
              selectedValue: '',
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette mimique',
          description:
            'Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 8,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 1',
              required: true,
              isDisplayedInRecap: true,
              response: false,
              selectedValue: '',
            },
            {
              id: 9,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 2',
              required: true,
              isDisplayedInRecap: true,
              response: false,
              selectedValue: '',
            },
          ],
        },
      ],
      [
        {
          title: 'Présentez en vidéo une 3ème mimique à vos Pélicopains',
          description:
            'Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise.. Gardez le mystère, et ne révélez pas à l’oral sa signification !',
          inputs: [
            {
              id: 10,
              type: InputTypeEnum.VIDEO,
              selectedValue: '',
              required: true,
              isDisplayedInRecap: true,
            },
            {
              id: 11,
              type: InputTypeEnum.INPUT,
              label: 'Que signifie cette mimique ?',
              placeHolder: 'Signification réelle',
              required: true,
              isDisplayedInRecap: true,
              response: true,
              selectedValue: '',
            },
            {
              id: 12,
              type: InputTypeEnum.INPUT,
              label: 'Quelle est l’origine de cette mimique ?',
              placeHolder: 'Origine',
              isDisplayedInRecap: true,
              selectedValue: '',
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette mimique',
          description:
            'Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 13,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 1',
              required: true,
              isDisplayedInRecap: true,
              response: false,
              selectedValue: '',
            },
            {
              id: 14,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Signification inventée 2',
              required: true,
              isDisplayedInRecap: true,
              response: false,
              selectedValue: '',
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
              methodType: methodType.CURRENCY,
              values: [],
              selectedValue: '',
              required: true,
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
              id: 1,
              type: InputTypeEnum.IMAGE,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 2,
              type: InputTypeEnum.INPUT,
              label: 'Quel est le nom de cet objet ?',
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 3,
              type: InputTypeEnum.INPUT,
              label: 'Quel est son prix moyen en euro ? (Écrire la valeur en nombre)',
              selectedValue: '',
              response: true,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 4,
              type: InputTypeEnum.INPUT,
              label: 'À quoi sert cet objet ? Quand est-il acheté ?',
              selectedValue: '',
              required: true,
            },
          ],
        },
        {
          title: 'Inventez deux prix faux à cet objet',
          description:
            'Vos Pélicopains verront l’image de votre objet, et devront trouver son prix parmi le vrai, et les deux faux, qu’il faut inventer :',
          inputs: [
            {
              id: 5,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé',
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 6,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé',
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
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
              id: 7,
              type: InputTypeEnum.IMAGE,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 8,
              type: InputTypeEnum.INPUT,
              label: 'Quel est le nom de cet objet ?',
              selectedValue: '',
              required: true,
            },
            {
              id: 9,
              type: InputTypeEnum.INPUT,
              label: 'Quel est son prix moyen en euro ? (Écrire la valeur en nombre)',
              selectedValue: '',
              response: true,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 10,
              type: InputTypeEnum.INPUT,
              label: 'À quoi sert cet objet ? Quand est-il acheté ?',
              selectedValue: '',
              required: true,
            },
          ],
        },
        {
          title: 'Inventez deux prix faux à cet objet',
          description:
            'Vos Pélicopains verront l’image de votre objet, et devront trouver son prix parmi le vrai, et les deux faux, qu’il faut inventer :',
          inputs: [
            {
              id: 11,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 1',
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 12,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 2',
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
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
              id: 13,
              type: InputTypeEnum.IMAGE,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 14,
              type: InputTypeEnum.INPUT,
              label: 'Quel est le nom de cet objet ?',
              selectedValue: '',
              required: true,
            },
            {
              id: 15,
              type: InputTypeEnum.INPUT,
              label: 'Quel est son prix moyen en euro ? (Écrire la valeur en nombre)',
              selectedValue: '',
              response: true,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 16,
              type: InputTypeEnum.INPUT,
              label: 'À quoi sert cet objet ? Quand est-il acheté ?',
              selectedValue: '',
              required: true,
            },
          ],
        },
        {
          title: 'Inventez deux prix faux à cet objet',
          description:
            'Vos Pélicopains verront l’image de votre objet, et devront trouver son prix parmi le vrai, et les deux faux, qu’il faut inventer :',
          inputs: [
            {
              id: 17,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 1',
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 18,
              type: InputTypeEnum.INPUT,
              placeHolder: 'Prix inventé 2',
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
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
          description: 'Vous pourrez ensuite commencer votre défi',
          inputs: [
            {
              id: 0,
              type: InputTypeEnum.SELECT,
              placeHolder: 'Langues',
              methodType: methodType.LANGUE,
              values: [],
              selectedValue: '',
              required: true,
            },
          ],
        },
        {
          description: 'Dans votre classe, cette langue est : ',
          inputs: [
            {
              id: 1,
              type: InputTypeEnum.RADIO,
              values: [
                'maternelle chez tous les élèves',
                'maternelle chez certains élèves',
                'utilisée pour faire cours',
                'apprise comme langue étrangère',
              ],
              selectedValue: '',
              required: true,
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
              id: 2,
              type: InputTypeEnum.IMAGE,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 3,
              label: 'Écrivez l’expression dans la langue que vous avez choisie juste avant',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 4,
              hidden: { id: 0, value: 'Français' },
              label: 'Écrivez la traduction “mot à mot” en français',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
            },
            {
              id: 5,
              label: 'Que signifie cette expression ?',
              placeHolder: 'Signification réelle',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: true,
              isDisplayedInRecap: true,
              required: true,
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette expression',
          description:
            'Vos Pélicopains verront le dessin de votre expression, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 6,
              placeHolder: 'Signification inventée 1',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 7,
              placeHolder: 'Signification inventée 2',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
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
              id: 8,
              type: InputTypeEnum.IMAGE,
              selectedValue: '',
              required: true,
            },
            {
              id: 9,
              label: 'Écrivez l’expression dans la langue que vous avez choisie juste avant',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 10,
              label: 'Écrivez la traduction “mot à mot” en français',
              hidden: { id: 0, value: 'Français' },
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
            },
            {
              id: 11,
              label: 'Que signifie cette expression ?',
              placeHolder: 'Signification réelle',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: true,
              isDisplayedInRecap: true,
              required: true,
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette expression',
          description:
            'Vos Pélicopains verront le dessin de votre expression, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 12,
              placeHolder: 'Signification inventée 1',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 13,
              placeHolder: 'Signification inventée 2',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
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
              id: 14,
              type: InputTypeEnum.IMAGE,
              selectedValue: '',
              required: true,
            },
            {
              id: 15,
              label: 'Écrivez l’expression dans la langue que vous avez choisie juste avant',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 16,
              label: 'Écrivez la traduction “mot à mot” en français',
              hidden: { id: 0, value: 'Français' },
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
            },
            {
              id: 17,
              label: 'Que signifie cette expression ?',
              placeHolder: 'Signification réelle',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              isDisplayedInRecap: true,
              response: true,
              required: true,
            },
          ],
        },
        {
          title: 'Inventez deux significations fausses à cette expression',
          description:
            'Vos Pélicopains verront le dessin de votre expression, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut inventer :',
          inputs: [
            {
              id: 18,
              placeHolder: 'Signification inventée 1',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
            },
            {
              id: 19,
              placeHolder: 'Signification inventée 2',
              type: InputTypeEnum.INPUT,
              selectedValue: '',
              response: false,
              isDisplayedInRecap: true,
              required: true,
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
