var sparklineLogin = function() {
  if( $('#sparkline_5').length > 0 ){
			$("#sparkline_5").sparkline([3,4,8,6,9,5,10], {
				type: 'bar',
				width: '100%',
				height: '45',
				barWidth: '10',
				resize: true,
				barSpacing: '10',
				barColor: '#667add',
				highlightSpotColor: '#667add'
			});
		}	
}
