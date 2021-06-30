import React from 'react';

import { ButtonGroup, Button, Menu, MenuItem, Divider } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { capitalize } from 'src/utils';

type Period = {
  startDate: Date;
  endDate: Date;
  type: 'day' | 'month' | 'year';
  delta: number;
};
type GetPeriodFunc = () => Period;

const getNow = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};
export const getToday: GetPeriodFunc = () => {
  const startDate = getNow();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  return {
    startDate,
    endDate,
    type: 'day',
    delta: 1,
  };
};
const getYesterday: GetPeriodFunc = () => {
  const endDate = getNow();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 1);
  return {
    startDate,
    endDate,
    type: 'day',
    delta: 1,
  };
};
const getWeek: GetPeriodFunc = () => {
  const startDate = getNow();
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  return {
    startDate,
    endDate,
    type: 'day',
    delta: 7,
  };
};
const getLastWeek: GetPeriodFunc = () => {
  const endDate = getNow();
  endDate.setDate(endDate.getDate() - endDate.getDay() + 1);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);
  return {
    startDate,
    endDate,
    type: 'day',
    delta: 7,
  };
};
const getMonth: GetPeriodFunc = () => {
  const startDate = getNow();
  startDate.setDate(1);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  return {
    startDate,
    endDate,
    type: 'month',
    delta: 1,
  };
};
const getLastMonth: GetPeriodFunc = () => {
  const endDate = getNow();
  endDate.setDate(1);
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 1);
  return {
    startDate,
    endDate,
    type: 'month',
    delta: 1,
  };
};
const getLastSixMonth: GetPeriodFunc = () => {
  const endDate = getNow();
  endDate.setDate(1);
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 5);
  return {
    startDate,
    endDate,
    type: 'month',
    delta: 6,
  };
};
const getYear: GetPeriodFunc = () => {
  const startDate = getNow();
  startDate.setMonth(0);
  startDate.setDate(1);
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  return {
    startDate,
    endDate,
    type: 'year',
    delta: 1,
  };
};
const getLastYear: GetPeriodFunc = () => {
  const endDate = getNow();
  endDate.setMonth(0);
  endDate.setDate(1);
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);
  return {
    startDate,
    endDate,
    type: 'year',
    delta: 1,
  };
};

const TIME_OPTIONS = [
  {
    name: "Aujourd'hui",
    getPeriod: getToday,
  },
  {
    name: 'Hier',
    getPeriod: getYesterday,
  },
  {
    name: 'Cette semaine',
    getPeriod: getWeek,
    hasDividerTop: true,
  },
  {
    name: 'La semaine dernière',
    getPeriod: getLastWeek,
  },
  {
    name: 'Ce mois',
    getPeriod: getMonth,
    hasDividerTop: true,
  },
  {
    name: 'Le mois dernier',
    getPeriod: getLastMonth,
  },
  {
    name: 'Ces 6 derniers mois',
    getPeriod: getLastSixMonth,
    selectName: false,
  },
  {
    name: 'Cette année',
    getPeriod: getYear,
    hasDividerTop: true,
  },
  {
    name: "L'année dernière",
    getPeriod: getLastYear,
  },
];

const getFullDay = (date: Date, options: { noWeekday?: boolean } = {}) =>
  date.toLocaleDateString('fr-FR', { weekday: options.noWeekday ? undefined : 'long', year: 'numeric', month: 'long', day: 'numeric' });
const getFullMonth = (date: Date) => date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
const getSelectedOptionIndex = (period: Period) =>
  TIME_OPTIONS.findIndex((option) => {
    const periodForOption = option.getPeriod();
    return (
      period.type === periodForOption.type &&
      period.delta === periodForOption.delta &&
      period.startDate.getTime() === periodForOption.startDate.getTime()
    );
  });

const getLabel = (period: Period, selectedOptionIndex: number) => {
  if (selectedOptionIndex >= 0 && selectedOptionIndex < 4) {
    return TIME_OPTIONS[selectedOptionIndex].name;
  }

  if (period.type === 'day' && period.delta === 1) {
    return capitalize(getFullDay(period.startDate));
  } else if (period.type === 'day' && period.delta > 1) {
    return `Semaine du ${getFullDay(period.startDate, { noWeekday: true })} au ${getFullDay(period.endDate, { noWeekday: true })}`;
  } else if (period.type === 'month' && period.delta === 1) {
    return capitalize(getFullMonth(period.startDate));
  } else if (period.type === 'month' && period.delta > 1) {
    return `De ${getFullMonth(period.startDate)} à ${getFullMonth(period.endDate)}`;
  } else {
    return `Année ${period.startDate.getFullYear()}`;
  }
};

interface TimePickerProps {
  period: Period;
  setPeriod(newPeriod: Period): void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ period, setPeriod }: TimePickerProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const popoverWidth = React.useRef<string | number>('unset');
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    popoverWidth.current = event.currentTarget.getBoundingClientRect().width;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onNextTimeFrame = () => {
    const startDate = new Date(period.endDate);
    const endDate = new Date(period.endDate);
    if (period.type === 'day') {
      endDate.setDate(endDate.getDate() + period.delta);
    } else if (period.type === 'month') {
      endDate.setMonth(endDate.getMonth() + period.delta);
    } else {
      endDate.setFullYear(endDate.getFullYear() + period.delta);
    }

    setPeriod({
      ...period,
      startDate,
      endDate,
    });
  };
  const onPreviousTimeFrame = () => {
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.startDate);
    if (period.type === 'day') {
      startDate.setDate(startDate.getDate() - period.delta);
    } else if (period.type === 'month') {
      startDate.setMonth(startDate.getMonth() - period.delta);
    } else {
      startDate.setFullYear(startDate.getFullYear() - period.delta);
    }

    setPeriod({
      ...period,
      startDate,
      endDate,
    });
  };

  const selectedOptionIndex = React.useMemo(() => getSelectedOptionIndex(period), [period]);
  const label = React.useMemo(() => getLabel(period, selectedOptionIndex), [selectedOptionIndex, period]);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <ButtonGroup size="large" style={{ marginRight: '1rem' }}>
          <Button style={{ backgroundColor: 'white', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }} onClick={onPreviousTimeFrame}>
            <ChevronLeftIcon />
          </Button>
          <Button style={{ backgroundColor: 'white', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }} onClick={onNextTimeFrame}>
            <ChevronRightIcon />
          </Button>
        </ButtonGroup>
        <Button
          variant="outlined"
          aria-controls="simple-menu"
          endIcon={<KeyboardArrowDownIcon />}
          size="large"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ flex: 1, backgroundColor: 'white', borderRadius: '4px' }}
        >
          <span style={{ flex: 1 }}>{label}</span>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          PaperProps={{ variant: 'outlined', style: { width: popoverWidth.current, marginTop: '0.5rem', borderColor: 'rgba(0, 0, 0, 0.23)' } }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {TIME_OPTIONS.map((t, index) => (
            <>
              {t.hasDividerTop && <Divider />}
              <MenuItem
                key={index}
                onClick={() => {
                  setPeriod(t.getPeriod());
                  handleClose();
                }}
                selected={index === selectedOptionIndex}
              >
                {t.name}
              </MenuItem>
            </>
          ))}
        </Menu>
      </div>
    </>
  );
};
