$ = jQuery;
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
			{calendarRow.COMMENT = calendarRow.COMMENT+"; "+pCal.COMMENT}
			else{calendarRow.COMMENT = pCal.COMMENT};
			calendarRow.HOLYDAY = true;
		}
		}
		//добавление пользовательского календаря
		if(isUc){
			var usCal = _.find(sch.USER_CALENDAR, function(uc){
				return(currentYear+'-'+uc.FORMAT_DATE === calendarRow.FORMAT_DATE);
			});
			if(usCal){
				if(calendarRow.COMMENT)
				{calendarRow.COMMENT = calendarRow.COMMENT+"; "+usCal.COMMENT}
				else{calendarRow.COMMENT = usCal.COMMENT};
				calendarRow.COMMENT_LIST = usCal.COMMENT_LIST;
				calendarRow.HOLYDAY = true;
			}
		}
		//добавление журнала/расписания
		var jRow = _.find(sch.JORNAL_ROWS, function(jr){
			return(jr.FORMAT_DATE === calendarRow.FORMAT_DATE);
		});
		if(jRow){
			//перебиваем значения на значения из журнала
			calendarRow.SERV_LIST = jRow.SERV_LIST;
			calendarRow.COMMENT = jRow.COMMENT;
			calendarRow.SELECTED_LESSON_CNT = jRow.SELECTED_LESSON_CNT;
			//calendarRow.HOLYDAY = true;
			//console.log(jRow);
			//console.log(calendarRow);
		}
		
	});
	
	return gr;
};
