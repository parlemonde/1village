import React from 'react';

import PelicoSearch from 'src/svg/pelico/pelico-search.svg';

export default function NoContentPelico() {
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: 30, margin: 30 }}>
      <div style={{ padding: 30, margin: 30, backgroundColor: '#F5F5F5', borderRadius: 10 }}>
        <p>Oups! Aucun contenu ne correspond a la recherche</p>
        <PelicoSearch />
      </div>
    </div>
  );
}
