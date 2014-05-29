/*----------
 TOOLTIP
----------*/
/*$( function() {
	$('.btn-toggle').tooltip({
		container: 'body'
	});
});*/

/*----------
 jQuery Placeholder
----------*/
/*$(function() {
	$('input,textarea').placeholder();
});*/

/*----------
 Date Range Picker
----------*/
/*$( function() {
	
	$('#reportrange').daterangepicker(
		{
		  startDate: moment().subtract('days', 29),
		  endDate: moment(),
		  ranges: {
			 'Last 7 Days': [moment().subtract('days', 6), moment()],
			 'Last 30 Days': [moment().subtract('days', 29), moment()],
			 'All': [moment().startOf('days'), moment().endOf('days')] // not sure what formula to use
		  }
		},
		function(start, end) {
			$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		}
	);
	
	$('#reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

});*/

/*----------
 Tab Collapse
----------*/
//$('#adminTabs').tabCollapse();

/*----------
 Edit / Save Section
----------*/

/*$( function() {
	
	$formTab = $('#formAccountTab, #formPracticeTab'),
	$editBtn = $('#formAccountTab .btn-edit, #formPracticeTab .btn-edit'),
	$saveBtn = $('#formAccountTab .btn-save, #formPracticeTab .btn-save'),
	$formControls = $formTab.find('input.form-control,select.form-control');
	
	// edit
	$formTab.on('click', '.btn-edit', function(e) {
		$editBtn.addClass('hide');
		$saveBtn.removeClass('hide');
		$formControls.removeClass('data1');
		$formControls.removeAttr('disabled');
	});
	
	// save	
	$formTab.on('click', '.btn-save', function(e) {
		$editBtn.removeClass('hide');
		$saveBtn.addClass('hide');
		$formControls.addClass('data1');
		$formControls.attr('disabled', 'disabled');
	});
	
});*/

/*----------
 Remove Button
----------*/
/*$( function() {
	$('.section-block .table').on('click', '.btn-delete', function(e) {
		$(this).toggleClass('active');
	});
});*/