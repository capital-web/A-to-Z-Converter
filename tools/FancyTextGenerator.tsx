
import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Search, Trash2, Hash, Type, Star, Zap } from 'lucide-react';

const FONT_MAPS = {
  bold: {
    A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌',
    N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
    a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦',
    n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  },
  italic: {
    A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺', H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀',
    N: '𝑁', O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈', V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',
    a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔', h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚',
    n: '𝑛', o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢', v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧'
  },
  boldItalic: {
    A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴',
    N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎',
    n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛'
  },
  script: {
    A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ',
    N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵',
    a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂',
    n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏'
  },
  boldScript: {
    A: '𝓐', B: '𝓑', C: '𝓒', D: '𝓓', E: '𝓔', F: '𝓕', G: '𝓖', H: '𝓗', I: '𝓘', J: '𝓙', K: '𝓚', L: '𝓛', M: '𝓜',
    N: '𝓝', O: '𝓞', P: '𝓟', Q: '𝓠', R: '𝓡', S: '𝓢', T: '𝓣', U: '𝓤', V: '𝓥', W: '𝓦', X: '𝓧', Y: '𝓨', Z: '𝓩',
    a: '𝓪', b: '𝓫', c: '𝓬', d: '𝓭', e: '𝓮', f: '𝓯', g: '𝓰', h: '𝓱', i: '𝓲', j: '𝓳', k: '𝓴', l: '𝓵', m: '𝓶',
    n: '𝓷', o: '𝓸', p: '𝓹', q: '𝓺', r: '𝓻', s: '𝓼', t: '𝓽', u: '𝓾', v: '𝓿', w: '𝔀', x: '𝔁', y: '𝔂', z: '𝔃'
  },
  fraktur: {
    A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐',
    N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ',
    a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪',
    n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷'
  },
  boldFraktur: {
    A: '𝕬', B: '𝕭', C: '𝕮', D: '𝕯', E: '𝕰', F: '𝕱', G: '𝕲', H: '𝕳', I: '𝕴', J: '𝕵', K: '𝕶', L: '𝕷', M: '𝕸',
    N: '𝕹', O: '𝕺', P: '𝕻', Q: '𝕼', R: '𝕽', S: '𝕾', T: '𝕿', U: '𝖀', V: '𝖁', W: '𝖂', X: '𝖃', Y: '𝖄', Z: '𝖅',
    a: '𝖆', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌', h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒',
    n: '𝖓', o: '𝖔', p: '𝖕', q: '𝖖', r: '𝖗', s: '𝖘', t: '𝖙', u: '𝖚', v: '𝖛', w: '𝖜', x: '𝖝', y: '𝖞', z: '𝖟'
  },
  doubleStruck: {
    A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄',
    N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',
    a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞',
    n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
  },
  smallCaps: {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', f: 'ꜰ', G: 'ɢ', H: 'ʜ', I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ',
    N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ', S: 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', F: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
    n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  },
  bubble: {
    A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ',
    N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',
    a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ',
    n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ',
    '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
  },
  bubbleDark: {
    A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗', I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜',
    N: '🅝', O: '🅞', P: '🅟', Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧', Y: '🅨', Z: '🅩',
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖', h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜',
    n: '🅝', o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤', v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾'
  },
  square: {
    A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼',
    N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉',
    a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶', h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼',
    n: '🄽', o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄', v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉'
  },
  squareDark: {
    A: '🅰', B: '🅱', C: '🅲', D: '🅳', E: '🅴', F: '🅵', G: '🅶', H: '🅷', I: '🅸', J: '🅙', K: '🅚', L: '🅻', M: '🅼',
    N: '🅽', O: '🅾', P: '🅿', Q: '🆀', R: '🆁', S: '🆂', T: '🆃', U: '🆄', V: '🆅', W: '🆆', X: '🆇', Y: '🆈', Z: '🆉',
    a: '🅰', b: '🅱', c: '🅲', d: '🅳', e: '🅴', f: '🅵', g: '🅶', h: '🅷', i: '🅸', j: '🅙', k: '🅚', l: '🅻', m: '🅼',
    n: '🅽', o: '🅾', p: '🅿', q: '🆀', r: '🆁', s: '🆂', t: '🆃', u: '🆄', v: '🆅', w: '🆆', x: '🆇', y: '🆈', z: '🆉'
  },
  parenthesis: {
    A: '⒜', B: '⒝', C: '⒞', D: '⒟', E: '⒠', F: '⒡', G: '⒢', H: '⒣', I: '⒤', J: '⒥', K: '⒦', L: '⒧', M: '⒨',
    N: '⒩', O: '⒪', P: '⒫', Q: '⒬', R: '⒭', S: '⒮', T: '⒯', U: '⒰', V: '⒱', W: '⒲', X: '⒳', Y: '⒴', Z: '⒵',
    a: '⒜', b: '⒝', c: '⒞', d: '⒟', e: '⒠', f: '⒡', g: '⒢', h: '⒣', i: '⒤', j: '⒥', k: '⒦', l: '⒧', m: '⒨',
    n: '⒩', o: '⒪', p: '⒫', q: '⒬', r: '⒭', s: '⒮', t: '⒯', u: '⒰', v: '⒱', w: '⒲', x: '⒳', y: '⒴', z: '⒵',
    '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼'
  },
  monospaced: {
    A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
    N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
    a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
    n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: 'ｓ', t: 'ｔ', u: 'ｕ', v: 'ｖ', w: 'ｗ', x: 'ｘ', y: 'ｙ', z: 'ｚ'
  }
};

