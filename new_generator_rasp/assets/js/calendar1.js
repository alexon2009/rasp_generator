$ = jQuery;
//генерация календаря на месяц (без года)
function generateNullCalendar(month){console.log(month);
	var currentYear = 2020;
	var currentMonth =  month;
	//получаем календарь на месяц с обозначением воскресных дней (дни только указанного месяца)
	var gr = getMonthCalendar(currentYear, currentMonth);
	//

	gr.CURRENT_YEAR = currentYear;
	gr.CURRENT_MONTH = currentMonth;
	gr.IS_NULL_CALENDAR = true;
	
	_.each(gr.ROWS, function(calendarRow){
		//дата для для работы с пользовательским списком (предыдущий день)
		calendarRow.PREV_FORMAT_DATE = getCalcDate(calendarRow.FORMAT_DATE, -1);
		//короткая форматированная дата для работы с пользовательским списком (предыдущий день)
		calendarRow.SHORT_PREV_FORMAT_DATE = calendarRow.PREV_FORMAT_DATE.substring(10,5);
		//короткая дата для отображения в заголовке (предыдущий день)
		calendarRow.SHORT_PREV_READ_DATE = 
		getReadDate1(new Date(calendarRow.PREV_FORMAT_DATE));
		calendarRow.SHORT_PREV_READ_DATE = 
		calendarRow.SHORT_PREV_READ_DATE.substring(0, calendarRow.SHORT_PREV_READ_DATE.length-3);
		
		//короткая дата для отображения в заголовке
		calendarRow.SHORT_READ_DATE = 
		getReadDate1(new Date(calendarRow.FORMAT_DATE));
		calendarRow.SHORT_READ_DATE = 
		calendarRow.SHORT_READ_DATE.substring(0, calendarRow.SHORT_READ_DATE.length-3);
		//короткая форматированная дата для работы с пользовательским списком
		calendarRow.SHORT_FORMAT_DATE = calendarRow.FORMAT_DATE.substring(10,5);
		
		calendarRow.COMMENT = '';
		//добавление пользовательского календаря НЕПОДВИЖНЫЕ ДАТЫ
		var usCal = _.find(sch.USER_CALENDAR, function(uc){
			return(currentYear+'-'+uc.FORMAT_DATE === calendarRow.FORMAT_DATE);
		});
		if(usCal){
			calendarRow.COMMENT      = usCal.COMMENT;
			calendarRow.COMMENT_LIST = usCal.COMMENT_LIST;
			calendarRow.HOLYDAY      = usCal.HOLYDAY;
            calendarRow.SERV_LIST    = usCal.SERV_LIST;
            calendarRow.SERV_LIST_EV = usCal.SERV_LIST_EV;
            calendarRow.SERV_LIST_MR = usCal.SERV_LIST_MR;
			calendarRow.NOT_ADD_SRVS = usCal.NOT_ADD_SRVS;
		}
		calendarRow.SELECTED = false;
		calendarRow.SELECTED_LESSON_CNT = '';
	});
	return gr;
};
//двумерный массив делаем плоским
function makeArrFlat(arr_, innerArr){
	var arr =[];
  _.each(arr_, function(row){
	arr.push(row);
	if(row[innerArr]){
	  _.each(row[innerArr], function(rowIn){arr.push(rowIn);});
	}
  });
  return arr;
};

