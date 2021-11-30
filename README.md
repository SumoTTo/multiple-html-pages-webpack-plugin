# HTML Href to Relative Webpack Plugin

This is [Webpack](https://github.com/webpack/webpack#readme) plugin, for generate multiple HTML pages
using [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin#readme)

## Installation

You can install the package as follows:

```sh
npm install @sumotto/multiple-html-pages-webpack-plugin --save-dev

# or

yarn add @sumotto/multiple-html-pages-webpack-plugin --dev
```

## Usage

Require the plugin and HTML Webpack Plugin in your Webpack config:

```js
const MultipleHtmlPagesPlugin = require( '@sumotto/multiple-html-pages-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

// or

import MultipleHtmlPagesPlugin from '@sumotto/multiple-html-pages-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
```

Add the plugin to your webpack configuration's `plugins` array.

```js
module.exports = {
	plugins: [
		new MultipleHtmlPagesPlugin(
			{
				// Information about the paths to the template files that will be generated in the pages.
				pathsInfo: [
					{
						// Absolute path to the folder from which relative file names will be computed.
						root: path.resolve( __dirname, 'src/templates/pages' ),
						// A glob template that will search for template files relative to root.
						glob: '**/*.hbs'
					},
					{
						root: path.resolve( __dirname, 'src/templates/pages' ),
						glob: '**/*.html'
					}
				],
				// Set any options for HTML Webpack Plugin, they will be applied to all pages.
				htmlWebpackPluginOptions: { minify: false },
				// Pass the HTML Webpack Plugin instance.
				HtmlWebpackPlugin,
				// The function which checks if the path found needs to be generated. Optional.
				pathCheck( path ) {
					return path.test( /test/ );
				}
			},
		)
	],
}
```

## License

MIT License