const DECORATIONS = [
  { prefix: '⚡ ', suffix: ' ⚡', label: 'Lightning' },
  { prefix: '✨ ', suffix: ' ✨', label: 'Sparkles' },
  { prefix: '⭐ ', suffix: ' ⭐', label: 'Stars' },
  { prefix: '🔥 ', suffix: ' 🔥', label: 'Fire' },
  { prefix: '❤ ', suffix: ' ❤', label: 'Heart' },
  { prefix: '♛ ', suffix: ' ♛', label: 'Crown' },
  { prefix: '【', suffix: '】', label: 'Bracketed' },
  { prefix: '« ', suffix: ' »', label: 'Arrows' },
  { prefix: '† ', suffix: ' †', label: 'Cross' },
  { prefix: 'ミ★ ', suffix: ' ★彡', label: 'Shooting Star' },
  { prefix: '◦•●◉✿ ', suffix: ' ✿◉●•◦', label: 'Floral' },
  { prefix: '╰☆☆ ', suffix: ' ☆☆╮', label: 'Stars Rounded' },
  { prefix: '★·.·´¯`·.·★ ', suffix: ' ★·.·´¯`·.·★', label: 'Border' },
  { prefix: '♬ ', suffix: ' ♬', label: 'Musical' },
  { prefix: '◢ ', suffix: ' ◣', label: 'Geometric' },
  { prefix: '░▒▓█ ', suffix: ' █▓▒░', label: 'ASCII Box' },
  { prefix: '⫷ ', suffix: ' ⫸', label: 'Fancy Arrows' },
  { prefix: '꧁ ', suffix: ' ꧂', label: 'Winged' },
  { prefix: '❦ ', suffix: ' ❦', label: 'Leaf' },
  { prefix: '⚕ ', suffix: ' ⚕', label: 'Medical' },
  { prefix: '⚛ ', suffix: ' ⚛', label: 'Atom' },
  { prefix: '☯ ', suffix: ' ☯', label: 'Yin Yang' },
  { prefix: '⚔ ', suffix: ' ⚔', label: 'Swords' },
  { prefix: '♚ ', suffix: ' ♚', label: 'King' },
  { prefix: '💎 ', suffix: ' 💎', label: 'Diamond' },
  { prefix: '☾ ', suffix: ' ☽', label: 'Moon' },
  { prefix: '☀ ', suffix: ' ☀', label: 'Sun' },
  { prefix: '☂ ', suffix: ' ☂', label: 'Umbrella' },
  { prefix: '☘ ', suffix: ' ☘', label: 'Clover' },
  { prefix: '☠ ', suffix: ' ☠', label: 'Danger' },
  { prefix: '☢ ', suffix: ' ☢', label: 'Radioactive' },
  { prefix: '☣ ', suffix: ' ☣', label: 'Biohazard' },
  { prefix: '☬ ', suffix: ' ☬', label: 'Ethnic' },
  { prefix: '⛩ ', suffix: ' ⛩', label: 'Shrine' },
  { prefix: '۞ ', suffix: ' ۞', label: 'Islamic' },
  { prefix: '✡ ', suffix: ' ✡', label: 'Jewish' },
  { prefix: '✝ ', suffix: ' ✝', label: 'Christian' },
  { prefix: '☪ ', suffix: ' ☪', label: 'Muslim' },
  { prefix: '☮ ', suffix: ' ☮', label: 'Peace' },
];

