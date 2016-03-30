/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'dlicons\'">' + entity + '</span>' + html;
	}
	var icons = {
		'dlicons-user-add': '&#xe600;',
		'dlicons-plus': '&#xe601;',
		'dlicons-file-pdf': '&#xe602;',
		'dlicons-file-word': '&#xe603;',
		'dlicons-file-excel': '&#xe604;',
		'dlicons-file-zip': '&#xe605;',
		'dlicons-office': '&#xe606;',
		'dlicons-remove': '&#xe607;',
		'dlicons-search': '&#xe608;',
		'dlicons-user': '&#xf007;',
		'dlicons-check': '&#xf00c;',
		'dlicons-pencil': '&#xf040;',
		'dlicons-group': '&#xf0c0;',
		'dlicons-download': '&#xe900;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/dlicons-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
