<?php
/**
 * DarkVector - Modern version of MonoBook with fresh look and many usability
 * improvements.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @file
 * @ingroup Skins
 */

/**
 * SkinTemplate class for DarkVector skin
 * @ingroup Skins
 */
class SkinDarkVector extends SkinTemplate {
	public $skinname = 'darkvector';
	public $stylename = 'DarkVector';
	public $template = 'DarkVectorTemplate';
	/**
	 * @var Config
	 */
	private $darkvectorConfig;

	public function __construct() {
		$this->darkvectorConfig = ConfigFactory::getDefaultInstance()->makeConfig( 'darkvector' );
	}

	/**
	 * Initializes output page and sets up skin-specific parameters
	 * @param OutputPage $out Object to initialize
	 */
	public function initPage( OutputPage $out ) {
		parent::initPage( $out );
		global $wgLang,$wgSitename,$wgLanguageCode,$wgCategoryTreeSidebarRoot;

		if ( $this->darkvectorConfig->get( 'DarkVectorResponsive' ) ) {
			$out->addMeta( 'viewport', 'width=device-width, initial-scale=1' );
			$out->addModuleStyles( 'skins.darkvector.styles.responsive' );
		}

		// Append CSS which includes IE only behavior fixes for hover support -
		// this is better than including this in a CSS file since it doesn't
		// wait for the CSS file to load before fetching the HTC file.
		$min = $this->getRequest()->getFuzzyBool( 'debug' ) ? '' : '.min';
		$out->addHeadItem( 'csshover',
			'<!--[if lt IE 7]><style type="text/css">body{behavior:url("' .
				htmlspecialchars( $this->getConfig()->get( 'LocalStylePath' ) ) .
				"/{$this->stylename}/csshover{$min}.htc\")}</style><![endif]-->"
		);

		$out->addModules( array( 'skins.darkvector.js' ) );
	}

	/**
	 * Loads skin and user CSS files.
	 * @return array Array of modules with helper keys for easy overriding
	 */
	public function getDefaultModules() {
		$modules = parent::getDefaultModules();

		$styles = array( 'mediawiki.skinning.interface', 'skins.darkvector.styles' );
		Hooks::run( 'SkinDarkVectorStyleModules', array( $this, &$styles ) );
		$modules['styles']['skin'] = $styles;
		return $modules;
	}

	/**
	 * Override to pass our Config instance to it
	 */
	public function setupTemplate( $classname, $repository = false, $cache_dir = false ) {
		return new $classname( $this->darkvectorConfig );
	}
}
