mw.loader.using( ['mediawiki.util', 'mediawiki.user', 'mediawiki.api', 'jquery.spinner'], function() {
	'use strict';

	mw.messages.set( {
		'instantNewPagePatrol-patrol': 'Mark as patrolled',
		'instantNewPagePatrol-error': 'An unexpected error occured',
		'instantNewPagePatrol-hideLinks': 'Hide patrol links',
		'instantNewPagePatrol-showLinks': 'Add patrol links to this page',

	} );

	/**
	 * Get a link to patrol a certain revision
	 *
	 * @param {number} revid
	 *
	 * @return {jQuery}
	 */
	function getPatrolLink( revid ) {
		return $( '<a id="page">' )
			.attr( 'href', '#' )
			.text( mw.msg( 'instantNewPagePatrol-patrol') )
			.data( 'revid', revid )
			.click( doPatrol );

	}
	
	var patrolportlet = mw.util.addPortletLink('p-cactions', '#', 'hi', 'patrolportletid', 'hmm', null);
	function getAltLink(revid) {
		return $(patrolportlet).click(doPatrol);
	}
		
	/**
	 * On click handler for patrol links
	 *
	 * @param {object} event
	 */
	function doPatrol( event ) {
		/*jshint validthis:true */

		var $elem = $( this ),
			apiRequest = new mw.Api(),
			$spinner, revid;

		event.preventDefault();

		// Hide the link and create a spinner to show it inside the brackets.
		$spinner = $.createSpinner( {
			size: 'small',
			type: 'inline'
		} );

		$elem.hide().after( $spinner );

		revid = $elem.data( 'revid' );

		/**
		 * Mark the entry as patrolled
		 */
		function markAsDone() {
			$elem
				.parent().parent() // <li class="not-patrolled">
				.removeClass( 'not-patrolled' );
			$elem
				.parent() // <span class="instantNewPagePatrol">
				.remove();
		}

		apiRequest.post( {
			action: 'patrol',
			token: mw.user.tokens.get( 'patrolToken' ),
			revid: revid
		} )
		.done( markAsDone )
		.fail( function( error, info ) {
			if ( error === 'notpatrollable' || error === 'nosuchrevid' ) {
				// Patrol failed with the above errors =>
				// Can't be patrolled, so mark as already patrolled
				markAsDone();
				return;
			}
			// Something failed ... restore the link
			$spinner.remove();
			$elem.show();
			mw.notify( mw.msg( 'instantNewPagePatrol-error' ) + ': ' + info.error.info + ' (' + error + ')' );
		} );
	}

	$( document ).ready( function() {
		$( 'li.not-patrolled' ).each( function( i, elem ) {
			var $elem = $( elem ),
				revid;

			revid = mw.util.getParamValue(
				'oldid',
				$elem.children( 'a' ).eq(0).attr( 'href' )
			);

			$elem.append(
				$( '<span>' )
					.attr( 'class', 'instantNewPagePatrol' )
					.append(
						'[',
						getPatrolLink( revid ),
						getAltLink(revid),
						']'
					)
			);
		} );

		$( mw.util.addPortletLink( 'p-cactions', '#', mw.msg( 'instantNewPagePatrol-hideLinks' ), 'toggleInstantNewPagePatrol' ) )
			.click( function( event ) {
				event.preventDefault();
				$( 'span.instantNewPagePatrol' ).toggle();
			} )
			.toggle(
				function() {
					$( this ).find( 'a' ).text( mw.msg( 'instantNewPagePatrol-showLinks' ) );
				},
				function() {
					$( this ).find( 'a' ).text( mw.msg( 'instantNewPagePatrol-hideLinks' ) );
				}
			);

		if ( typeof patrollinks !== 'undefined' && patrollinks.showbydefault === false ) {
			$( '#toggleInstantNewPagePatrol' ).trigger( 'click' );
		}
	} );
} );
