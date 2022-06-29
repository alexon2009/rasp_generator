//ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА
//получение отдельной копии объекта
function deepCopy(obj){
	if(obj){
	return JSON.parse(JSON.stringify(obj));
	}else{return {}}
};
//загрузить указанный шаблок с данными в указанное место
function appItem(data, tmpl, partHtml, callback){	
	addToHistory(appItem, data, tmpl, partHtml, callback);
	//console.log(tmpl);
	var tmp = _.template(tmpl);
	$(partHtml).html(tmp(data));
	if(callback && typeof(callback) === "function"){
		callback(data);
	}
};
//вывод сообщения
function msgPrint(msg, msgType, time){
	time = time||3000;
	if(msgType){
		if(msgType == "danger"){
			$('#msg').css({"background-color":"red", "display":"block", "border-color":"white", "color":"white" });
		}
		if(msgType == "success"){
			$('#msg').css({"background-color":"green", "display":"block", "border-color":"white", "color":"white" });
		}
	}else{
		$('#msg').css({"background-color":"white", "display":"block", "border-color":"brown", "color":"brown" });
	}    

		$('#msg strong').text(msg);
		$('#msg').animate({opacity: 1},500);
		setTimeout(function(){
				$('#msg').animate({opacity: 0},1500, function(){$('#msg').css({"display":"none"});});			
				$('#msg .close').click(function(){
					$('#msg').css({"display":"none"});
				});			
			},time);
};
var historyArr = [];
//добавить в историю
function addToHistory(formCode, params, formId, callback){	
	if((formId == "inner-container") &&
		(((historyArr.length > 0) && (historyArr[historyArr.length-1].FORM_CODE != formCode))||
		(historyArr.length == 0)))
		historyArr.push({
			FORM_CODE: formCode,
			PARAMS: params,
			FORM_ID: formId,
			CALLBACK: callback
	});
}
//находим часть в общей модели визуализации
function getVMPart(visModel_, formId){
	//console.log(visModel_);
	//console.log(formId);
	var search = false;
	var resp;
	if(visModel_.id == formId){
		search = visModel_;
	}else{
		if(visModel_.buttons && visModel_.buttons.length > 0){
			_.each(visModel_.buttons, function(f){
				resp = getVMPart(f, formId); 
				if(resp){search = resp;}
			});
		}
		if(visModel_.fields && visModel_.fields.length > 0){
			_.each(visModel_.fields, function(f){
				resp = getVMPart(f, formId); 
				if(resp){search = resp;}
			});
		}
	}
	
	return search
};
//получить указанный шаблок с данными
function getItem(vm){	
	//присоединяем к шаблону контекст формы
var tmpl = sch.TMPLS[vm._type]; 	
var resp;
	try {
		var tmp = _.template(tmpl);
		resp = tmp(vm);
	}catch(err){
		resp = "";
		console.log(err);
	}
	return resp;
};

//получить указанный шаблок с данными
function getItem1(vm, tmpl){	
	//присоединяем к шаблону контекст формы
	var tmp = _.template(tmpl);
	var resp;
	try {
		resp = tmp(vm);
	}catch(err){
		resp = "";
		console.log(err);
	}
	//vm.condition = vm.condition||"true";
	return resp;
};


function getItem2(vm, path){	
		//console.log(vm);
		//console.log(path);
		vm.condition = vm.condition||"true";
	var tmpl = '<%var path ="'+path+'";var data =eval(path);var form = sch.Forms["'+sch.currentFormId+'"]; form.params = form.params||{}; form.data = form.data||{}; if('+vm.condition+'){%>'+sch.TEMPLATES[vm.type]+'<%}%>';
		//console.log(tmpl);
	
	var tmp = _.template(tmpl);
	var resp;
	try {
		resp = tmp(vm);
	}catch(err){
		resp = "";
		msgPrint(err, "warning");
		//console.log(err);
	}
		//console.log(resp);

	return resp;
};
function getProperty(data,source, val){
	if(data && source && data[source]){
		return data[source];
	}else{
		if(val){
			return val;
		}else{
			return '';
		}
	}
};
function getSource(data, source){
  if(data && data[source]){
	 return data[source];
  }else{
	 return '';
  }
};
function show_header(){	
	return true;
};

