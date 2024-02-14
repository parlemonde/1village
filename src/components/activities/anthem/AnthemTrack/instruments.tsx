import accordion from './../../../../svg/anthem/instruments/accordion.svg';
import alboka from './../../../../svg/anthem/instruments/alboka.svg';
import altoClarinet from './../../../../svg/anthem/instruments/alto_clarinet.svg';
import altoSarrusophone from './../../../../svg/anthem/instruments/alto_sarrusophone.svg';
import appalachianDulcimer from './../../../../svg/anthem/instruments/appalachian_dulcimer.svg';
import archlute from './../../../../svg/anthem/instruments/archlute.svg';
import archtopGuitar from './../../../../svg/anthem/instruments/archtop_guitar.svg';
import arghul from './../../../../svg/anthem/instruments/arghul.svg';
import aulochrome from './../../../../svg/anthem/instruments/aulochrome.svg';
import autoharp from './../../../../svg/anthem/instruments/autoharp.svg';
import baglama from './../../../../svg/anthem/instruments/baglama.svg';
import bagpipe from './../../../../svg/anthem/instruments/bagpipe.svg';
import balalaika from './../../../../svg/anthem/instruments/balalaika.svg';
import bandoneon from './../../../../svg/anthem/instruments/bandoneon.svg';
import bandura from './../../../../svg/anthem/instruments/bandura.svg';
import banjo from './../../../../svg/anthem/instruments/banjo.svg';
import bariSax from './../../../../svg/anthem/instruments/bari_sax.svg';
import baritoneHorn from './../../../../svg/anthem/instruments/baritone_horn.svg';
import barytone from './../../../../svg/anthem/instruments/barytone.svg';
import bassClarinet from './../../../../svg/anthem/instruments/bass_clarinet.svg';
import bassDrum from './../../../../svg/anthem/instruments/bass_drum.svg';
import bassGuitar from './../../../../svg/anthem/instruments/bass_guitar.svg';
import bassOboe from './../../../../svg/anthem/instruments/bass_oboe.svg';
import bassetClarinet from './../../../../svg/anthem/instruments/basset_clarinet.svg';
import bassetHorn from './../../../../svg/anthem/instruments/basset_horn.svg';
import bassoon from './../../../../svg/anthem/instruments/bassoon.svg';
import bawu from './../../../../svg/anthem/instruments/bawu.svg';

export type InstrumentsType = {
  name: string;
  svg?: string;
};

const instruments: InstrumentsType[] = [
  { name: 'accordéon', svg: accordion },
  { name: 'alboka', svg: alboka },
  { name: 'clarinette alto', svg: altoClarinet },
  { name: 'sarrusophone alto', svg: altoSarrusophone },
  { name: 'dulcimer appalachien', svg: appalachianDulcimer },
  { name: 'archiluth', svg: archlute },
  { name: 'guitare archtop', svg: archtopGuitar },
  { name: 'arghoul', svg: arghul },
  { name: 'aulochrome', svg: aulochrome },
  { name: 'autoharpe', svg: autoharp },
  { name: 'baglama', svg: baglama },
  { name: 'cornemuse', svg: bagpipe },
  { name: 'balalaïka', svg: balalaika },
  { name: 'bandonéon', svg: bandoneon },
  { name: 'bandoura', svg: bandura },
  { name: 'banjo', svg: banjo },
  { name: 'saxophone baryton', svg: bariSax },
  { name: 'cor baryton', svg: baritoneHorn },
  { name: 'baryton', svg: barytone },
  { name: 'clarinette basse', svg: bassClarinet },
  { name: 'tambour basse', svg: bassDrum },
  { name: 'guitare basse', svg: bassGuitar },
  { name: 'hautbois basse', svg: bassOboe },
  { name: 'clarinette basse', svg: bassetClarinet },
  { name: 'cor de basset', svg: bassetHorn },
  { name: 'basson', svg: bassoon },
  { name: 'bawu', svg: bawu },
];

export default instruments;