//календарь событий , связанных с Пасхой
function genPashaCalendar(prevPashaDate, nowPashaDate){
	//массив пользовательского календаря подвижных событий делаем плоским
	var arr = makeArrFlat(sch.CALC_PASHA_CALENDAR, 'DAY_LIST');
  //console.log (arr);
	sch.PASHA_CALENDAR = [];
	//нед. мытаря и фар.22
	var pTriodDateStart = getCalcDate(nowPashaDate, -70);
	//колич. дней м\у Пасхой 21 и нед. мытаря и фар.22
	var cntBetween = getNumberOfDays(prevPashaDate, pTriodDateStart);
	//колич. дней м\у Пасхой 21 и новым годом 21-22
	var cntBetweenNY = getNumberOfDays(prevPashaDate, prevPashaDate.substring(0,4)+'-12-24');
	//от Пятидесятницы до нового года толькосчитаем седмицы
	var obj ={};
	var servArr = [];
	var p =56;
	var i =56;
	var n =1;
	while(i<cntBetweenNY){
		//21
		i = i+7;	
		n++;
	};
	
	//заполнение пасхального календаря пользовательскими событиями
	function fillPC(pashaDate, p){
      var rowCP =_.find(arr, function(r){return (r.DAY_NUM == p)});
      if(rowCP){//console.log (rowCP);console.log (p);console.log (getCalcDate(pashaDate, p));
		if(rowCP.HOLYDAY){
		  _.each(rowCP.SERV_LIST, function(rowSl){
			servArr.push(rowSl);
		  });
		  sch.PASHA_CALENDAR.push({
			FORMAT_DATE: getCalcDate(pashaDate, p),
			COMMENT: rowCP.EVENT,
			HOLYDAY: rowCP.HOLYDAY,
			NOT_ADD_SRVS: rowCP.NOT_ADD_SRVS,
			SERV_LIST: servArr
		  });
		  servArr = [];
		}
		else{
			sch.PASHA_CALENDAR.push({
				FORMAT_DATE: getCalcDate(pashaDate, p),
				COMMENT: rowCP.EVENT
			});
		}
	  }
	};
	p = i;
	while(p<cntBetween){
		//21-22
		fillPC(prevPashaDate, p);
		p++;
	};
/* 	while(i<cntBetween){
		//21-22
		sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(prevPashaDate, i), COMMENT: n+'-я седмица по Пятидесятнице'});
		i = i+7;	
		n++;
	};
 */	
	//от нед. мытаря и фар. до Пасхи 22
	p = -70;
	while(p<0){
		//21-22
		fillPC(nowPashaDate, p);
		p++;
	};
/* 
	var cntBetween = getNumberOfDays(pTriodDateStart, nowPashaDate);
	console.log (cntBetween);
	i =7;
	sch.PASHA_CALENDAR.push({FORMAT_DATE: pTriodDateStart,
	COMMENT: 'нед. о мытаре и фарисее'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 7),
	COMMENT: 'нед. о блудном сыне'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 14),
	COMMENT: 'нед. о страшном суде. Мясопустная'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 21),
	COMMENT: 'Прощеное Воскресение. нед. Сыропустная'});

	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 28),
	COMMENT: '1-я неделя Великого поста'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 35),
	COMMENT: '2-я неделя Великого поста'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 42),
	COMMENT: '3-я неделя Великого поста'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 49),
	COMMENT: '4-я неделя Великого поста'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 56),
	COMMENT: '5-я неделя Великого поста'});
	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(pTriodDateStart, 63),
	COMMENT: 'Вербное Воскресение'});
	
	sch.PASHA_CALENDAR.push({FORMAT_DATE: nowPashaDate,
	COMMENT: 'ПАСХА. Христово Воскресение'});

	sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(nowPashaDate, 39),
	COMMENT: 'Вознесение Господне'});
 */
 //ПАСХА
 p = 0;
 fillPC(nowPashaDate, p);
	//колич. дней м\у Пасхой 22 и новым годом 22-23
	var nextYear = new Date(nowPashaDate).getFullYear()+1;
	cntBetween = getNumberOfDays(nowPashaDate, nextYear+'-01-08');
	while(p<cntBetween){
		//21-22
		fillPC(nowPashaDate, p);
		p++;
	};
/* 	i =7;
	n =2;
	while(i<49){
		//22
		sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(nowPashaDate, i), COMMENT: n+'-я седмица по Пасхе'});
		i = i+7;	
		n++;
	};
		sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(nowPashaDate, 49), COMMENT: 'Св. ТРОИЦА (ПЯТИДЕСЯТНИЦА)'});
		sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(nowPashaDate, 50), COMMENT: 'день Св. Духа'});
 	i =56;
	n =1;
	while(i<cntBetween){
		//22
		sch.PASHA_CALENDAR.push({FORMAT_DATE: getCalcDate(nowPashaDate, i), COMMENT: n+'-я седмица по Пятидесятнице'});
		i = i+7;	
		n++;
	};*/
	
};

