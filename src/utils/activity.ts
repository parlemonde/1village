import { EPhase1Steps, EPhase2Steps, EPhase3Steps } from 'types/activity.type';

export function turnPhaseStepEnumIntoLitteral(step: EPhase1Steps | EPhase2Steps | EPhase3Steps): string {
  if (Object.values(EPhase1Steps).includes(step as EPhase1Steps)) {
    switch (step) {
      case EPhase1Steps.ENIGME_PAYS_1:
        return 'Enigme pays 1';
      case EPhase1Steps.MESSAGE_LANCEMENT_PHASE_1:
        return 'Message de lancement phase 1';
      case EPhase1Steps.RELANCE_PHASE_1:
        return 'Relance phase 1';
      case EPhase1Steps.ENIGME_PAYS_2:
        return 'Enigme pays 2';
      default:
        return '';
    }
  }
  if (Object.values(EPhase2Steps).includes(step as EPhase2Steps)) {
    switch (step) {
      case EPhase2Steps.ACTIVITE_8_MARS:
        return 'Activité 8 mars';
      case EPhase2Steps.ACTIVITE_EMI:
        return 'Activité EMI';
      case EPhase2Steps.MESSAGE_CLOTURE_PHASE_2:
        return 'Message de clôture phase 2';
      case EPhase2Steps.MESSAGE_LANCEMENT_PHASE_2:
        return 'Message de lancement phase 2';
      case EPhase2Steps.RELANCE_PHASE_2:
        return 'Relance phase 2';
      default:
        return '';
    }
  }
  if (Object.values(EPhase3Steps).includes(step as EPhase3Steps)) {
    switch (step) {
      case EPhase3Steps.MESSAGE_CLOTURE_PHASE_3:
        return 'Message de clôture phase 3';
      case EPhase3Steps.MESSAGE_LANCEMENT_PHASE_3:
        return 'Message de lancement phase 3';
      case EPhase3Steps.MIXAGE_DE_L_HYMNE:
        return "Mixage de l'hymne";
      case EPhase3Steps.PARAMETRAGE_DE_L_HYMNE:
        return "Paramétrage de l'hymne";
      case EPhase3Steps.RELANCE_PHASE_3:
        return 'Relance phase 3';
      default:
        return '';
    }
  }
  return '';
}

export function mapPhaseStepEnum(phase: number): string[] {
  if (phase === 1) {
    return Object.values(EPhase1Steps);
  } else if (phase === 2) {
    return Object.values(EPhase2Steps);
  } else {
    return Object.values(EPhase3Steps);
  }
}
