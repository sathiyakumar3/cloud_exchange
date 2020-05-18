/******************/

var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch2'));
$('.js-switch-23').each(function ()
{
	new Switchery($(this)[0], $(this).data());
});

/*****************/
