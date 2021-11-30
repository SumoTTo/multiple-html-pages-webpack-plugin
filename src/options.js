// eslint-disable-next-line jsdoc/valid-types
/**
 * @typedef {import('schema-utils').ValidationError} ValidationError
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @typedef {import('html-webpack-plugin')} HtmlWebpackPlugin
 */

const { validate } = require( 'schema-utils' );

class MultipleHtmlPagesWebpackPluginOptions {
	pathsInfo = [];
	htmlWebpackPluginOptions = {};

	/**
	 * @type {HtmlWebpackPlugin}
	 */
	HtmlWebpackPlugin;
	pathCheck = () => true;

	#scheme = {
		type: 'object',
		properties: {
			pathsInfo: {
				description: 'Information about the paths to the template files that will be generated in the pages.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						root: {
							description: 'Absolute path to the folder from which relative file names will be computed.',
							type: 'string',
						},
						glob: {
							description: 'A glob template that will search for template files relative to root.',
							type: 'string',
						},
					},
					additionalProperties: false,
				},
				additionalItems: false,
			},
			htmlWebpackPluginOptions: {
				description: 'Set any options for HTML Webpack Plugin, they will be applied to all pages.',
				type: 'object',
			},
			HtmlWebpackPlugin: {
				description: 'Pass the HTML Webpack Plugin instance.',
			},
			pathCheck: {
				description:
					'The function which checks if the path found needs to be generated. It takes the file path as input,' +
					'and should return true if the path is to be generated, false if it is not.',
				instanceof: 'Function',
			},
		},
		additionalProperties: false,
	};

	/**
	 * Performs validation and results in the desired format.
	 *
	 * @throws {ValidationError} Will throw an error if options do not check the schema.
	 *
	 * @param {Object} pluginOptions - An array of options, will be checked against the scheme.
	 * @param {string} pluginName    - Plugin name, will be displayed in error.
	 */
	constructor( pluginOptions, pluginName ) {
		validate( this.#scheme, pluginOptions, { name: pluginName } );
		this.#setOptions( pluginOptions );
	}

	/**
	 * Sets options.
	 *
	 * @param {Object} pluginOptions - An object of plugin options.
	 */
	#setOptions( pluginOptions ) {
		for ( const optionKey in pluginOptions ) {
			this[ optionKey ] = pluginOptions[ optionKey ];
		}
	}
}

module.exports = MultipleHtmlPagesWebpackPluginOptions;
