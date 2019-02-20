var postcss = require('postcss')

module.exports = postcss.plugin('postcss-bw', function () {
// module.exports = postcss.plugin('postcss-bw', function (opts) {
  // opts = opts || {}
  // Work with options here

  var themes = {
    'light': 'dark',
    'dark': 'light'
  }
  var themesEnum = Object.keys(themes)
  // return function (root, result) {
  return function (root) {
    root.walkRules('[mol_theme]', function (rule) {
      var themeProps = {}
      rule.walkDecls(/^--(.+)[-_](light|dark)$/, function (decl) {
        // var isLight = decl.prop.endsWith('light')
        var isLight = decl.prop.slice(-5) === 'light'
        var prop = decl.prop.slice(0, -(isLight ? 5 : 4))
        if (!themeProps[prop]) {
          themeProps[prop] = { light: null, dark: null }
        }
        var theme = isLight ? 'light' : 'dark'
        if (themeProps[prop][theme]) {
          throw decl.error('Duplicate ' + decl.prop + ' declaration')
        } else {
          themeProps[prop][theme] = decl
        }
      })
      var themePropsEnum = Object.keys(themeProps)
      if (themePropsEnum.length) {
        themePropsEnum.forEach(function (prop) {
          var themeProp = themeProps[prop]
          if (!(themeProp.light && themeProp.dark)) {
            themesEnum.forEach(function (theme) {
              var inverse = themes[theme]
              if (!themeProp[inverse]) {
                throw themeProp[theme].error(
                  'No ' + prop + inverse + ' counterpart for ' +
                  themeProp[theme].prop
                )
              }
            })
          }
        })
        var ruleLines = ['']
        themesEnum.forEach(function (theme) {
          var inverse = themes[theme]
          ruleLines.push('[mol_theme="$mol_theme_' + theme + '"] {')
          themePropsEnum.forEach(function (prop) {
            var themeProp = themeProps[prop]
            ruleLines.push(
              '  ' + prop.slice(0, -1) + ': ' +
                'var(' + themeProp[theme].prop + ');',
              '  ' + prop + 'inverse: ' +
                'var(' + themeProp[inverse].prop + ');'
            )
          })
          ruleLines.push('}')
        })
        var rulesText = ruleLines.join('\n')
        var rules = postcss.parse(rulesText)
        root.insertAfter(rule, rules.last)
        root.insertAfter(rule, rules.first)
        // console.log(rulesText)
      }
    })
  }
})
