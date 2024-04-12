/* eslint-disable no-console */
import fs from 'fs';

function checkHuskyFolder() {
  const pathHuskyDir = './.husky';
  const huskyFolderExists = fs.existsSync(pathHuskyDir);
  if (!huskyFolderExists) {
    // eslint-disable-next-line no-undef
    const msg = 'You must run the following command first command\n- npx husky init && node ./prepareHusky.mjs';
    // console.log('Husky pre-push setup created!!');
    throw msg;
  } else {
    fs.unlink(pathHuskyDir + '/pre-commit', (err) => {
      // eslint-disable-next-line no-undef
      if (err) console.log('No pre-commit file found');
    });
    fs.writeFile(`${pathHuskyDir}/pre-push`, 'yarn pre-push', { ovewrite: true }, function (err) {
      if (err) throw err;
      // eslint-disable-next-line no-undef
      console.log('Husky setup done!!');
    });
  }
}

checkHuskyFolder();
