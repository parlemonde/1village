import React, { useEffect, useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';

import { useClassrooms } from '../../../../services/useClassrooms';
import { useCountries } from '../../../../services/useCountries';
import { useVillages } from '../../../../services/useVillages';
import { getUserDisplayName } from '../../../../utils';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';

type StatisticFiltersProps = {
  onPhaseChange: (phaseId: number) => void;
  onCountryChange?: (countryCode: string) => void;
  onVillageChange?: (villageId: number) => void;
  onClassroomChange?: (classroomId: number) => void;
  selectedPhase?: number;
  selectedCountry?: string;
  selectedVillage?: number;
};

export default function StatisticFilters({
  onPhaseChange,
  onCountryChange,
  onVillageChange,
  onClassroomChange,
  selectedCountry: initialCountry,
  selectedVillage: initialVillage,
  selectedPhase,
}: StatisticFiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initialCountry);
  const [selectedVillage, setSelectedVillage] = useState<number | undefined>(initialVillage);
  const [selectedClassroom, setSelectedClassroom] = useState<number>();

  useEffect(() => {
    if (initialCountry !== undefined) {
      setSelectedCountry(initialCountry);
    }
    if (initialVillage !== undefined) {
      setSelectedVillage(initialVillage);
    }
  }, [initialCountry, initialVillage]);

  // PHASE
  const phaseDropdownOptions = [
    { key: '', value: 'Toutes les phases' },
    { key: '1', value: 'Phase 1' },
    { key: '2', value: 'Phase 2' },
    { key: '3', value: 'Phase 3' },
  ];
  const handlePhaseChange = (phaseId: string) => {
    onPhaseChange(+phaseId || 0);
  };

  // COUNTRY
  const { countries } = useCountries({ hasVillage: true });
  const countryDropdownOptions = useMemo(() => countries.map(({ isoCode, name }) => ({ key: isoCode, value: name })), [countries]);

  const handleCountryChange = (countryCode: string) => {
    if (onCountryChange) {
      setSelectedCountry(countryCode);
      onCountryChange(countryCode);

      if (onVillageChange) {
        setSelectedVillage(undefined);
        onVillageChange(0);
      }

      if (onClassroomChange) {
        setSelectedClassroom(undefined);
        onClassroomChange(0);
      }
    }
  };

  // VILLAGE
  const { villages } = useVillages();
  const villageDropdownOptions = useMemo(
    () =>
      villages
        .filter((village) => village.countries.some((country) => country.isoCode === selectedCountry || !selectedCountry))
        .map(({ id, name }) => ({ key: String(id), value: name })),
    [villages, selectedCountry],
  );

  const handleVillageChange = (villageId: string) => {
    if (onVillageChange) {
      setSelectedVillage(+villageId);
      onVillageChange(+villageId);

      if (onClassroomChange) {
        setSelectedClassroom(undefined);
        onClassroomChange(0);
      }
    }
  };

  // CLASSROOM
  const { classrooms } = useClassrooms();
  const classroomDropdownOptions = useMemo(
    () =>
      classrooms
        .filter((classroom) => classroom.villageId === selectedVillage || !selectedVillage)
        .filter((classroom) => classroom.country?.isoCode === selectedCountry || !selectedCountry)
        .map(({ id, user }) => ({ key: String(id), value: (user && getUserDisplayName(user, false, true)) || '' })),
    [classrooms, selectedVillage, selectedCountry],
  );

  const handleClassroomChange = (classroomId: string) => {
    if (onClassroomChange) {
      setSelectedClassroom(+classroomId);
      onClassroomChange(+classroomId);
    }
  };

  const renderDropdown = (data: DropdownOption[], onItemChange: (item: string) => void, label: string, showNone?: boolean, selectedItem?: string) => {
    return (
      <Grid item xs={3}>
        <Dropdown data={data} onItemChange={onItemChange} label={label} showNone={showNone} selectedItem={selectedItem} />
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} mb={2}>
      {renderDropdown(phaseDropdownOptions, handlePhaseChange, 'Phase', false, String(selectedPhase || ''))}
      {onCountryChange && renderDropdown(countryDropdownOptions, handleCountryChange, 'Pays', true, selectedCountry)}
      {onVillageChange && renderDropdown(villageDropdownOptions, handleVillageChange, 'Village', true, selectedVillage?.toString())}
      {onClassroomChange && renderDropdown(classroomDropdownOptions, handleClassroomChange, 'Classe', true, selectedClassroom?.toString())}
    </Grid>
  );
}
