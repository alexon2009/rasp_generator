/*
function buttAction(obj){
	var buttClass = $(obj).attr("class");
	//console.log(buttClass);
	if(buttClass == "add-cleric"){
		addPeople({"act":"add-cleric", "id":$('#id').val()});
	}
	if(buttClass == "save-cleric"){
		changePeople("cleric-list");
	}
	if(buttClass == "add-people"){
		addPeople({"act":"add-people", "parent-id":$('#parent-id').val(), "status":$('#status').val(), "id":$('#id').val()});
	}
	if(buttClass == "save-people"){
		changePeople("people-list");
	}
	if(buttClass == "del-cleric"){
		changePeople("delete");
	}
	if(buttClass == "del-people"){
		changePeople("delete");
	}
	if(buttClass == "replace-people"){
		changePeople("replace");
	}	
	if(buttClass == "replace-cleric"){
		openDialogParishList();
	}	

	if(buttClass == "open-blago"){
		parishContent($(obj).attr("blago-id"));
	}		
	
	//открыть благочиние в диалоге
	if(buttClass == "lov-open-blago"){
		openDialogParishList($(obj).attr("blago-id"));
	}		
	//Вернуться назад (к разделу священнослужителя)
	if(buttClass == "back"){
		ajax_user({act:'user-start',cleric_id: $('#parent-id').val()}, loadForm);
	}	
};

function appendDialog(response){
		$('.remember-part').append('<div class ="lov-parish">'+response+'</div>');
	//кнопки переключения благочиний
	$('.lov-button-block li a').bind("click", function(){	
		$('.lov-parish').detach();
		buttAction(this);
	});
	//закрываем диалог
	$('.cancel').bind("click", function(){
		$('.lov-parish').detach(); 
	});	

	$(".lov-parish-list .parish-row").click(function(){
		var parishName = $(this).find("[class = parish-name]").text()+' пос. '+$(this).find("[class = parish-place]").text();
		if(confirm('Переместить клирика(-ов) на приход '+parishName+'?')){
			changePeople("cleric-replace", $(this).find("[class = parish-id]").val());
			TITLE = 'Приход '+parishName;
			$('.lov-parish').detach();
		};
	});
};
function openDialogParishList(parent_id){	
	var cnt=0;
	$('.check').each(function(i,r){
		if(r.checked){cnt++;}
	});
	//если есть выбранные объекты
	if(cnt>0){
		var params = {};
		params.act = 'parish-list';
		params.mode = 'lov-';
		params.parent_id = parent_id;
		//console.log(params);
		ajaxR(params, appendDialog);		
	}
};

function parishLoad(){
	
	//кнопки переключения благочиний
	$('.button-block li a').bind("click", function(){	
		buttAction(this);
	});
	
	//добавляется обработчик на открытие списка священнослужителей прихода
	$(".parish-list .parish-row").click(function(){
		TITLE='Приход '+$(this).find("[class = parish-name]").text()+' пос. '+$(this).find("[class = parish-place]").text();
		clericParishContent($(this).find("[class = parish-id]").val());
	});
	//добавляется обработчик на открытие списка о здравии и о упокоении
	$(".l-list").click(function(){
		peopleContent($(this).siblings(".id").val(),0);
	});
	$(".d-list").click(function(){
		peopleContent($(this).siblings(".id").val(),8);
	});
	//
	$('.type-name, .type-name').bind("click", function(){
		//передаем в качестве аргимента вызова диалока - вызывающий объект (кнопку с типом)
		lovTypeDialog(this);
	});
	//ДИАЛОГ ФОРМИРОВАНИЯ ПОМЯННИКА
	$('.open-setting-view').bind("click", function(){
		//console.log($(this).siblings('.id').val());
		ajaxR({act:'settings-view', cleric_id: $(this).siblings('.id').val(), mode: "user"}, loadSettingsForm, "remember_view.php");
	});
	
};

var TITLE='Список приходов';
//ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА
$( document ).ready(function() {
	//при загрузке документа 
	parishLoad();
});

function reTd(row, className){
	return ($($(row).parent().siblings('td').find("[class="+className+"]")[0])).val();
};*/

//--------------------------------//
//ЗАГРУЗКА ФОРМЫ НАСТРОЙКИ ПРОСМОТРА НА  ЭТУ СТРАНИЦУ
var loadSettingsForm = function(resp){
	$('.remember-part').html('<div id = "content">'+resp+'</div>');
	//Вернуться назад (к разделу священнослужителя)
	$('.back-user').bind("click", function(){
		ajaxR({act:'user-start',cleric_id: $('#cleric_id').val()}, loadForm, "remember_user.php");
	});
	//Загрузить помянник
	$('.open-view').bind("click", function(){
		loadPrintForm();
	});
	//Переключение списков помянника (список может быть или "о здравии" или "о упокоении")
	$('.view-filter-status').bind('click', function(){
		$('.view-filter-status').each(function(i,r){
			$(r).context.checked=false;
		});
		$(this).context.checked=true;
	});	
};
//ЗАГРУЗКА ФОРМЫ ПРОСМОТРА НА  НОВУЮ СТРАНИЦУ
var loadPrintForm = function(){
		var str ='';
		$('.view-filter').each(function(i,r){
			if($(r).context.checked){
				str=str+'&blago'+i+'='+$(r).attr('id');
			}
		}); 
		$('.view-filter-status').each(function(i,r){
			if($(r).context.checked){
				str=str+'&status='+$(r).attr('id');
			}
		}); 
	window.open('wp-content/plugins/bav-rememberplugin/includes/remember_view.php?act=view'+str, '_blank');
};

