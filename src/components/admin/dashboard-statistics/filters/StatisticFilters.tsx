import React, { useMemo, useState } from 'react';

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
};

export default function StatisticFilters({ onPhaseChange, onCountryChange, onVillageChange, onClassroomChange }: StatisticFiltersProps) {
  // PHASE
  const phaseDropdownOptions = [
    { key: '1', value: 'Phase 1' },
    { key: '2', value: 'Phase 2' },
    { key: '3', value: 'Phase 3' },
  ];
  const handlePhaseChange = (phaseId: string) => {
    onPhaseChange(+phaseId);
  };

  // COUNTRY
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const { countries } = useCountries({ hasVillage: true });
  const countryDropdownOptions = useMemo(() => countries.map(({ isoCode, name }) => ({ key: isoCode, value: name })), [countries]);

  const handleCountryChange = (countryCode: string) => {
    if (onCountryChange) {
      setSelectedCountry(countryCode);
      onCountryChange(countryCode);
    }
  };

  // VILLAGE
  const [selectedVillage, setSelectedVillage] = useState<number>();
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
      onClassroomChange(+classroomId);
    }
  };

  const renderDropdown = (data: DropdownOption[], onItemChange: (item: string) => void, label: string) => {
    return (
      <Grid item xs={3}>
        <Dropdown data={data} onItemChange={onItemChange} label={label} />
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {renderDropdown(phaseDropdownOptions, handlePhaseChange, 'Phase')}
      {onCountryChange && renderDropdown(countryDropdownOptions, handleCountryChange, 'Pays')}
      {onVillageChange && renderDropdown(villageDropdownOptions, handleVillageChange, 'Village')}
      {onClassroomChange && renderDropdown(classroomDropdownOptions, handleClassroomChange, 'Classe')}
    </Grid>
  );
}
