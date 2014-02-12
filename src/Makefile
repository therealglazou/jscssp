FILES = license.js constants.js v.js helpers.js scanner.js parser/*.js tokens.js om/*.js
JS_FILE = ../cssParser.js
NODE_FILE = ../node_dist/cssParser.js

all:: $(JS_FILE) $(NODE_FILE)

clean:
	rm -f v.js
	rm -rf ../node_dist

$(JS_FILE): v.js
	cat $(FILES) > $(JS_FILE)

$(NODE_FILE): $(JS_FILE)
	mkdir -p `dirname $(NODE_FILE)`
	cp $(JS_FILE) $(NODE_FILE)
	echo "module.exports = CSSParser;" >> $(NODE_FILE)

v.js:
	wget -O vendor-prefixes.js http://peter.sh/data/vendor-prefixed-css.php?js=1
	sed -e "s/{/\&{/g" vendor-prefixes.js | tr '&' '\012'  > v.js
	rm -f vendor-prefixes.js