//генерация формы
function genForm(form, params_, callback){
				form.params = params_;

		form.addRow = function(gdata, data, rowName, val){
			gdata[rowName].push({});
			form.dataRow(gdata, data, rowName);
		};
		form.delRow = function(gdata, row, data){
		  data.modified = "deleted";
		  form.dataRow(gdata, data, row);
		};
		form.dataRow = function(gdata, data, row){
			alert('dataRow');
		  //удаляем все действия, не связанные с DOM-элементами
		  var arrTmp = [];
		  _.each(form.actions, function(act){
			if($('#'+act.id)[0])arrTmp.push(act);
		  });
		  form.actions =arrTmp;

		  sch.currentFormId = form.formId;
		  var a = _.find(form.actions, function(act){
			return((act.type == "list")
				   &&(act.sourceName == row)
				   //&&(JSON.stringify(data[row]) === JSON.stringify(act.data))
				  )
		  });
			console.log(form.actions);
		  if(a){
			//получаем участок модели визуализации, соответствующий списку
			var visModel = getVMPart(form.visModel, a.source);
			visModel.data = a.sourceName;
			visModel.sourceName = a.sourceName;
			alert('visModel');
			console.log(visModel);
			//  получаем html  списка
			tmpl = getItem(visModel, sch.TEMPLATES[visModel.type]);
			console.log(form.actions);
			tmpl = getItem(gdata, tmpl);
			//добавляем обновленный список в DOM- модель
			$('#'+a.id).replaceWith(tmpl);
		  }
		  //устанавливаем обработчики событий
		  form.setActions(form);
		  form.bindInput();
		};
		//перезагрузка формы
		form.reload = function(){
			formLoad(form.code, form.params, form.formId, callback);
		};
		//$("#dialog-parent-4").trigger("click")
		form.trigger = function(act_, data_){
			/**/if(_.indexOf(act_, ":") !== -1){
				var a = act_.split(":");
				_.each(form.actions, function(actRow){
					//if((actRow.type == "button")&&(actRow.action == a[0])){
					if(actRow.action == a[0]){
						$("#"+actRow.id).trigger(a[1], data_);
					}
				});
			}else{
				$("#"+form.formId).trigger(act_, data_);
			}
		};
		form.on = function(act_, callback){
			if(_.indexOf(act_, ":") !== -1){
				var arrActObj = act_.split(" ");
				_.each(arrActObj, function(action){
					a = action.split(":");
					_.each(form.actions, function(actRow){
						if((actRow.type == "button")&&(actRow.action == a[0])){
							$("#"+actRow.id).unbind(a[1]);
							$("#"+actRow.id).bind(a[1], actRow, function(e){callback(e.data.data, e.data.action, this);});
						}
						if((actRow.type == "text" || actRow.type == "check")&&(actRow.sourceName == a[0])){
							$("#"+actRow.id).unbind(a[1]);
							$("#"+actRow.id).bind(a[1], actRow, function(e){callback(e.data.data, e.data.sourceName, e.data.data[e.data.sourceName], this);});
						}
						if((actRow.type == "row")&&(actRow.action == a[0])){
							$("#"+actRow.id).unbind(a[1]);
							$("#"+actRow.id).bind(a[1], actRow, function(e){callback(e.data.data, e.data.action, this);});
						}
					});
				});
			}else{
				$("#"+form.formId).unbind(act_);
				$("#"+form.formId).bind(act_, function(e, p){callback(e, p);});					
			}
		};
		//сохранение данных формы
		form.save = function(){
/* 			var p = {act: 'run_func', action: form.put_, PARAMS: JSON.stringify(form.params), DATA: JSON.stringify(form.data)};
			ajax(p, function(resp){
				if(resp == 1){
					msgPrint('Форма сохранена', "success");					
				}
			});
 */		};
		//загрузка модального диалога
 		form.loadModalDialog = function(formCode, params, dialogId, callback){
			params.data_ = {};
			formLoad(formCode, params, dialogId, function(form_){
			    $('#background').css({'display':'block', 'z-index': '10'});			
				$("#"+dialogId+"-form").css({'display':'block', 'z-index': '11'});
				if(callback && (typeof(callback) == 'function')){
					callback(form_);
				}
			});
		};
		//закрытие модального диалога
 		form.closeDialog = function(dialogId){
			if(dialogId){
				$("#"+dialogId+"-form").css({'display':'none', 'z-index': '1'});
				$("#"+dialogId).html('');
			}
			setTimeout(function(){$('#background').css({'display':'none', 'z-index': '0'});}, 1);
		};
		//закрытие формы
 		form.close = function(){
			$("#"+form.formId).html('');
			delete sch.Forms[form.formId];
		};
		//загрузка всех встроенных форм
		form.loadAllInnerForms = function(){
			_.each(form.innerForms, function(inner){
			  formLoad(inner.formCode, inner.params, inner.formId);
			});
		};
		//загрузка встроенной формы
		form.loadInnerForm = function(formId, callback){
			var innerForm = _.find(form.innerForms, function(inner){
			  return(inner.formId == formId);
			})
			if(innerForm){
				var currInnerForm = sch.Forms[formId]
				try{
					_.each(Object.keys(innerForm.params), function(innpk){
							innerForm.params[innpk] = eval(innerForm.params[innpk]);
					});
					formLoad(innerForm.formCode, innerForm.params, innerForm.formId, function(innerForm){if(callback && (typeof(callback) == 'function'))callback(innerForm)});
				}catch(err){
					console.log("форма "+innerForm.formId+"не перезагружена");
					return false;
				}
			}
		};
		
		//присоединение инпутов к данным 

		form.bindInput = function(form){
			_.each(form.actions, function(act){
				if(act.type == "text"){
					//console.log(act);
					//bindModelInput(act.data||form.data||form.dataModel, act.sourceName, document.getElementById(act.id)); 
					bindModelInput(act.data, act.sourceName, document.getElementById(act.id)); 
				}
				if(act.type == "check"){
					bindModelInput(act.data, act.sourceName, document.getElementById(act.id));
				}
			});
		};
		//исполнение кода из раздела JS
		form.setActions = new Function('form', form.js);
		//отрисовка формы
		form.render = function(){

			form.actions = [];
			form.innerForms = [];
			sch.currentFormId = form.formId;
			//var tmpl = getItem1(form.visModel, sch.TEMPLATES[form.visModel.type]);
			//console.log(form.visModel);
			//console.log(form.data);
			var tmpl = getItem2(form.visModel, "sch.Forms['"+sch.currentFormId+"'].data");
			//console.log(tmpl);
			$("#"+form.formId).html(tmpl);
			setTimeout(function(){
				form.setActions(form);
				form.bindInput(form);
				$("#"+form.formId).trigger("render");
			}, 100);
		};
		
		if(params_.data_){
			//если данные переданы в параметре, то сразу отрисовываем форму
			form.data = params_.data_;
			form.setActions(form);
			form.render();
			if(typeof(callback) === "function"){
				callback(form);
			}
		}else{
			//загрузка данных с сервера
/* 			var p = {act: 'run_func', action: form.get_, PARAMS: JSON.stringify(form.params)};
			ajax(p, function(resp){
						//console.log(p);
				try{
					if(resp){
						form.data = unScreen(JSON.parse(resp));
						//
					}else{
						//если данных нет, то для того чтобы форма работала, берем пустую модель данных
						form.data = deepCopy(form.dataModel);
					}
					form.setActions(form);
					form.render();
					if(typeof(callback) === "function"){
						callback(form);
					}
				}catch(err){
					console.log(err);
				}
				//$("#"+form.formId).trigger("render");
			});
 */		}	
		
		form.runAjax = function(params, callback){
			//
/* 			var p = {act: 'run_func', action: form.ajax, PARAMS: JSON.stringify(params)};
				console.log(p);
			ajax(p, function(resp){
				console.log(resp);
				var obj = JSON.parse(resp);
				console.log(obj);
				try{
					if(typeof(callback) === "function"){
						callback(obj);
					}
				}catch(err){
					console.log(err);
				}
			});
 */		};
};
function formLoad(formCode_, params_, id_, callback){
	//добавляем форму в хранилище
	if(	id_ == "inner-container"){

	setValue({code: 'LOAD_FORM_CODE',     value: formCode_});	
	setValue({code: 'LOAD_FORM_PARAMS',   value: params_});	
	//setValue({code: 'LOAD_FORM_ID',       value: id_});	
	//setValue({code: 'LOAD_FORM_CALLBACK', value: callback});	
	}
	addToHistory(formCode_, params_, id_, callback);
	sch.currentFormId = id_;
	//в этом приложении нет работы с сервером, поэтому в форму сразу передаются данные
	params_.data_ = params_.data_||{};
	//console.log(sch.Forms[id_]);
	//берем форму из списка загруженных форм
	//var f = deepCopy(sch.Forms[id_]);
		sch.Forms[id_] = deepCopy(sch.LOADING_FORMS[formCode_]);
		sch.Forms[id_].formId = id_;
		genForm(sch.Forms[id_], params_, callback);
			
};	

	//при загрузке документа 
