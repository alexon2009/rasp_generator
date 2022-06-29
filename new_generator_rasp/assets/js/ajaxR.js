

//----------------------------------------------------------------//

var ajax_user  = function(params, func, file_){
	var fileName = file_||"lit_user.php";
	jQuery.ajax({
		type: "POST",
		url: "/wp-content/plugins/bav-lit/includes/"+fileName,
		data: params,
		success: function(resp){
			if(func)func(resp);
		}
	});
};
var ajax_admin  = function(params, func, file_){
	var fileName = file_||"lit_admin.php";
	jQuery.ajax({
		type: "POST",
		url: "/wp-content/plugins/bav-lit/includes/"+fileName,
		data: params,
		success: function(resp){
			if(func)func(resp);
		}
	});
};
