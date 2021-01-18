import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import { Button, TextField } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { AdminTile } from "src/components/admin/AdminTile";
import { UserContext } from "src/contexts/userContext";
import { useCountries } from "src/services/useCountries";
import { useVillageRequests } from "src/services/useVillages";
import { getQueryString } from "src/utils";
import { countryToFlag } from "src/utils";
import type { Country } from "types/country.type";
import type { Village } from "types/village.type";

type CountryOption = Country & {
  firstLetter: string;
};
type EditVillage = { name: string; country1: CountryOption | null; country2: CountryOption | null };

const EditVillage: React.FC = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { countries } = useCountries();
  const options: CountryOption[] = React.useMemo(
    () =>
      countries.map((option) => {
        const firstLetter = option.name[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
          ...option,
        };
      }),
    [countries],
  );
  const { editVillage } = useVillageRequests();
  const villageId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) || 0, [router]);
  const [village, setVillage] = React.useState<EditVillage | null>(null);

  const getTheme = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/villages/${villageId}`,
    });
    if (response.error) {
      router.push("/admin/villages");
    } else {
      setVillage({
        name: (response.data as Village).name,
        country1: options.find((option) => option.isoCode.toLowerCase() === ((response.data as Village).countries[0] || "").toLowerCase()) || null,
        country2: options.find((option) => option.isoCode.toLowerCase() === ((response.data as Village).countries[1] || "").toLowerCase()) || null,
      });
    }
  }, [axiosLoggedRequest, router, villageId, options]);

  React.useEffect(() => {
    getTheme().catch((e) => console.error(e));
  }, [getTheme]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!village.name || !village.country1 || !village.country2) {
      return;
    }
    const result = await editVillage({
      id: villageId,
      name: village.name,
      countries: [village.country1.isoCode, village.country2.isoCode],
    });
    if (result !== null) {
      router.push("/admin/villages");
    }
  };

  if (village === null) {
    return <div></div>;
  }

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/villages">
          <MaterialLink href="/admin/villages">
            <h1>Villages</h1>
          </MaterialLink>
        </Link>
        <h1>{village.name}</h1>
      </Breadcrumbs>
      <AdminTile title="Modifier un village">
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
                  autoComplete: "off", // disable autocomplete and autofill
                }}
                type="search"
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
                  autoComplete: "off", // disable autocomplete and autofill
                }}
                type="search"
                label="Pays 2"
              />
            )}
            autoHighlight
            blurOnSelect
          />
          <div className="text-center" style={{ margin: "2rem 0 1rem 0" }}>
            <Button color="primary" variant="contained" type="submit">
              Mettre à jour le village
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

export default EditVillage;
