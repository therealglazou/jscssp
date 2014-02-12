FILES = license.js constants.js v.js helpers.js scanner.js parser/*.js tokens.js om/*.js

all::
	rm -f vendor-prefixes.js v.js
	wget -O vendor-prefixes.js http://peter.sh/data/vendor-prefixed-css.php?js=1
	sed -e "s/{/\&{/g" vendor-prefixes.js | tr '&' '\012'  > v.js
	cat $(FILES) > cssParser.js