//ЗАГРУЗКА НОВОЙ ФОРМЫ НА СТРАНИЦУ ВМЕСТО ПРЕДЫДУЩЕЙ ФОРМЫ
var loadForm = function(resp){
	$('.remember-part').html('<div id = "content">'+resp+'</div>');

	//parishLoad();

 	$('.entry-title').text(TITLE);
   //Обработчики событий
	//при нажатии на кнопку типа вызывается диалог со списком типов
	$('.type-name, .type-name').bind("click", function(){
		//передаем в качестве аргимента вызова диалока - вызывающий объект (кнопку с типом)
		lovTypeDialog(this);
	});
	//при выборе священнослужителя открывается его форма
	//обработчики на кнопки "о здравии" и "о упокоении"
	$('.cleric-list .row .l-list, .cleric-list .row .d-list').bind("click", function(){
		TITLE = 'Помянник '+reTd(this, "type-name")+' '+
		reTd(this, "name")+' '+
		reTd(this, "family");
		peopleContent($(this).siblings(".id").val(), $(this).siblings(".status").val());
	});
	//кнопки в заголовке таблицы "Добавить", "Переместить", "Удалить", "Сохранить"
	/*$('.button-block li a').bind("click", function(){	
		buttAction(this);
	});*/
	//групповые изменения чекбоксов
	$('#check-all').bind('change',function(){
		if($(this).context.checked){
			$('.check, .check').each(function(i,r){r.checked=true;});
		}else{
			$('.check, .check').each(function(i,r){r.checked=false;});;
		}
	});

};

//ДОБАВЛЕНИЕ ФОРМЫ НА СТРАНИЦУ
var appendForm = function(response){
	
}

var start = function(){
	ajaxR({"act":"start"},loadForm);/**/
};
var parishContent = function(parent_id){
	ajaxR({"act":"parish-list", "parent_id":parent_id},loadForm);/**/
};
		
//--------------------------------//
//ВЫБОР ТИПА 
var lovTypeDialog = function(resp, ierarch){
	ajaxR({"act":"load-dialog","ierarch":ierarch}, function(response){
		$('.remember-part').append(response);
		$('.type').bind("click", function(){
			//записываем в вызвавший объект (кнопку типа) значение типа (по которому кликнули)$(".type-name").siblings(".type")
			$(resp).val($(this).find("[class=type-name]").text());
			$(resp).siblings(".type").val($(this).find("[class=type-id]").val());
			//закрываем диалог
			$('.lov-type').detach(); 
		});	
		$('.cancel').bind("click", function(){
			//закрываем диалог
			$('.lov-type').detach(); 
		});	
		$('.filter').bind("click", function(){
			$('.lov-type').detach(); 
			lovTypeDialog(resp,$(this).attr("id"));
			//console.log($(this).attr("id"));
			var butt = this;
			setTimeout(function(){
				$(butt).removeClass("filter");
				$(butt).addClass("selected");
				console.log($(butt).attr("class"));
				},0);			
		});	
	});/**/

};
		//ПОМЯННИК - СВЯЩЕННСЛУЖИТЕЛИ ПРИХОДОВ
var clericParishContent = function(parishId){
	ajaxR({"act":"cleric-parish-list", "parish-id":parishId,"status":0},loadForm);/**/
};
		//ПОМЯННИК - ЛЮДИ
var peopleContent = function(parentId, status){
	ajaxR({"act":"people-list", "parent-id":parentId, "status":status},loadForm);/**/
};
//добавить человека
var addPeople = function(params){
	ajaxR(params,function(resp){
			console.log(resp);
		if(params.act == "add-cleric"){
			$('.cleric-list tbody').append(resp);		
		}
		if(params.act == "add-people"){
			$('.people-list tbody').append(resp);		
		}
		$('.type-name, .type-name').bind("click", function(){
			//передаем в качестве аргимента вызова диалока - вызывающий объект (кнопку с типом)
			lovTypeDialog(this);
		});
		
	});
		
};
//групповые изменения людей
function changePeople(action, parish_id){
	console.log(action+' p_id:'+parish_id);
	var cnt=0;
	$('.check').each(function(i,r){
		var params = {};
		if(r.checked){
			cnt++;
			params.act = 'save-people-list';
			params.id = reTd(r, "id");
			params.parish_id = $('#parish-id').val();
			params.parent_id = $('#parent-id').val();
			params.type = reTd(r, "type");
			params.name = reTd(r, "name");
			params.family = reTd(r, "family");
			if(action=='people-list'){params.status=$('#status').val();}
			if(action=='cleric-list'){params.status=$('#status').val();}
			if(action=='replace'){params.status=$('#replace-status').val();}
			if(action=='delete'){params.status=99;}
			if(action=="cleric-replace"){
				params.parish_id = parish_id;
				params.status=$('#status').val();	
			}				
			console.log(params);
			ajaxR(params, loadForm);				

		}
	});
	if((action=='cleric-list')||(action=='delete'&&cnt>0)){clericParishContent($('#parish-id').val());}
	if((action=='people-list')||(action=='delete'&&cnt>0)){peopleContent($('#parent-id').val(), $('#status').val());}
	if(action=='replace'){peopleContent($('#parent-id').val(), $('#replace-status').val());}
	if(action=='cleric-replace'){clericParishContent(parish_id);}
			
};
//----------------------------------------------------------------//

