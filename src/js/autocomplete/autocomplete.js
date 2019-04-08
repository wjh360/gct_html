/**
A jQuery plugin for search hints

Author: Lorenzo Cioni - https://github.com/lorecioni
*/

(function($) {
	$.fn.autocomplete = function(params) {
		
		//Selections
		var currentSelection = -1;
		var currentProposals = [];
		
		//Default parameters
		params = $.extend({
			hints: [],

			placeholder: '供应商名称',
			width: 180,
			height: 16,
			showButton: true,
			buttonText: 'Search',
			onSubmit: function(text){

			},
			onBlur: function(){

			}
		}, params);

		//Build messagess
		this.each(function() {
			//Container
			var searchContainer = $('<div></div>')
				.addClass('autocomplete-container')
				// .css('height', params.height * 2);
				.css('height', params.height);

			//Text input		
			var input = $('<input type="text" autocomplete="off" name="query">')
				.attr('placeholder', params.placeholder)
				.addClass('autocomplete-input')
				.css({
					'width' : params.width,
					'height' : params.height
				});
			
			if(params.showButton){
				input.css('border-radius', '4px');
			}

			//Proposals
			var proposals = $('<div></div>')
				.addClass('proposal-box')
				// .css('width', params.width)
				.css('width', params.width )
				// .css('top', input.height() + 20)
				.css('top', input.height()+5);
			var proposalList = $('<ul></ul>')
				.addClass('proposal-list');

			proposals.append(proposalList);
			
			input.keydown(function(e) {
				switch(e.which) {
					case 38: // Up arrow
					e.preventDefault();
					$('ul.proposal-list li').removeClass('selectedXia');
					if((currentSelection - 1) >= 0){
						currentSelection--;
						$( "ul.proposal-list li:eq(" + currentSelection + ")" )
							.addClass('selectedXia');
					} else {
						currentSelection = -1;
					}
					break;
					case 40: // Down arrow
					e.preventDefault();
					if((currentSelection + 1) < currentProposals.length){
						$('ul.proposal-list li').removeClass('selectedXia');
						currentSelection++;
						$( "ul.proposal-list li:eq(" + currentSelection + ")" )
							.addClass('selectedXia');
					}
					break;
					case 13: // Enter
						if(currentSelection > -1){
							var text = $( "ul.proposal-list li:eq(" + currentSelection + ")" ).html();
							input.val(text);

						}
						currentSelection = -1;
						proposalList.empty();
						params.onSubmit(input.val());
						break;
					case 27: // Esc button
						currentSelection = -1;
						proposalList.empty();
						input.val('');
						break;
				}
			});
				
			input.bind("keyup", function(e){
				if(e.which != 13 && e.which != 27
						&& e.which != 38 && e.which != 40){				
					currentProposals = [];
					currentSelection = -1;
					proposalList.empty();
					// if(input.val() != ''){
						// var word = "^" + input.val() + ".*";
						var word = input.val();
						proposalList.empty();
						//数组对象遍历,test是索引hints[test]是该对象

						for(var test in params.hints){

							if(params.hints[test][vel].match(word)){

								currentProposals.push(params.hints[test][vel]);
								var element = $('<li></li>')
									.html(params.hints[test][vel])
									.addClass('proposal')
									.attr('title',params.hints[test][vel])
									.attr('index',params.hints[test].id)
									.click(function(){

										input.val($(this).html());
										proposalList.empty();
										params.onSubmit(input.val(),$(this).attr("index"));
									})
									.mouseenter(function() {
										$(this).addClass('selectedXia');
									})
									.mouseleave(function() {
										$(this).removeClass('selectedXia');
									});
								proposalList.append(element);
							}
						}
					}
				// }
			});
			
			input.blur(function(e){
				currentSelection = -1;
				// proposalList.empty();
				// params.onBlur();

				// params.onSubmit(input.val());


			});
            searchContainer.append(input);
            searchContainer.append(proposals);
            $(this).append(searchContainer);


			// if(params.showButton){
			// 	//Search button
			// 	var button = $('<div></div>')
			// 		.addClass('autocomplete-button')
			// 		.html(params.buttonText)
			// 		.css({
			// 			'height': params.height + 2,
			// 			'line-height': params.height + 2 + 'px'
			// 		})
			// 		.click(function(){
			// 			proposalList.empty();
			// 			params.onSubmit(input.val());
			// 		});
			// 	searchContainer.append(button);
			// }
	

			
			// if(params.showButton){
			// 	//Width fix
			// 	searchContainer.css('width', params.width + button.width() + 50);
			// }
		});

		return this;
	};

})(jQuery);