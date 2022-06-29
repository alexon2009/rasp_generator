function editActions(){
	jQuery("#add").click(function(){
		ajax_admin({act:'add_text'}, function(resp){
			jQuery("#edit").html(resp);
			editActions();
		});
	});
	//Сохранение рассказа
	jQuery("#save").bind("click", function(){
		ajax_admin({
				act:'edit_text', 
				id:jQuery('#edit-id').val(),
				name:jQuery('#edit-name').val(),
				comment:jQuery('#edit-comment').val(),
				text:jQuery('#edit-text').val(),
				seq:jQuery('#edit-seq').val(),
				status: 0
			}, function(resp){
					//console.log(resp);
				ajax_admin({act:'get_text_list'}, function(resp){
					location.reload();
				});
			});/**/
	});
	//Удаление рассказа
	jQuery("#delete").bind("click", function(){
		if(confirm("Вы действительно хотите удалить этот рассказ?")){
			ajax_admin({
				act:'edit_text', 
				id:jQuery('#edit-id').val(),
				status: 99
			}, function(resp){
				ajax_admin({act:'get_text_list'}, function(resp){
					location.reload();
				});
			});/**/
		}
	});
};
function loadContent(obj){
		
	jQuery('.active-row').removeClass('active-row');
	jQuery(obj).addClass('active-row');
	//jQuery(obj).parent().addClass('active-row');
	//jQuery(obj).search('.menu-href').addClass('active-row');
	ajax_admin({act:'get_edit', id:jQuery(obj).children('.menu-href').attr('id')}, function(resp){
		

		jQuery("#edit").html(resp);
		
		editActions();
	});
};

//ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА
jQuery( document ).ready(function() {
	//
	//при загрузке документа 
	jQuery("#menu").remove();
	jQuery(".credit").remove();
	jQuery('.menu-item').each(function(i,r){
		if(i==0){
			//jQuery(r).addClass('active-row');
			loadContent(r);
		}
	});
	//загрузить текст

	/*jQuery(".menu-href").bind("click", function(){
		loadContent(this);
	});*/
	jQuery(".menu-item").bind("click", function(){
		loadContent(this);
	});/**/
});
	
