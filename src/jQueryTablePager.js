/*
	Special thanks to Gabriele Romanato.  This plugin was adapted from a demo found at http://gabrieleromanato.name/jquery-easy-table-pagination/.
	
	The MIT License (MIT)

	Copyright (c) 2014 Mathew Ritter

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
* jQueryTablePager Plugin
* Paginates an html table.
* @param recordsPerPage {number} Number of records to display per page.
* @param numberButtonsToDisplay {number} Number of page buttons to display.
* @param scrollTopOnChange {boolean} Scroll to top of table on page change.
*/
(function ($) {
	$.fn.paginateTable = function (recordsPerPage, numberButtonsToDisplay, scrollTopOnChange) {
		this.each(function () {
			var currentPage = 0;
			var $table = $(this);
			var tableId = $table.attr('id');
			if (tableId === null || tableId === '') {
				alert("Table must have an ID attribute to be paginated.");
				return;
			}

			// Bind repaginate function to table
			$table.bind('repaginate', function () {
				$table.find('tbody tr').hide().slice(currentPage * recordsPerPage, (currentPage + 1) * recordsPerPage).show();
			});
			$table.trigger('repaginate');

			var numRows = $table.find('tbody tr').length;
			var numPages = Math.ceil(numRows / recordsPerPage);
			var $pager = $('<div id="' + tableId + '-pager' + '" class="table-pager"></div>');

			// Append previous button
			var $btnPrev = $('<button type="button" id="' + tableId + '-BtnPrev" class="table-pager-navbutton">Prev</button>');
			$btnPrev.appendTo($pager).addClass('clickable');

			// Append buttons for each page 
			for (var page = 0; page < numPages; page++) {
				$('<button type="button" class="table-page-number"></button>').text(page + 1).bind('click', {
					newPage: page
				}, function (event) {
					currentPage = event.data.newPage;
					$table.trigger('repaginate');
					$(this).addClass('active').siblings().removeClass('active');
					$pager.trigger('repaginateButtonSet');
					$table.trigger('scrollTopOnChange');

				}).appendTo($pager).addClass('clickable');
			}

			// Check for pager and remove if it exists already 
			if ($pager.length > 0) {
				$($pager.attr('id')).remove();
			}

			// Only show pager when there is more than one page
			var numButtons = $pager.find('.table-page-number').length;
			if (numButtons > 1) {
				$pager.insertAfter('#' + tableId).find('button.table-page-number:first').addClass('active');
			}

			// Append next button
			var $btnNext = $('<button type="button" id="' + tableId + '-BtnNext" class="table-pager-navbutton">Next</button>');
			$btnNext.appendTo($pager).addClass('clickable');

			// Bind scrollTopOnChange function to table
			$table.bind('scrollTopOnChange', function () {
				if (scrollTopOnChange) {
					$('html, body').animate({
						scrollTop: $table.offset().top
					}, "medium");
				}
			});
			var buttonSetStartIndex = 0; // 1st button to display in button set

			// Bind repaginateButtonSet function to pager
			$pager.bind('repaginateButtonSet', function () {
				// Set the starting index for the last button set
				var lastButtonSetStartingIndex = numButtons - numberButtonsToDisplay;
				if (lastButtonSetStartingIndex < 0) {
					lastButtonSetStartingIndex = 0;
				}

				// Set the current button set start index
				if (currentPage - Math.ceil(numberButtonsToDisplay / 2) >= 0) {
					buttonSetStartIndex = currentPage - Math.ceil(numberButtonsToDisplay / 2);
					if (buttonSetStartIndex >= lastButtonSetStartingIndex) {
						buttonSetStartIndex = lastButtonSetStartingIndex;
					}
				} else {
					buttonSetStartIndex = 0;
				}

				// Show/hide button set
				$pager.find('button.table-page-number').hide().slice(buttonSetStartIndex, buttonSetStartIndex + numberButtonsToDisplay).show();

				// Check that last page is selected before hiding next button, show otherwise
				if (currentPage + 1 === numButtons) {
					$btnNext.hide();
				} else {
					$btnNext.show();
				}

				// Check that the first page is selected before hiding previous button, show otherwise
				if (currentPage === 0) {
					$btnPrev.hide();
				} else {
					$btnPrev.show();
				}
			});
			$pager.trigger('repaginateButtonSet');

			// Next page click event
			$btnNext.bind('click', function () {
				if (currentPage !== numButtons - 1) {
					currentPage++;
					$table.trigger('repaginate');
					$pager.find('.table-page-number:eq(' + currentPage + ')').addClass('active').siblings().removeClass('active');
					$pager.trigger('repaginateButtonSet');
					$table.trigger('scrollTopOnChange');
				}
			});

			// Previous page click event
			$btnPrev.bind('click', function () {
				if (currentPage !== 0) {
					currentPage--;
					$table.trigger('repaginate');
					$pager.find('.table-page-number:eq(' + currentPage + ')').addClass('active').siblings().removeClass('active');
					$pager.trigger('repaginateButtonSet');
					$table.trigger('scrollTopOnChange');
				}
			});
		});
	};
}(jQuery));