const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const _ = require('lodash')

const {
  strToUtf32Strs
} = require('unicodex')

const writeFile = promisify(fs.writeFile)

function packData (gemoji) {
  let emojis = []
  let emojiUnicode = {}
  let emojiCategory = {}
  let emojiAliases = {}
  let emojiTags = {}

  let unicodes = []
  let unicodeEmoji = {}
  let unicodeCategory = {}
  let unicodeAliases = {}
  let unicodeTags = {}

  let categories = []
  let categoryEmojis = {}
  let categoryUnicodes = {}
  let categoryAliases = {}
  let categoryTags = {}

  let aliases = []
  let aliasEmoji = {}
  let aliasUnicode = {}
  let aliasCategory = {}
  let aliasTags = {}

  let tags = []
  let tagEmojis = {}
  let tagUnicodes = {}
  let tagCategories = {}
  let tagAliases = {}

  for (let i = 0; i < gemoji.length; i++) {
    const o = gemoji[i]

    let unicode
    if (o.hasOwnProperty('emoji')) {
      emojis.push(o.emoji)
      unicode = strToUtf32Strs(o.emoji).join('-')
        .replace('-fe0f', '')
        .replace('-200d', '')
      if (unicode) {
        emojiUnicode[o.emoji] = unicode
      }
      if (o.hasOwnProperty('category')) {
        emojiCategory[o.emoji] = o.category
      }
      if (o.hasOwnProperty('aliases')) {
        if (!emojiAliases[o.emoji]) {
          emojiAliases[o.emoji] = []
        }
        emojiAliases[o.emoji].push(...o.aliases)
      }
      if (o.hasOwnProperty('tags')) {
        if (!emojiTags[o.emoji]) {
          emojiTags[o.emoji] = []
        }
        emojiTags[o.emoji].push(...o.tags)
      }
    }

    // handle unicode
    if (unicode) {
      unicodes.push(unicode)
      unicodeEmoji[unicode] = o.emoji
      if (o.hasOwnProperty('category')) {
        unicodeCategory[unicode] = o.category
      }
      if (o.hasOwnProperty('aliases')) {
        if (!unicodeAliases[unicode]) {
          unicodeAliases[unicode] = []
        }
        unicodeAliases[unicode].push(...o.aliases)
      }
      if (o.hasOwnProperty('tags')) {
        if (!unicodeTags[unicode]) {
          unicodeTags[unicode] = []
        }
        unicodeTags[unicode].push(...o.tags)
      }
    }

    // handle category
    if (o.hasOwnProperty('category')) {
      categories.push(o.category)
      if (o.hasOwnProperty('emoji')) {
        if (!categoryEmojis[o.category]) {
          categoryEmojis[o.category] = []
        }
        categoryEmojis[o.category].push(o.emoji)
      }
      if (unicode) {
        if (!categoryUnicodes[o.category]) {
          categoryUnicodes[o.category] = []
        }
        categoryUnicodes[o.category].push(unicode)
      }
      if (o.hasOwnProperty('aliases')) {
        if (!categoryAliases[o.category]) {
          categoryAliases[o.category] = []
        }
        categoryAliases[o.category].push(...o.aliases)
      }
      if (o.hasOwnProperty('tags')) {
        if (!categoryTags[o.category]) {
          categoryTags[o.category] = []
        }
        categoryTags[o.category].push(...o.tags)
      }
    }

    // handle aliases
    if (o.hasOwnProperty('aliases')) {
      aliases.push(...o.aliases)
      for (const alias of o.aliases) {
        if (o.hasOwnProperty('emoji')) {
          aliasEmoji[alias] = o.emoji
        }
        if (unicode) {
          aliasUnicode[alias] = unicode
        }
        if (o.hasOwnProperty('category')) {
          aliasCategory[alias] = o.category
        }
        if (o.hasOwnProperty('tags')) {
          if (!aliasTags[alias]) {
            aliasTags[alias] = []
          }
          aliasTags[alias].push(...o.tags)
        }
      }
    }

    // handle tags
    if (o.hasOwnProperty('tags')) {
      tags.push(...o.tags)
      for (const tag of tags) {
        if (o.hasOwnProperty('emoji')) {
          if (!tagEmojis[tag]) {
            tagEmojis[tag] = []
          }
          tagEmojis[tag].push(o.emoji)
        }
        if (unicode) {
          if (!tagUnicodes[tag]) {
            tagUnicodes[tag] = []
          }
          tagUnicodes[tag].push(unicode)
        }
        if (o.hasOwnProperty('category')) {
          if (!tagCategories[tag]) {
            tagCategories[tag] = []
          }
          tagCategories[tag].push(o.category)
        }
        if (o.hasOwnProperty('aliases')) {
          if (!tagAliases[tag]) {
            tagAliases[tag] = []
          }
          tagAliases[tag].push(...o.aliases)
        }
      }
    }
  }

  // uniq values
  categories = _.uniq(categories)
  for (const category in categoryTags) {
    categoryTags[category] = _.uniq(categoryTags[category])
  }
  for (const alias in aliasTags) {
    aliasTags[alias] = _.uniq(aliasTags[alias])
  }
  tags = _.uniq(tags)
  for (const tag in tagCategories) {
    tagCategories[tag] = _.uniq(tagCategories[tag])
  }

  return {
    emojis,
    emojiUnicode,
    emojiCategory,
    emojiAliases,
    emojiTags,
    unicodes,
    unicodeEmoji,
    unicodeCategory,
    unicodeAliases,
    unicodeTags,
    categories,
    categoryEmojis,
    categoryUnicodes,
    categoryAliases,
    categoryTags,
    aliases,
    aliasEmoji,
    aliasUnicode,
    aliasCategory,
    aliasTags,
    tags,
    tagEmojis,
    tagUnicodes,
    tagCategories,
    tagAliases
  }
}

async function main (stdin) {
  const gemoji = JSON.parse(stdin)
  const packed = packData(gemoji)
  const banner = `// DO NOT modify this file. Auto generated by ${path.basename(__filename)}`

  function makePath (name, ext = '.json', dir = 'json') {
    return path.join(__dirname, '..', dir, `${name}${ext}`)
  }

  let jobs = [
    writeFile(makePath('gemoji'), JSON.stringify(gemoji)),
    writeFile(makePath('gemoji', '.js', 'src'), `${banner}
module.exports = require('../json/gemoji.json')
`)
  ]

  let indexContent = ''
  for (const rawK in packed) {
    const filename = _.kebabCase(rawK)
    jobs.push(
      writeFile(makePath(filename), JSON.stringify(packed[rawK])),
      writeFile(makePath(filename, '.js', 'src'), `${banner}
module.exports = require('../json/${filename}.json')
`))
    indexContent += `exports.${rawK} = require('./${filename}.js')\n`
  }

  jobs.push(writeFile(makePath('index'), `${banner}
${indexContent}`))

  await Promise.all(jobs)
}

const stdin = fs.readFileSync('/dev/stdin', 'utf-8')
main(stdin)