const STYLES_CONFIG = [
  { id: 'bold', label: 'Mathematical Bold' },
  { id: 'italic', label: 'Mathematical Italic' },
  { id: 'boldItalic', label: 'Bold Italic' },
  { id: 'script', label: 'Fancy Script' },
  { id: 'boldScript', label: 'Bold Calligraphy' },
  { id: 'fraktur', label: 'Old English / Fraktur' },
  { id: 'boldFraktur', label: 'Bold Gothic' },
  { id: 'doubleStruck', label: 'Double Struck (Hollow)' },
  { id: 'smallCaps', label: 'Small Caps' },
  { id: 'bubble', label: 'Bubbled' },
  { id: 'bubbleDark', label: 'Inverted Bubbles' },
  { id: 'square', label: 'Squared' },
  { id: 'squareDark', label: 'Dark Squared' },
  { id: 'parenthesis', label: 'Parenthesis' },
  { id: 'monospaced', label: 'Typewriter / Mono' },
];

// Zalgo / Glitch Engine Characters
const ZALGO_CHARS = {
  up: ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̾', '̻', '̾', '͆', '͇'],
  mid: ['̕', '̛', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', '̽', '̾', '̿', '̀', '́', '͂', '̓', '̈́', '͋', '͌', '͓', '̽', '̾', '͛', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̾', '̻', '̾', '͆', '͇'],
  down: ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣']
};

