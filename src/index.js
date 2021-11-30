const { resolve, extname, relative, parse } = require( 'path' );
const { sync } = require( 'glob' );
const MultipleHtmlPagesWebpackPluginOptions = require( './options' );

class MultipleHtmlPagesWebpackPlugin {
	name = 'SumoTTo Multiple Html Pages Webpack Plugin';

	/**
	 * @type {MultipleHtmlPagesWebpackPluginOptions}
	 */
	#options;

	constructor( pluginOptions = [] ) {
		this.#options = new MultipleHtmlPagesWebpackPluginOptions( pluginOptions, this.name );
	}

	apply( compiler ) {
		this.pagesHtmlFiles = [];
		this.mapFolders = {};
		this.mapFiles = [];

		const plugins = [];
		this.#options.pathsInfo.forEach( ( pathInfo ) => {
			const glob = resolve( pathInfo.root, pathInfo.glob );
			sync( glob ).forEach( ( templatePath ) => {
				if ( this.#options.pathCheck( templatePath ) ) {
					const plugin = this.#createPage( pathInfo.root, templatePath );
					if ( plugin ) {
						plugins.push( plugin );
					}
				}
			} );
		} );

		plugins.push( this.#createMap() );
		plugins.forEach( ( plugin ) => {
			plugin.apply( compiler );
		} );
	}

	#createPage( root, template ) {
		const ext = extname( template );
		const filename = relative( root, template )
			.replace( new RegExp( ext + '$' ), '.html' )
			.replace( /\\/g, '/' );

		if ( ! this.pagesHtmlFiles.includes( filename ) ) {
			const htmlWebpackPluginOptions = Object.assign(
				{},
				this.#options.htmlWebpackPluginOptions,
				{
					filename,
					template,
				}
			);

			this.pagesHtmlFiles.push( filename );

			const { dir, base } = parse( filename );
			if ( dir ) {
				if ( ! this.mapFolders.hasOwnProperty( dir ) ) {
					this.mapFolders[ dir ] = [];
				}

				this.mapFolders[ dir ].push( base );
			} else {
				this.mapFiles.push( base );
			}

			// noinspection JSValidateTypes
			return new this.#options.HtmlWebpackPlugin( htmlWebpackPluginOptions );
		}
	}

	#createMap() {
		let map = '';
		if ( this.mapFolders ) {
			for ( const mapFolder in this.mapFolders ) {
				map += '<details><summary>' + mapFolder + '</summary><ul>';
				this.mapFolders[ mapFolder ].forEach( function( file ) {
					map += '<li><a href="/' + mapFolder + '/' + file + '">' + file + '</a></li>';
				} );
				map += '</ul></details>';
			}
		}
		if ( this.mapFiles ) {
			map += '<ul>';
			this.mapFiles.forEach( function( file ) {
				map += '<li><a href="/' + file + '">' + file + '</a></li>';
			} );
			map += '</ul>';
		}

		// noinspection JSUnusedGlobalSymbols,JSValidateTypes
		return new this.#options.HtmlWebpackPlugin( {
			inject: false,
			filename: 'index.html',
			templateContent: () => `
				<html lang="en-US">
				<head><title>Index</title></head>
				<body><h1>Index</h1>${ map }</body>
				</html>
			`,
		} );
	}
}

module.exports = MultipleHtmlPagesWebpackPlugin;
