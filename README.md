# Hópverkefni 2

Þetta er hópverkefni 2 í vefforritun. Við erum Kristófer (kra33@hi.is), Sóley (sob33@hi.is) og Þórður (thk89@hi.is)

## Að keyra verkefnið

Til að keyra verkefnið skal keyra

```bash
npm install   
npm run dist
```

Til að vinna í verkefninu þarf að keyra

```bash
npm install   
npm run dev
```

---

## Hvernig verkefnið er skipulagt

Kóðastíllinn er unninn samkvæmt [Styleline Primer](https://www.npmjs.com/package/stylelint-config-primer) kóðastílnum fyrir CSS en samkvæmt [AirBnB](https://www.npmjs.com/package/eslint-config-airbnb) kóðastílnum fyrir JavaScript.

Verkefninu er aðallega skipt í `src` og `dist`, en Rollup sér um að pakka kóðanum í `src` yfir í `dist`, en þá með browser prefixum til að styðja sem flesta vafra.

Allar myndir eru geymdar undir `/img`, síða geymd undir rót, en skriptur eru geymdar undir `/src` og þar under er að finna _Sass_ skrár og hjálparföll fyrir JavaScript í sér möppu, hvort fyrir sig.