//вычисление событий , связанных с Пасхой
function calcPashaCalendar(){
	function getObj(dayNum_, event_, event_1, isWD_){
		var obj = {};
		if(isWD_){
			obj = {DAY_NUM: dayNum_, EVENT: event_, HOLYDAY:true};
		}
		else{
			//если требуется получить неделю -добавляем седмичные дни
			var dayList = [];
			var i =1;
			while(i<7){
				dayList.push({DAY_NUM: dayNum_+i, DAY_NAME: getDayName(i), EVENT: getDayName(i)+' '+event_1||event_})
				i++;
			}
			obj = {DAY_NUM: dayNum_, EVENT: event_, DAY_LIST:dayList};
		}

		return obj;
	};
	arr =[];
	arr.push(getObj(-70, 'нед. о мытаре и фарисее.', 'седмицы о мытаре и фарисее.'));
	arr.push(getObj(-63, 'нед. о блудном сыне.', 'седмицы о блудном сыне.'));
	arr.push(getObj(-56, 'нед. о страшном суде. Мясопустная.', 'сырной седмицы.'));
	arr.push(getObj(-49, 'нед. Сыропустная. Прощеное Воскресение.', '1-й седмицы Великого поста.'));
	arr.push(getObj(-42, '1-я нед. Великого поста. Торжество Православия.', '2-й седмицы Великого поста.'));
	arr.push(getObj(-35, '2-я нед. Великого поста. свт. Григория Паламы.', '3-й седмицы Великого поста.'));
	arr.push(getObj(-28, '3-я нед. Великого поста.Крестопоклонная.', '4-й седмицы Великого поста.'));
	arr.push(getObj(-21, '4-я нед. Великого поста. прп. Иоанна Лествичника.', '5-й седмицы Великого поста.'));
	arr.push(getObj(-14, '5-я нед. Великого поста. прп. Марии Египетской.', '6-й седмицы Великого поста.'));
	arr.push(getObj(-7, 'Вход Господень в Иерусалим. Вербное Воскресение.', 'Страстной седмицы.'));
	arr.push(getObj(0, 'ПАСХА. Христово Воскресение', 'Светлой седмицы'));
	arr.push(getObj(7, 'Антипасха. 2-я нед. по Пасхе', ' 2-й седмицы по Пасхе'));
	//arr.push(getObj(40, 'Вознесение Господне', '', true));
	i =14;
	n =3;
	while(i<49){
		arr.push(getObj(i, n+'-я нед. по Пасхе', n+'-й седмицы по Пасхе'));
		i = i+7;	
		n++;
	};
	arr.push(getObj(49, 'Св. ТРОИЦА (ПЯТИДЕСЯТНИЦА)', '1-я седмица по Пятидесятнице'));
	//arr.push(getObj(50, 'день Св. Духа', '', true));
	i =56;
	n =1;
	while(i<330){
		//22
		arr.push(getObj(i, n+'-я нед. по Пятидесятнице', (n+1)+'-я седмица по Пятидесятнице'));
		i = i+7;	
		n++;
	};
	return arr;
};

