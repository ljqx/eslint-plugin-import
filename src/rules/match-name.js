import resolve from 'eslint-module-utils/resolve'
import kebabCase from 'lodash.kebabcase'

function nameMatchesKebabCase(codeName, matchName) {
  return kebabCase(codeName) === kebabCase(matchName);
}

function equalOrIn(item, itemOrArray) {
  return item === itemOrArray || itemOrArray.contains(item)
}

const enumValues = {
  type: 'string',
  enum: ['import', 'export'],
}

module.exports = {
  meta: {
    docs: {},
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          matchWhen: {
            description: '`export`, `import` or both',
            anyOf: [
              enumValues,
              {
                type: 'array',
                items: enumValues,
                uniqueItems: true,
              },
            ],
            default: ['export', 'import'],
          },
          matchWhat: {
            description: '`export default` name should match name of basefile if `basefile`,'
              + ' should match full path if `path`',
            type: 'string',
            enum: ['basefile', 'path'],
            default: 'basefile',
          },
          matchCase: {
            description: 'between `export default` name and `basefile`/`path` name, '
              + '`exact` for exact match, `kebab` for match kebab case `basefile`/`path` name',
            type: 'string',
            enum: ['exact', 'kebab'],
            default: 'exact',
          },
          indexAsEntry: {
            description: '`true` for using base folder name as matching name used',
            type: 'boolean',
            default: true,
          },
          exclude: {
            description: 'mapping from module specifier to name which will be excluded',
            type: 'object',
            patternProperties: {
              '.*': {
                type: 'string',
              },
            },
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: function (context) {
    const {
      matchWhen = ['export', 'import'],
      matchWhat = 'basefile',
      matchCase = 'exact',
      indexAsEntry = true,
      exclude = {},
    } = context.options[0] || {}

    const ret = {};

    if (matchWhen === '')
    return {
      ExportDefaultDeclaration(n) {}
      'ImportDeclaration': function (n) {
        // resolved path will cover aliased duplicates
        const resolvedPath = resolve(n.source.value, context) || n.source.value
        const importMap = n.importKind === 'type' ? typesImported : imported

        if (importMap.has(resolvedPath)) {
          importMap.get(resolvedPath).add(n.source)
        } else {
          importMap.set(resolvedPath, new Set([n.source]))
        }
      },

      'Program:exit': function () {
        checkImports(imported, context)
        checkImports(typesImported, context)
      },
    }
  },
}
