# PostCSS Bw [![Build Status][ci-img]][ci]

[PostCSS] plugin for supporting light/dark themes in bw.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/yurybikuzin/postcss-bw.svg
[ci]:      https://travis-ci.org/yurybikuzin/postcss-bw

```css
[mol_theme] {
  --bw-light-font-weight-light: 300;
  --bw-light-font-weight-dark: 100;

  --bw-regular-font-weight-light: 400;
  --bw-regular-font-weight-dark: 300;
}
```

```css
[mol_theme] {
  --bw-light-font-weight-light: 300;
  --bw-light-font-weight-dark: 100;

  --bw-regular-font-weight-light: 400;
  --bw-regular-font-weight-dark: 300;
}
[mol_theme="$mol_theme_light"] {
  --bw-light-font-weight: var(--bw-light-font-weight-light);
  --bw-light-font-weight-inverse: var(--bw-light-font-weight-dark);
  --bw-regular-font-weight: var(--bw-regular-font-weight-light);
  --bw-regular-font-weight-inverse: var(--bw-regular-font-weight-dark);
}
[mol_theme="$mol_theme_dark"] {
  --bw-light-font-weight: var(--bw-light-font-weight-dark);
  --bw-light-font-weight-inverse: var(--bw-light-font-weight-light);
  --bw-regular-font-weight: var(--bw-regular-font-weight-dark);
  --bw-regular-font-weight-inverse: var(--bw-regular-font-weight-light);
}
```

## Usage

```js
postcss([ require('postcss-bw') ])
```

See [PostCSS] docs for examples for your environment.