$( document ).ready(function() {
	//sch.CALC_PASHA_CALENDAR =calcPashaCalendar();
 getValue('CALC_PASHA_CALENDAR', function(data){if(data.value)sch.CALC_PASHA_CALENDAR = data.value});
 getValue('USER_CALENDAR', function(data){if(data.value)sch.USER_CALENDAR = data.value});
 getValue('USER_SETTINGS', function(data){if(data.value)sch.SETTINGS = data.value});
 getValue('LISTS', function(data){if(data.value)sch.LISTS = data.value});
 getValue('CALENDAR_TMPLS', function(data){if(data.value)sch.CALENDAR_TMPLS = data.value});
 getValue('JORNAL_ROWS', function(data){if(data.value)sch.JORNAL_ROWS = data.value});
 
var formCode_, params_, id_, callback_;
	formCode_ = "CALENDAR_1";
	params_ = {MODE:'USER_CALENDAR', data_:{}};
	id_ = "inner-container";
	callback = function(){};

	//получаем форму из хранилища
	getValue('LOAD_FORM_CODE', function(data){if(data.value)formCode_ = data.value;
	getValue('LOAD_FORM_PARAMS', function(data){if(data.value)params_ = data.value;
	//console.log(formCode_);
	//console.log(params_);
	formLoad(formCode_, params_, id_, callback); 
	});
	});
 
 	//formLoad("CALENDAR_1", {MODE:'USER_CALENDAR', data_:{}}, "inner-container", function(){}); 
	
});
