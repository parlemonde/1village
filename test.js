/* eslint-disable no-undef */
/* eslint-disable no-console */
const stringSimilarity = require("string-similarity");

const { countries } = require("./dist/server/utils/iso-3166-countries-french");

const name = "Village monde France – République démocratique du Congo";
const villageCountries = (name.toLowerCase().startsWith("village monde") ? name.slice(14) : name).split(/[-–]/).filter((s) => s.length > 0);
if (villageCountries.length === 2) {
  const c1 = stringSimilarity.findBestMatch(
    villageCountries[0].trim().toLowerCase(),
    countries.map((c) => c.name.toLowerCase()),
  );
  const c2 = stringSimilarity.findBestMatch(
    villageCountries[1].trim().toLowerCase(),
    countries.map((c) => c.name.toLowerCase()),
  );
  console.log(c1.bestMatch);
  console.log(countries[c1.bestMatchIndex]);
  console.log(c2.bestMatch);
  console.log(countries[c2.bestMatchIndex]);
}