//генерация календаря на месяц 
//isUc - нужно ли добавить календарь неподвижных дат
//isPc - нужно ли добавить календарь подвижных дат
function generateCalendar(year, month, isUc, isPc){
	//если год или месяц не указаны, то берутся значения текущей даты
	var currentYear;
	if(year || year === 0){currentYear = year;}
	else{currentYear = new Date().getFullYear();}
	var currentMonth;
	if(month || month === 0){currentMonth =  month;}
	else{currentMonth =new Date().getMonth();}
	//получаем календарь на месяц с обозначением воскресных дней (дни только указанного месяца)
	var gr = getMonthCalendar(currentYear, currentMonth);
	//
	//если первый день месяца не понедельник, то подставляем дни из предыдущего месяца до понедельника
	var d = gr.ROWS[0].DAY;
	var anyMonthDate = new Date(gr.ROWS[0].FULL_DATE);
	//пока дата не понедельник, добавляем дни из предыдущего месяца
	while(d > 1){
		anyMonthDate.setDate(new Date(anyMonthDate).getDate()-1);
		gr.ROWS.splice(0,0,{COMMENT:"", DATE:anyMonthDate.getDate(), FORMAT_DATE:getFormatDate(anyMonthDate), FULL_DATE: anyMonthDate, DAY:anyMonthDate.getDay(), ANY_MONTH: true})
		d = anyMonthDate.getDay();
	}
	//последний день в сетке календаря должен заканчиваться воскресением
	var d = gr.ROWS[gr.ROWS.length-1].DAY;
	var anyMonthDate = new Date(gr.ROWS[gr.ROWS.length-1].FULL_DATE);
	//пока дата не воскресение, добавляем дни из следущего месяца
	while(d < 7){
		anyMonthDate.setDate(new Date(anyMonthDate).getDate()+1);
		gr.ROWS.push({COMMENT:"", DATE:anyMonthDate.getDate(), FORMAT_DATE:getFormatDate(anyMonthDate), FULL_DATE: anyMonthDate, DAY:anyMonthDate.getDay(), ANY_MONTH: true})
		if(anyMonthDate.getDay() == 0){d = 7;}else{d = anyMonthDate.getDay();}
	}

	gr.CURRENT_YEAR = currentYear;
	gr.CURRENT_MONTH = currentMonth;
	
	_.each(gr.ROWS, function(calendarRow){
		//добавление Пасхального календаря
		if(isPc){
			var pCal = _.find(sch.PASHA_CALENDAR, function(pc){
				return(pc.FORMAT_DATE === calendarRow.FORMAT_DATE);
			});
			if(pCal){
				if(calendarRow.COMMENT)
				{calendarRow.COMMENT = calendarRow.COMMENT+"; "+pCal.COMMENT||''}
				else{calendarRow.COMMENT = pCal.COMMENT||''};
				calendarRow.SERV_LIST = pCal.SERV_LIST;
				//Воскресные дни выделяем как обязательные 
				//if(calendarRow.DAY == 7){calendarRow.HOLYDAY = true;}
				//else{calendarRow.HOLYDAY = pCal.HOLYDAY;}
				calendarRow.HOLYDAY = pCal.HOLYDAY;
				calendarRow.NOT_ADD_SRVS = pCal.NOT_ADD_SRVS;
			}
		}
		//добавление пользовательского календаря
		if(isUc){
			var usCal = _.find(sch.USER_CALENDAR, function(uc){
				return(currentYear+'-'+uc.FORMAT_DATE === calendarRow.FORMAT_DATE);
			});
			if(usCal){
				if(calendarRow.COMMENT)
				{calendarRow.COMMENT = calendarRow.COMMENT+"; "+usCal.COMMENT||''}
				else{calendarRow.COMMENT = usCal.COMMENT||''};
				calendarRow.COMMENT_LIST = usCal.COMMENT_LIST;
				calendarRow.SERV_LIST = usCal.SERV_LIST;
				calendarRow.HOLYDAY = calendarRow.HOLYDAY||usCal.HOLYDAY;
				calendarRow.NOT_ADD_SRVS = usCal.NOT_ADD_SRVS;
			}
		}
		//добавление журнала/расписания
		var jRow = _.find(sch.JORNAL_ROWS, function(jr){
			return(jr.FORMAT_DATE === calendarRow.FORMAT_DATE);
		});
		if(jRow){
			//перебиваем значения на значения из журнала 
			calendarRow.IS_ARHIVE = jRow.IS_ARHIVE;
			calendarRow.SERV_LIST = jRow.SERV_LIST;
			calendarRow.COMMENT = jRow.COMMENT;
			calendarRow.SELECTED_LESSON_CNT = jRow.SELECTED_LESSON_CNT;
		}
		
	});
	
	return gr;
};


