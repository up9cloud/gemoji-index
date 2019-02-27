# gemoji-index

A database with indices for Github [gemoji](https://github.com/github/gemoji/blob/master/db/emoji.json)

## Usage

```html
<script src="https://unpkg.com/gemoji-index/dist/aliases.js"></script>
<script>
  var rand = Math.floor(Math.random() * gemoji.aliases.length) + 1
  console.log(':' + gemoji.aliases[rand] + ':')
</script>
```

```html
<script src="https://unpkg.com/jquery/dist/jquery.min.js"></script>
<script>
  $.getJSON('https://unpkg.com/gemoji-index/json/aliases.json', function (gemoji) {
    var rand = Math.floor(Math.random() * gemoji.aliases.length) + 1
    console.log(':' + gemoji.aliases[rand] + ':')
  })
</script>
```

## Indices

See https://unpkg.com/gemoji-index/

## License

`Source code`: MIT

`gemoji`: See https://github.com/github/gemoji/blob/master/LICENSE
