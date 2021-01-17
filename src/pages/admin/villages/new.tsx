import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import { Button, TextField } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { AdminTile } from "src/components/admin/AdminTile";
import { useCountries } from "src/services/useCountries";
import { useVillageRequests } from "src/services/useVillages";
import { countryToFlag } from "src/utils";
import type { Country } from "types/country.type";

type CountryOption = Country & {
  firstLetter: string;
};

const NewVillage: React.FC = () => {
  const router = useRouter();
  const { countries } = useCountries();
  const { addVillage } = useVillageRequests();
  const options: CountryOption[] = countries.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const [village, setVillage] = React.useState<{ name: string; country1: CountryOption | null; country2: CountryOption | null }>({
    name: "",
    country1: null,
    country2: null,
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!village.name || !village.country1 || !village.country2) {
      return;
    }
    const result = await addVillage({
      name: village.name,
      countries: [village.country1.isoCode, village.country2.isoCode],
    });
    if (result !== null) {
      router.push("/admin/villages");
    }
  };

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/villages">
          <MaterialLink href="/admin/villages">
            <h1>Villages</h1>
          </MaterialLink>
        </Link>
        <h1>Nouveau</h1>
      </Breadcrumbs>
      <AdminTile title="Ajouter un village">
        <form autoComplete="off" style={{ width: "100%", padding: "1rem" }} onSubmit={onSubmit}>
          <TextField
            className="full-width"
            name="vl-n"
            label="Nom du village"
            autoComplete="new-password"
            value={village.name}
            onChange={(event) => {
              setVillage((v) => ({ ...v, name: event.target.value }));
            }}
            style={{ marginBottom: "1rem" }}
          />
          <Autocomplete
            id="vl-ct-1"
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            value={village.country1}
            onChange={(_event, newValue: CountryOption | null) => {
              setVillage((v) => ({ ...v, country1: newValue }));
            }}
            getOptionSelected={(option, value) => option.isoCode === value.isoCode}
            getOptionLabel={(option) => option.name}
            style={{ width: "100%", marginBottom: "1rem" }}
            renderOption={(option) => (
              <>
                <span style={{ marginRight: "0.6rem" }}>{countryToFlag(option.isoCode)}</span>
                {option.name}
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
                label="Pays 1"
              />
            )}
            autoHighlight
            blurOnSelect
          />
          <Autocomplete
            id="vl-ct-2"
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            value={village.country2}
            onChange={(_event, newValue: CountryOption | null) => {
              setVillage((v) => ({ ...v, country2: newValue }));
            }}
            getOptionSelected={(option, value) => option.isoCode === value.isoCode}
            getOptionLabel={(option) => option.name}
            style={{ width: "100%", marginBottom: "1rem" }}
            renderOption={(option) => (
              <>
                <span style={{ marginRight: "0.6rem" }}>{countryToFlag(option.isoCode)}</span>
                {option.name}
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
                label="Pays 2"
              />
            )}
            autoHighlight
            blurOnSelect
          />
          <div className="text-center" style={{ margin: "2rem 0 1rem 0" }}>
            <Button color="primary" variant="contained" type="submit">
              Créer le village !
            </Button>
          </div>
        </form>
      </AdminTile>
      <Link href="/admin/villages">
        <Button variant="outlined" style={{ margin: "1rem 0" }} component="a" href="/admin/villages">
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default NewVillage;