Date.prototype.daysInMonth = function() {
		return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

//календарь на месяц
function getMonthCalendar(year,month){
	//первая дата месяца
	var date = new Date(year,month); 
	//количество дней в месяце
	var cnt = date.daysInMonth(month);
	var calendar = {ROWS:[]};
	//первый день месяца
	var pDay = date.getDate();
	for(var i = 0; i < cnt;i++){
		var wDate = new Date(year, month, pDay+i);  
		// индекс дня недели
		var day = wDate.getDay();
		var comment = "";
		//"Воскресение." в сетке календаря на последнем месте
		if(wDate.getDay()==0){
			day = 7; 
			//comment = "Воскресение."
		};
			//calendar.ROWS.push({COMMENT:comment, DATE:wDate.getDate(), DATA:getDateAsString(wDate), DAY:day});
			calendar.ROWS.push({COMMENT:comment, DATE:wDate.getDate(), FORMAT_DATE:getFormatDate(wDate), FULL_DATE: wDate, DAY:day});
	}
	return calendar;
};
//получение случайного целого числа в заданном диапазоне
function rand (min, max){
	return Math.floor( Math.random() * (max - min + 1) ) + min;
};

//получить название месяца
function getMonthName(month){
	if(month == 12)return "Все";
	if(month == 0)return "январь";
	if(month == 1)return "февраль";
	if(month == 2)return "март";
	if(month == 3)return "апрель";
	if(month == 4)return "май";
	if(month == 5)return "июнь";
	if(month == 6)return "июль";
	if(month == 7)return "август";
	if(month == 8)return "сентябрь";
	if(month == 9)return "октябрь";
	if(month == 10)return "ноябрь";
	if(month == 11)return "декабрь";
};
//получить название месяца для календаря
function getMonthNameForDate(month){
	if(month == 0)return "января";
	if(month == 1)return "февраля";
	if(month == 2)return "марта";
	if(month == 3)return "апреля";
	if(month == 4)return "мая";
	if(month == 5)return "июня";
	if(month == 6)return "июля";
	if(month == 7)return "августа";
	if(month == 8)return "сентября";
	if(month == 9)return "октября";
	if(month == 10)return "ноября";
	if(month == 11)return "декабря";
};
//получить название дня недели
function getDayName(day){
	if(day == 1)return "Пн.";
	if(day == 2)return "Вт.";
	if(day == 3)return "Ср.";
	if(day == 4)return "Чт.";
	if(day == 5)return "Пт.";
	if(day == 6)return "Сб.";
	if(day == 7||day == 0)return "Вс.";
};
//время в милисекундах для сортировки
function getTimeMS(t){
  var sortDate = new Date('2000-01-01T10:'+t);               
  return sortDate.getTime();
};

//приведение даты к форматированному строковому виду
function getFormatDate(date){
	var arr = new Array;  
	arr[0] = date.getFullYear();
	arr[1] = date.getMonth()+1;
	arr[2] = date.getDate();
	if(arr[1].toString().length < 2) arr[1] = "0"+arr[1];
	if(arr[2].toString().length < 2) arr[2] = "0"+arr[2];
	return arr.join("-");
};
//приведение даты к читаемому виду
function getReadDate(date){
	var arr = new Array;  
	arr[2] = date.getFullYear();
	arr[1] = date.getMonth()+1;
	arr[0] = date.getDate();
	if(arr[1].toString().length < 2) arr[1] = "0"+arr[1];
	if(arr[0].toString().length < 2) arr[0] = "0"+arr[0];
	return arr.join(".");
};
//приведение даты к читаемому виду
function getReadDate1(date, onlyDay){
	var arr = new Array;  
	arr[2] = date.getFullYear().toString().substring(5,2);
	arr[1] = date.getMonth();
	arr[0] = date.getDate();
	arr[1] = getMonthNameForDate(arr[1]);
	if(onlyDay){return arr[0];}else{return arr.join(" ");}
};
//приведение даты к читаемому виду без года
function getReadDate2(date){
	var arr = new Array;  
	arr[1] = date.getMonth();
	arr[0] = date.getDate();
	arr[1] = getMonthNameForDate(arr[1]);
	return arr.join(" ");
};
//проверка типа "Дата"
function isDate (x){ 
  return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate); 
}
//получить дату из FORMAT_DATE
function formatDateToDate(parts_){
	var parts = parts_.split('-');
	// Please pay attention to the month (parts[1]); JavaScript counts months from 0:
	// January - 0, February - 1, etc.
	var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
	//console.log(mydate.toDateString());

	return mydate;
};
//получить число при изменении числа дней (cnt) относительно заданной даты (fDate)
function getCalcDate(fDate, cnt) {
    fDate = formatDateToDate(fDate);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time 
    const dateInMs = fDate.getTime() + cnt*oneDay;

    const date = new Date(dateInMs)
    return getFormatDate(date);
}
//разница в днях между двумя датами
function getNumberOfDays(start, end) {
    const date1 = formatDateToDate(start);
    const date2 = formatDateToDate(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
	};

	
	

	
	
	
	//получение следующего кода
function getNextCode(list, fieldName){
	var maxCode, nextCode;
	if(fieldName){
		maxCode = parseInt(_.max(list, function(row){ return parseInt(row[fieldName]); })[fieldName]);
	}else{
		maxCode = parseInt(_.max(list, function(row){ return parseInt(row.CODE); }).CODE);
	}
	if(!maxCode)maxCode = 0;		
	nextCode = maxCode +1;
	return parseInt(nextCode);
};
//первую букву делаем заглавной
function ucFirst(str) {
  // только пустая строка в логическом контексте даст false
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
};	
//соединение визуальной модели с данными
function bindModelInput(obj, property, domElem) {
	if(obj && property && domElem)Object.defineProperty(obj, property, {
		get: function() { if(domElem){return domElem.value;}else{return 0;} }, 
		set: function(newValue) { if(domElem){domElem.value = newValue;} },
		configurable: true
	});
};
function bindModelCheck(obj, property, domElem) {
	Object.defineProperty(obj, property, {
		get: function() { return domElem.checked; }, 
		set: function(newChecked) { domElem.checked = newChecked; },
		configurable: true
	});
};
function bindModeDate(obj, property, domElem) {
	Object.defineProperty(obj, property, {
		get: function() { return domElem.value; }, 
		set: function(newValue) { domElem.value = newValue; },
		configurable: true
	});
};
//получить выделенную строку чекбокса
function getSelected(obj,code){
	if(obj == code)return "selected";
};



	function addInnerForm(form_id, form_code, params){
		//console.log(sch.Forms[sch.currentFormId]);
		sch.Forms[sch.currentFormId].innerForms = sch.Forms[sch.currentFormId].innerForms||[];
		sch.Forms[sch.currentFormId].innerForms.push({formId: form_id, formCode: form_code, params: params});
		return form_id;
	};
	
 //получить значения для строки 
function getRow(row, fieldName){
	if(row){
		if(row.ANY_MONTH){
			if(fieldName == "DATE"){
				return row[fieldName];
			}else{
				return "any-month";
			}
		}else{
			if(fieldName == "SELECTED"){
				//console.log(row);
/* 				if(row.SELECTED && row.HOLYDAY){
					return "selected holyday";
				}
 */				if(row.SELECTED && !row.HOLYDAY){
					return "selected";
				}
				if(!row.SELECTED && row.HOLYDAY){
					return "holyday";
				}
				if(!row.HOLYDAY && !row.SELECTED){
						return "work-day";
				}
				
			}
			if(fieldName == "DATA"){
				return row.DATA;
			}else{
				return row[fieldName];
			}
		}
	}else{
		if(fieldName == "SELECTED"){
			return "any-month";
		}else{
			return null;
		}
	}/**/
};
//список классов
function getActive(active){
	if(active) return "selected";
};
	//function addAction(type, data, source, sourceName, action){
	function addAction(type, data, source, action){
		var id, num;
		num = getNextCode(sch.Forms[sch.currentFormId].actions, "num");
		sch.Forms[sch.currentFormId].actions = sch.Forms[sch.currentFormId].actions||[];
		if((type == "button")||(type == "text")||(type == "check")){
			id = sch.currentFormId+'-'+num;
			//console.log(sch.Forms[sch.currentFormId]);if()
			sch.Forms[sch.currentFormId].actions.push({type: type, data: data, sourceName: source, action: action, id: id, num: num});
		}else{
			id = sch.currentFormId+'-'+num;
			//console.log(sch.Forms[sch.currentFormId]);if()
			sch.Forms[sch.currentFormId].actions.push({type: type, id: id, num: num});			
		}
/* 		if(type == "row"){
			//source - ид таблицы
			id = sch.currentFormId+'-'+source+'-'+num;
			sch.Forms[sch.currentFormId].actions.push({type: type, data: data[sourceName], source: source, action: action, id: id, num: num});
		}
		if(type == "list"){
			//source - ид таблицы
			id = sch.currentFormId+'-'+source;
			sch.Forms[sch.currentFormId].actions.push({type: type, data: data, source: source, sourceName: sourceName, id: id});
		}
 */		return id;
	};
//вычисляем индекс массива по его коду или иному атрубуту
function getIndx(arr, value, valueName){
	var indx;
	_.each(arr, function(row, i){
		if(valueName){
			if(row[valueName] == value){indx = i;}
		}else{
			if(row.CODE == value){indx = i;}
		}
	});
	return indx;
};
//получить название дня недели
function getDayName(day){
	if(day == 1)return "Пн.";
	if(day == 2)return "Вт.";
	if(day == 3)return "Ср.";
	if(day == 4)return "Чт.";
	if(day == 5)return "Пт.";
	if(day == 6)return "Сб.";
	if(day == 7||day == 0)return "Вс.";
};
/* //получение отдельной копии объекта
function deepCopy(obj){
	return JSON.parse(JSON.stringify(obj));
};
 */
//получение родителя для объекта
function getParent(data_, subData_, parentData_){
	var nObj = "";
	var resp = false;
	if(data_){
		if(JSON.stringify(data_)==JSON.stringify(subData_)){
			resp = parentData_||{};
		}else{
			if(typeof(data_) == "object"){
				try {
					Object.getOwnPropertyNames(data_).forEach(function(val, idx, array) {
						resp = getParent(data_[val], subData_, data_);
						if(resp){
						  throw {
							response: resp
						  }
						}
					});	
				} catch (err){}	
			}
		}
	}
	return resp;
};
function addPath(data_, path_){
	
	var nObj = "";
	var path = path_;
	var fd;
	if(data_){
		if((typeof data_ == "object")){
			if(Array.isArray(data_)){
				nObj =[];
			}else{
				nObj ={};
			}
			$.each(data_, function(key, d){
				nObj[key] = deepCopy(addPath(d, path_+"."+key));
				//console.log(key);
				nObj[key].path = path_;
			});
			nObj.path = path_;
				//console.log(data);
				//console.log(path);
		}else{
			nObj = data_;
			nObj.path = path_;
		}		
	}
	return nObj;
};

//сделать активной строку в панели управления
function setActiveRow(panelData, id){
	setAllUnActive(panelData.ROWS);
	_.each(panelData.ROWS, function(row){
		if(row.ACTION == id){
			row.ACTIVE = true;
		}
	});	
};
 //снимаем признак активноти со всех строк
function setAllUnActive(arr){
	_.each(arr, function(row){
		row.ACTIVE = false;
	});
};
 //устанавливаем признак активноти на строку
function setActive(arr, actRow){
	_.each(arr, function(row){
		row.ACTIVE = false;
	});
	arr[_.indexOf(arr, actRow)].ACTIVE = true;
};
