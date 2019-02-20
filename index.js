var postcss = require('postcss')

module.exports = postcss.plugin('postcss-bw', function (opts) {
  opts = opts || {}

  // Work with options here

  const themes = {
    'light': 'dark',
    'dark': 'light',
  }
  const themesEnum = Object.keys(themes)
  return function (root, result) {
    root.walkRules('[mol_theme]', function(rule) {
      const themeProps = {}
      rule.walkDecls(/^--(.+)[-_](light|dark)$/, function(decl) {
        const isLight = decl.prop.endsWith('light')
        const prop = decl.prop.slice(0, -(isLight ? 5 : 4))
        if (!themeProps[prop]) {
          themeProps[prop] = { light: null, dark: null }
        }
        const theme = isLight ? 'light' : 'dark'
        if (themeProps[prop][theme]) {
          throw decl.error('Duplicate ' + decl.prop + ' declaration')
        } else {
          themeProps[prop][theme] = decl
        }
      })
      const themePropsEnum = Object.keys(themeProps);
      if (themePropsEnum.length) {
        themePropsEnum.forEach(prop => {
          const themeProp = themeProps[prop]
          if (!(themeProp.light && themeProp.dark)) {
            themesEnum.forEach(theme => {
              const inverse = themes[theme]
              if (!themeProp[inverse])  {
                throw themeProp[theme].error('No ' + prop + inverse + ' counterpart for ' + themeProp[theme].prop)
              }
            })
          }
        })
        let ruleLines = []
        themesEnum.forEach(theme => {
          const inverse = themes[theme]
          ruleLines.push('[mol_theme="$mol_theme_' + theme +'"] {')
          themePropsEnum.forEach(prop => {
            const themeProp = themeProps[prop]
            ruleLines.push('  ' + prop.slice(0, -1) + ': ' + themeProp[theme].prop + ';')
            ruleLines.push('  ' + prop + 'inverse: ' + themeProp[inverse].prop + ';')
          })
          ruleLines.push('}')
        })
        const rulesText = ruleLines.join("\n")
        const rules = postcss.parse(rulesText)
        root.insertAfter(rule, rules.last)
        root.insertAfter(rule, rules.first)
        // console.log(rulesText)
      }
    })
  }
})
