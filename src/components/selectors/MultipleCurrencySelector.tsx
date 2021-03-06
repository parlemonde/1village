import React from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useCurrencies } from 'src/services/useCurrencies';
import { Currency } from 'types/currency.type';

type CurrencyOption = Currency & {
  firstLetter: string;
};

interface MultipleCurrencySelectorProps {
  label: string | React.ReactNode;
  value?: string[];
  onChange?(newValue: string[] | null): void;
  filterCurrencies?: string[];
  style?: React.CSSProperties;
}

export const MultipleCurrencySelector: React.FC<MultipleCurrencySelectorProps> = ({
  label,
  value = [],
  onChange,
  filterCurrencies,
  style,
}: MultipleCurrencySelectorProps) => {
  const { currencies } = useCurrencies();
  const options: CurrencyOption[] = React.useMemo(
    () =>
      currencies
        .filter(filterCurrencies ? (c) => filterCurrencies.find((c2) => c2.toLowerCase() === c.code.toLowerCase()) : () => true)
        // Filter duplicates
        .filter((currencys, index, self) => self.findIndex((t) => t.code == currencys.code) === index)
        .map((option) => {
          const firstLetter = option.name[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
          };
        }),
    [currencies, filterCurrencies],
  );

  const [option, setOption] = React.useState<CurrencyOption[] | null>([]);
  React.useEffect(() => {
    const newOption = options.filter((o) => value.includes(o.code)) || null;
    setOption(newOption);
  }, [options, value, currencies, filterCurrencies, onChange]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: CurrencyOption[] | null) => {
      if (!value) {
        setOption(newOption);
      }
      if (onChange) {
        onChange(newOption ? newOption.map((o) => o.code) : null);
      }
    },
    [value, onChange],
  );

  return (
    <Autocomplete
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      style={style}
      value={option}
      getOptionLabel={(option) => option.name}
      onChange={onChangeOption}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          variant="outlined"
          label={label}
          type="search"
        />
      )}
      autoHighlight
      blurOnSelect
      multiple
    />
  );
};
