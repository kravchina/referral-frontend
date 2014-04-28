/*----------
 TOOLTIP
----------*/
$( function() {
	$('.btn-toggle').tooltip({
		container: 'body'
	});
});

/*----------
 NOTES
----------*/
$( function() {
	$('.note-block').on('click', function(e) {
		$(this).toggleClass('expand');
	});
});

/*----------
 MODALS
----------*/
$( function() {
	// Show 'Create New Patient' modal
	$('.btn-toggle-modal-patient').on('click', function(e) {
		$('#modalPatient').modal('show');
	});
	// Show 'Invite New Provider' modal
	$('.btn-toggle-modal-provider').on('click', function(e) {
		$('#modalProvider').modal('show');
	});
	// Show 'Add New Note' modal
	$('.btn-toggle-modal-note').on('click', function(e) {
		$('#modalNote').modal('show');
	});
});