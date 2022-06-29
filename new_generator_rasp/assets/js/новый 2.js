
var indexedDB 	  = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
	IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
	baseName 	  = "AppDB",
	storeName 	  = "AppStore";

function logerr(err){
	console.log(err);
}

function connectDB_(f){
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function(){
		// При успешном открытии вызвали коллбэк передав ему объект БД
		f(request.result);
	}
	request.onupgradeneeded = function(e){
		// Если БД еще не существует, то создаем хранилище объектов.
		e.currentTarget.result.createObjectStore(storeName, { keyPath: "code" });
		connectDB_(f);
	}
}

function getValue_(val, f){
	connectDB_(function(db){
		var request = db.transaction([storeName], "readonly").objectStore(storeName).get(val);
		request.onerror = logerr;
		request.onsuccess = function(){
			f(request.result ? request.result : -1);
		}
	});
}

function getStorage_(f){
	connectDB_(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}
//obj = {code: 'CODE', value: 'VALUE'}
function setValue_(obj){
	connectDB_(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).put(obj);
		request.onerror = logerr;
		request.onsuccess = function(){
			return request.result;
		}
	});
}

function delValue_(val){
	connectDB_(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(val);
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("val delete from DB:", val);
		}
	});
}
//--------------------------------------------------------------------------

function getMonthNum(month){
	if(month == "января")return '01';
	if(month == "февраля")return '02';
	if(month == "марта")return '03';
	if(month == "апреля")return '04';
	if(month == "мая")return '05';
	if(month == "июня")return '06';
	if(month == "июля")return '07';
	if(month == "августа")return '08';
	if(month == "сентября")return '09';
	if(month == "октября")return '10';
	if(month == "ноября")return '11';
	if(month == "декабря")return '12';
};
function getShotFormatDate(strDate){
	var arr = strDate.split(' ');
	var arr1 = [];
	if(parseInt(arr[0]) < 10)arr[0] = '0'+arr[0];
	arr[1] = getMonthNum(arr[1]);
	arr1.push(arr[1]);
	arr1.push(arr[0]);
return arr1.join("-");
};

var arr = [];

//var arr = JSON.parse('');
var obj, obj1 = {};
var dateArr = [];
var str, str1 = '';
$('#menology > table tr').each(function(row){
	str, str1 = '';
	$(this).find('td').each(function(cell){
		obj = {COMMENT0: '', COMMENT1: '', DATE_LIST: []};
		dateArr = [];
			//cell 0 - имя
			if(cell == 0){str = $(this).text();}
		$(this).find('a').each(function(val){
			//cell 1 - разряд
			if(cell == 1){str1 = str1+$(this).text();}
			//cell 2 - список дат
			//if((cell == 2)&&($(this).next().text()=='(переходящая)')){
			if(cell == 2){
				//val -  дата
				dateArr.push({DATE:$(this).text()});
			}
		});
		//console.log(str);
		obj.COMMENT0 = str;
		obj.COMMENT1 = str1;
		obj.DATE_LIST = dateArr;
	});
	obj1 = {};
	$.each(obj.DATE_LIST, function(i,r){
		obj1 = {FORMAT_DATE: getShotFormatDate(r.DATE), COMMENT: obj.COMMENT1+' '+obj.COMMENT0};
	arr.push(obj1);
	});
});

//console.log(JSON.stringify(arr));
console.log(arr);
 getValue_('ARR', function(data){if(data.value)arr = arr.concat(data.value); setValue_({code: 'ARR', value: arr});});


getValue_('ARR', function(data){if(data.value)console.log(JSON.stringify(data.value));});


//----------------------------------------------------
var str = ;
sch.SAINTS_STR.replaceAll('монах', ' монах');
sch.SAINTS_STR.replaceAll('иеромонах', ' иеромонах');
sch.SAINTS_STR.replaceAll('схимонах', ' схимонах');
sch.SAINTS_STR.replaceAll('схи монах', 'схимонах');
sch.SAINTS_STR.replaceAll('иеро монах', 'иеромонах');
sch.SAINTS_STR.replaceAll('епископ', ' епископ');
sch.SAINTS_STR.replaceAll('архиепископ', ' архиепископ');
sch.SAINTS_STR.replaceAll('архи епископ', 'архиепископ');
sch.SAINTS_STR.replaceAll('послушник', ' послушник');
sch.SAINTS_STR.replaceAll('послушница', ' послушница');
sch.SAINTS_STR.replaceAll('иерей', ' иерей');
sch.SAINTS_STR.replaceAll('протоиерей', ' протоиерей');
sch.SAINTS_STR.replaceAll('прото иерей', 'протоиерей');
sch.SAINTS_STR.replaceAll('диакон', ' диакон');
sch.SAINTS_STR.replaceAll('митрополит', ' митрополит');
sch.SAINTS_STR.replaceAll('патриарх', ' патриарх');
sch.SAINTS_STR.replaceAll('пресвитер', ' пресвитер');
sch.SAINTS_STR.replaceAll('игумен', ' игумен');
sch.SAINTS_STR.replaceAll('игуменья', ' игуменья');
sch.SAINTS_STR.replaceAll('архимандрит', ' архимандрит');
console.log(sch.SAINTS_STR);

	_.each(sch.SAINTS, function(snt){
		if(snt){
		var ucRow = _.find(sch.USER_CALENDAR, function(uc){
		return (uc.FORMAT_DATE == snt.FORMAT_DATE)});
		if(ucRow){
			if(!ucRow.COMMENT_LIST){
				ucRow.COMMENT_LIST = []
			}
			var clRow = _.find(ucRow.COMMENT_LIST, function(cl){return(cl.COMMENT == snt.COMMENT)});
			if(!clRow){
			ucRow.COMMENT_LIST.push(snt)
			}
		}
		else{snt.COMMENT_LIST = [];sch.USER_CALENDAR.push(snt);}
		}
	});

