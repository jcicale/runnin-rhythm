//Open and close the About callout
$('#callout-link').on('click', function(){
	$('#about-callout').css('display', 'block');
});

$('#close-callout').on('click', function(){
	$('#about-callout').css('display', 'none');
});
