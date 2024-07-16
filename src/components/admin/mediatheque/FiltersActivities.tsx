import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { countries } from 'server/utils/iso-3166-countries-french';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { activitiesLabel, activityNumberMapper, subThemesMap, subThemeNumberMapper } from 'src/config/mediatheque/dataFilters';
import type { UserData } from 'src/contexts/mediathequeContext';
import MediathequeContext from 'src/contexts/mediathequeContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(label: string, labelName: readonly string[], theme: Theme) {
  return {
    fontWeight: labelName.indexOf(label) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

export default function FiltersActivities() {
  const theme = useTheme();
  const [labelNameActivity, setLabelNameActivity] = useState<string[]>([]);
  const [labelNameSubTheme, setLabelNameSubTheme] = useState<string[]>([]);
  const [selectedVillages, setSelectedVillages] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string[]>([]);
  const { allActivities, setAllFiltered, filters, setFilters, useAdminData } = useContext(MediathequeContext);

  const updateAllFiltered = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentFilter: { [x: string]: any; countries?: any }) => {
      const newState = allActivities.filter((activity: UserData) => {
        let isValid = true;
        Object.keys(currentFilter).forEach((filterKey) => {
          if (filterKey === 'countries' && currentFilter.countries.length > 0) {
            const {
              user: {
                country: { isoCode },
              },
            } = activity;
            if (currentFilter.countries.findIndex((c: string) => c === isoCode) < 0) {
              isValid = false;
              return;
            }
            currentFilter.countries.forEach((c: string) => {
              if ((c === 'FR' && activity.user.type === 0) || activity.user.type === 1 || activity.user.type === 2) {
                isValid = false;
                return;
              }
            });
          } else if (Array.isArray(currentFilter[filterKey])) {
            if (currentFilter[filterKey].length > 0 && currentFilter[filterKey].indexOf(activity[filterKey as keyof UserData]) < 0) {
              isValid = false;
              return;
            }
          } else {
            if (activity[filterKey as keyof UserData] !== currentFilter[filterKey]) {
              isValid = false;
              return;
            }
          }
        });
        return isValid;
      });
      return newState;
    },
    [allActivities],
  );

  useEffect(() => {
    const newFiltered = updateAllFiltered(filters);
    setAllFiltered(newFiltered as unknown as []);
  }, [filters, setAllFiltered, updateAllFiltered]);

  const handleChangeLabelActivity = (event: SelectChangeEvent<typeof labelNameActivity>) => {
    const {
      target: { value },
    } = event;
    const stringValue = typeof value === 'string' ? value : value.join(',');
    setLabelNameActivity(stringValue.split(','));
    setLabelNameSubTheme([]);
    setSelectedVillages([]);

    setFilters({
      type: activityNumberMapper[stringValue],
    });
  };

  const handleSubtypesChange = (event: SelectChangeEvent<typeof labelNameSubTheme>) => {
    const {
      target: { value },
    } = event;

    const valueArray = typeof value === 'string' ? [value] : value;
    setLabelNameSubTheme(valueArray);
    setSelectedVillages([]);

    const selectedSubtypes = valueArray.map((v: string) => subThemeNumberMapper[v]);
    setFilters((prev) => ({ ...prev, villageId: [], countries: [], subType: selectedSubtypes }));
  };

  const handleVMChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    const numericValue = Array.isArray(value) ? value.map(Number) : [Number(value)];
    setSelectedVillages(numericValue);
    setSelectedCountries([]);
    setFilters((prev) => ({ ...prev, countries: [], villageId: value }));
  };

  const labelNameVillageMondeSelect = useMemo(() => {
    const result: Array<{ villageId: number; name: string }> = [];
    const filteredNoWm = updateAllFiltered({ ...filters, villageId: [] });
    filteredNoWm.forEach(({ villageId, name }) => {
      if (result.findIndex((vm) => vm.villageId === villageId) < 0) {
        result.push({ villageId, name });
      }
    });
    return result.sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [filters, updateAllFiltered]);

  const subThemes = labelNameActivity.flatMap((activity) => subThemesMap[activity] || []);

  const countryList = useMemo(() => {
    const result: Array<{ isoCode: string; name: string }> = [];
    const filteredNoWm: Array<{ countries?: Array<{ isoCode: string; name: string }> }> = updateAllFiltered({ ...filters, countries: [] }) as Array<{
      countries?: Array<{ isoCode: string; name: string }>;
    }>;

    filteredNoWm.forEach(({ countries }) => {
      countries?.forEach(({ isoCode, name }) => {
        if (result.findIndex((r) => r.isoCode === isoCode) < 0) {
          result.push({ isoCode, name });
        }
      });
    });
    return result.sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [filters, updateAllFiltered]);

  const schoolList = useMemo(() => {
    const result: Array<{ schoolName: string; userId: number }> = [];
    const filteredNoWm = updateAllFiltered({ ...filters, userId: [] });
    filteredNoWm.forEach(({ user, userId }: { user: { school: string }; userId: number }) => {
      if (result.findIndex((r) => r.schoolName === user.school) < 0) {
        const schoolName = user.school;
        result.push({ schoolName, userId });
      }
    });

    return result.sort((a, b) => (a < b ? -1 : 1)).filter((v, i, a) => a.findIndex((t) => t.schoolName === v.schoolName) === i);
  }, [filters, updateAllFiltered]);

  const handleCountryChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;

    setSelectedCountries(selectedValues);

    setFilters((prev) => ({ ...prev, countries: value }));
  };

  const handleSchoolChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    const selectedValues = typeof value === 'string' ? value.split(',') : value;

    setSelectedSchool(selectedValues);

    setFilters((prev) => ({ ...prev, userId: value }));
  };

  return (
    <>
      <div>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            displayEmpty
            value={labelNameActivity.length > 0 ? labelNameActivity : ''}
            onChange={handleChangeLabelActivity}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Activités</>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {activitiesLabel.map((label, index) => (
              <MenuItem key={index} value={label} style={getStyles(label, labelNameActivity, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            multiple
            displayEmpty
            value={labelNameSubTheme}
            onChange={handleSubtypesChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Thèmes</>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            <MenuItem disabled value="">
              <em>{subThemes.length ? 'Thèmes' : 'Pas de thématiques'}</em>
            </MenuItem>
            {subThemes.map((label, index) => (
              <MenuItem key={index} value={label} style={getStyles(label, labelNameSubTheme, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            disabled={useAdminData === true}
            multiple
            displayEmpty
            value={selectedVillages}
            onChange={handleVMChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>VM</>;
              }
              const names = (selected as unknown as number[]).map((v) => labelNameVillageMondeSelect.find((v1) => v1.villageId === v)?.name);
              return names.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {labelNameVillageMondeSelect?.map(({ name, villageId }) => (
              <MenuItem
                key={villageId}
                value={villageId}
                style={getStyles(
                  name,
                  labelNameVillageMondeSelect.map((t) => t.name),
                  theme,
                )}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            disabled={useAdminData === true}
            multiple
            displayEmpty
            value={selectedCountries}
            onChange={handleCountryChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Pays</>;
              }

              const names = selected.map((isoCode: string) => {
                const country = countries.find((country) => country.isoCode === isoCode);
                return country ? country.name : undefined;
              });
              return names.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {countryList?.map(({ name, isoCode }) => (
              <MenuItem
                key={isoCode}
                value={isoCode}
                style={getStyles(
                  name,
                  countryList.map((t) => t.name),
                  theme,
                )}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            disabled={useAdminData === true}
            multiple
            displayEmpty
            value={selectedSchool}
            onChange={handleSchoolChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Classes</>;
              }
              const names = selected.map((userId: string) => {
                const school = schoolList.find((school) => school.userId === Number(userId));
                return school ? school.schoolName : undefined;
              });

              return names.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {schoolList?.map(({ schoolName, userId }) => (
              <MenuItem
                key={userId}
                value={userId}
                style={getStyles(
                  schoolName,
                  schoolList.map((t) => t.schoolName),
                  theme,
                )}
              >
                {schoolName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
}
