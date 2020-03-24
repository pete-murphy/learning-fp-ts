```bash
for f in {1,2,3,4}/*.md
do
  pandoc $f -t html | sed 's=\\=\\\\=g' | sed "1s;^;export default ';" | tr -d '\n' | sed "s/$/ '/" > $(dirname $f)/$(basename $f .md).js
done
```

That will convert the Markdown files to JS files that exports an HTML string.