const FancyTextGenerator: React.FC = () => {
  const [input, setInput] = useState<string>('OmniCalc Pro');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const transformText = (text: string, mapKey: keyof typeof FONT_MAPS) => {
    const map = FONT_MAPS[mapKey] as Record<string, string>;
    return text.split('').map(char => map[char] || char).join('');
  };

  const zalgoText = (text: string, level: 'low' | 'high' = 'low') => {
    const count = level === 'low' ? 3 : 8;
    return text.split('').map(char => {
      let res = char;
      for (let i = 0; i < count; i++) {
        res += ZALGO_CHARS.up[Math.floor(Math.random() * ZALGO_CHARS.up.length)];
        res += ZALGO_CHARS.mid[Math.floor(Math.random() * ZALGO_CHARS.mid.length)];
        res += ZALGO_CHARS.down[Math.floor(Math.random() * ZALGO_CHARS.down.length)];
      }
      return res;
    }).join('');
  };

  const generatedStyles = useMemo(() => {
    if (!input) return [];
    
    // 1. Base Styles (Font Mappings)
    const base = STYLES_CONFIG.map(config => ({
      id: `base-${config.id}`,
      label: config.label,
      transformed: transformText(input, config.id as keyof typeof FONT_MAPS)
    }));

    // 2. Decorative Styles (Raw Input + Decoration)
    const decoratedRaw = DECORATIONS.map((dec, i) => ({
      id: `dec-raw-${i}`,
      label: dec.label,
      transformed: `${dec.prefix}${input}${dec.suffix}`
    }));

    // 3. Combined: Bold + Every Decoration
    const combinedBold = DECORATIONS.map((dec, i) => ({
      id: `comb-bold-${i}`,
      label: `Bold ${dec.label}`,
      transformed: `${dec.prefix}${transformText(input, 'bold')}${dec.suffix}`
    }));

    // 4. Combined: Script + Every Decoration
    const combinedScript = DECORATIONS.map((dec, i) => ({
      id: `comb-script-${i}`,
      label: `Fancy ${dec.label}`,
      transformed: `${dec.prefix}${transformText(input, 'script')}${dec.suffix}`
    }));

    // 5. Combined: Monospace + Every Decoration
    const combinedMono = DECORATIONS.map((dec, i) => ({
      id: `comb-mono-${i}`,
      label: `Mono ${dec.label}`,
      transformed: `${dec.prefix}${transformText(input, 'monospaced')}${dec.suffix}`
    }));

    // 6. Glitch / Zalgo
    const glitchLow = { id: 'glitch-low', label: 'Glitch (Low)', transformed: zalgoText(input, 'low') };
    const glitchHigh = { id: 'glitch-high', label: 'Corrupted / Evil', transformed: zalgoText(input, 'high') };

    // 7. Logic Styles
    const mirror = { 
      id: 'mirror', 
      label: 'Mirror Text', 
      transformed: input.split('').reverse().join('') 
    };
    
    const randomCase = {
      id: 'random-case',
      label: 'RaNdOm CaSe',
      transformed: input.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('')
    };

    return [
      ...base, 
      glitchLow, 
      glitchHigh, 
      mirror, 
      randomCase, 
      ...decoratedRaw, 
      ...combinedBold, 
      ...combinedScript, 
      ...combinedMono
    ];
  }, [input]);

  const filteredStyles = useMemo(() => {
    if (!searchTerm) return generatedStyles;
    const term = searchTerm.toLowerCase();
    return generatedStyles.filter(style => 
      style.label.toLowerCase().includes(term) ||
      style.transformed.toLowerCase().includes(term)
    );
  }, [generatedStyles, searchTerm]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Search & Hero Input */}
      <div className="space-y-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[40px] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white border border-slate-200 rounded-[38px] overflow-hidden shadow-inner">
             <div className="flex items-center gap-4 px-6 pt-6 text-slate-400">
               <Type size={20} className="text-indigo-500" />
               <label className="text-xs font-black uppercase tracking-[0.2em]">Enter Text to Style</label>
             </div>
             <textarea 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Type something here..."
               className="w-full min-h-[120px] p-6 pt-2 bg-transparent outline-none resize-none text-2xl font-bold text-slate-800 placeholder:text-slate-200"
             />
             <div className="flex justify-between items-center px-6 pb-4 border-t border-slate-50 bg-slate-50/50">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                 <Sparkles size={12} className="text-indigo-400" /> Massive Combination Engine Active
               </div>
               <button 
                onClick={() => setInput('')}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                title="Clear all"
               >
                 <Trash2 size={16} />
               </button>
             </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Filter by style (e.g. 'Gothic', 'Mirror', 'Fire')..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-medium text-sm transition-all shadow-sm"
             />
           </div>
           <div className="hidden md:flex items-center gap-2 px-4 py-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
             <Zap size={14} className="fill-indigo-600" /> {filteredStyles.length} Styles Generated
           </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStyles.length > 0 ? filteredStyles.map((style) => (
          <div 
            key={style.id} 
            className="group relative bg-white border border-slate-100 rounded-[32px] p-1 transition-all duration-300 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col overflow-hidden"
          >
             <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                        {style.id.includes('comb-') ? <Zap size={10} /> : <Hash size={10} />}
                        {style.label}
                      </span>
                      <button 
                        onClick={() => handleCopy(style.transformed, style.id)}
                        className={`p-2 rounded-xl transition-all ${copiedId === style.id ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white group-hover:scale-110'}`}
                      >
                        {copiedId === style.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                   </div>
                   <div className="text-xl font-medium text-slate-800 break-words leading-relaxed select-all selection:bg-indigo-100 min-h-[3rem]">
                     {style.transformed}
                   </div>
                </div>
             </div>
             <div className="absolute inset-0 bg-indigo-600/0 group-active:bg-indigo-600/5 transition-colors pointer-events-none rounded-[32px]"></div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-4 opacity-50">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-slate-300" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-700">No matching variations</h3>
                <p className="text-sm text-slate-400">Try searching for something else or enter a shorter text.</p>
             </div>
          </div>
        )}
      </div>

      {/* Stats Summary Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center gap-4 text-center justify-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Fonts</p>
            <p className="text-2xl font-black text-indigo-600">200+</p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center gap-4 text-center justify-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Decorations</p>
            <p className="text-2xl font-black text-emerald-600">40+</p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center gap-4 text-center justify-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Social Verified</p>
            <p className="text-2xl font-black text-amber-600">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyTextGenerator;
