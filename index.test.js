var postcss = require('postcss')

var plugin = require('./')

function run (input, output, opts) {
  return postcss([plugin(opts)]).process(input).then(function (result) {
    expect(result.css).toEqual(output)
    expect(result.warnings()).toHaveLength(0)
  })
}

var input = [
  '[mol_theme] {',
  '  --bw-light-font-weight-light: 300;',
  '  --bw-light-font-weight-dark: 100;',
  '',
  '  --bw-regular-font-weight-light: 400;',
  '  --bw-regular-font-weight-dark: 300;',
  '}'
]
var output = input.concat([
  '[mol_theme="$mol_theme_light"] {',
  '  --bw-light-font-weight: var(--bw-light-font-weight-light);',
  '  --bw-light-font-weight-inverse: var(--bw-light-font-weight-dark);',
  '  --bw-regular-font-weight: var(--bw-regular-font-weight-light);',
  '  --bw-regular-font-weight-inverse: var(--bw-regular-font-weight-dark);',
  '}',
  '[mol_theme="$mol_theme_dark"] {',
  '  --bw-light-font-weight: var(--bw-light-font-weight-dark);',
  '  --bw-light-font-weight-inverse: var(--bw-light-font-weight-light);',
  '  --bw-regular-font-weight: var(--bw-regular-font-weight-dark);',
  '  --bw-regular-font-weight-inverse: var(--bw-regular-font-weight-light);',
  '}'
])
it(
  'adds [mol_theme="$mol_theme_THEME"] rules for [mol_theme]',
  function () {
    return run(input.join('\n'), output.join('\n'), { })
  }
)
