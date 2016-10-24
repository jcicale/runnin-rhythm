//Open and close the About callout
$('#callout-link').on('click', function(){
	$('#about-callout').css('display', 'block');
});

$('#close-callout').on('click', function(){
	$('#about-callout').css('display', 'none');
});

$('.clear-all').on('click', function(){
	$('input:checkbox[name=cbox1]').attr('checked', false);
	$('input:checkbox[name=cbox2]').attr('checked', false);
	$('input:checkbox[name=cbox3]').attr('checked', false);
	$('input:checkbox[name=cbox4]').attr('checked', false);
	$('input:checkbox[name=cbox5]').attr('checked', false);
})

function updateLengthFilter(val) {
    document.getElementById('slider-value').value=val; 
}

function updateSlider(val) {
    document.getElementById('slider').value=val; 
}
