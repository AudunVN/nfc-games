function modalClickHandler(clickEvent, clickedObject) {
	clickEvent.preventDefault();
	var pid = $(clickedObject).data('modal');
	$.get('/modals/' + pid + '.txt', function(data){
		var headerRegex = /(?:<header>)(.|[\r\n])*(?:<\/header>)/g;
		var contentRegex = /(?:<content>)(.|[\r\n])*(?:<\/content>)/g;
		var headerContent = headerRegex.exec(data)[0];
		var bodyContent = contentRegex.exec(data)[0];
		document.querySelector("#txtModal").style.marginTop = document.querySelector(".navbar-header").offsetHeight+"px";
		$('#txtModal .modal-title').html(headerContent);
		$('#txtModal .modal-body').html(bodyContent);
		$('#txtModal').modal('show');
		$('#txtModal .toggleModal').click(function(ev){modalClickHandler(ev, this);});
		document.querySelector('#txtModal').focus();
		$("#txtModal .modal-content").click();
	});
}

$(".ui-dialog").on("open", function () { $(this).dialog("option", "maxWidth", $(window).width()); });

function resizeHandler() {
	$(".cost-container").css("width", $(".sidebar-container").width()+"px");
	if ($("#regform_wrap").width() < 600) {
		$("#regform_wrap").addClass("wrapped");
		$("#regform_wrap .cost-container").addClass("closed");
	} else {
		$("#regform_wrap").removeClass("wrapped");
		$("#regform_wrap .cost-container").removeClass("closed");
    }
    $(".ui-dialog-content:visible").each(function () {
        $(this).dialog("option", "position", $(this).dialog("option", "position"));
        $(this).dialog("option", "maxWidth", $(window).width());
    });
}

$(document).on("ajaxStop", function (e) {
    $(".ui-dialog-content:visible").dialog("option", "position", $(".ui-dialog-content:visible").dialog("option", "position"));
});

$(document).ready(function() {
	$('#txtModal').modal('hide');
	$('.toggleModal').click(function(ev){modalClickHandler(ev, this);});
	
	$("#navbar.in a").not(".dropdown-toggle").click(function() { 
		$('.navbar-toggle').click();
	});
	
	$(".checkbox").each(function(){
		$(this).addClass("styled");
		$(this).find("input[type=checkbox]").after("<div class='checkbox-value'></div>");
    });
	
	$(document).click(function(event) { 
		if(!$(event.target).closest('#navbar').length) {
			if($('#navbar').is(".in")) {
				$('.navbar-toggle').click();
			}
		}       
		
		if(!$(event.target).closest('.cost-container').length) {
			if($('.cost-container:not(.closed)') && document.querySelector(".wrapped")) {
				$(".cost-container").addClass("closed");
			}
		}
	});
	
	if (document.querySelector(".cost-container")) {
		$(".cost-container").affix({offset: {top: $("#regform_wrap #regform").position().top-$(".navbar").height(), bottom: $(document).outerHeight()-($("#regform_wrap").position().top+$("#regform_wrap").outerHeight())}});
	}
	
	$(".toggle-cost-container").click(function() {
		if (document.querySelector(".wrapped")) {
			$(".cost-container").toggleClass("closed");
		}
	});
	
	resizeHandler();
	
	setTimeout(resizeHandler, 150);
});

$(window).resize(function() {
	clearTimeout(window.resizedFinished);
	window.resizedFinished = setTimeout(function(){
		resizeHandler();
		/* run again after document reflow */
		setTimeout(resizeHandler, 150);
	}, 250);
});