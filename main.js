function panel() {
	var $panel = $('#menu');
	if ($panel.length) {
		var $push = $panel.children('#push');
		var showPanel = function() {
			$panel.animate({top: '+=30',
                }, 200, function() {
                    $(this).addClass('visible');
                });
				$push.empty();
				$push.append('&#9650;');
		};
		var hidePanel = function() {
			$panel.animate({
                    top: '-=30',
                }, 200, function() {
                    $(this).removeClass('visible');
                });
				$push.empty();
				$push.append('&#9660;');
		};
		$push.click(function() {
			if ($panel.hasClass('visible')) {hidePanel()} else {showPanel()}
		}).andSelf();
	}
};

function marker() {
	$('td.ui-datepicker-today').addClass('selected');
	for (var i=0; i<localStorage.length; i++) {
		var key = localStorage.key(i);
		var item_year = key[4] + key[5] + key[6] + key[7];
		var year = $('.ui-datepicker-year').html();
		if (item_year == year) {
			var item_month = key[2] + key[3];
			var month = $('td.coming').attr('data-month')*1 + 1;
			if(item_month == month){
				var item_day = key[0] + key[1];
				for(var n=1; n < 7; n++){
					var d = $("table tr:eq("+n+") td:eq(0)").html();
					if(d !== undefined){
						for(d = 0; d < 7 ; d++){
							var day = $("table tr:eq("+n+") td:eq("+d+")").html();
							day < 10 ? day = '0' + day : day;
							if (item_day == day) {
								$("table tr:eq("+n+") td:eq("+d+")").addClass('subject');
							};
						};
					};
				};
			};
		};
	};	
};

function select() {
	$('td').removeClass('selected');
	$(this).addClass('selected');
	get_event();
};

function form(title) {
    clear_form();s_hour();s_min();t_long();l_end();
	$('select[name="s_hour"], select[name="s_min"], select[name="s_long"]').change(function() {l_end();});
	title ? title : title = 'Добавить лекцию';
	$('div.title').html(title);
	if ($('.conteiner').css('display') == 'none') {$('.conteiner').css('display','block')} else $('.conteiner').css('display','none');
	var d = $('td.selected').html();
	var m = ($('td.selected').attr('data-month') * 1) + 1;
	var y = $('td.selected').attr('data-year');
	var out = m + ' ' + d + ' ' + y;
	$('td').hasClass('selected') ? set_date(out) : set_date();
};

function set_date(value) {
	var date;
	value = value || 0;
	value == 0 ? date = new Date() : date = new Date(value);
	var number =  date.getDate();
	number < 10 ? number = '0' + number : number;
	var month = date.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var year = date.getFullYear();
	var out = number + '.' + month + '.' + year;
	$('.set_date').html(out);
};

function clear_form(){
	$('input[name="name"]').val('');
	$('input[name="speaker"]').val('');
	$('textarea[name="note"]').val('');
};

function s_hour() {
	for(var i=0; i<=23; i++){
		if (i == 8) {$('select[name="s_hour"]').append('<option selected>0' + i)
		} else {i < 10 ? $('select[name="s_hour"]').append('<option>0' + i) : $('select[name="s_hour"]').append('<option>' + i)}};
};

function s_min() {
	for(var i=0; i<59; i=i+5){i < 10 ? $('select[name="s_min"]').append('<option>0' + i) : $('select[name="s_min"]').append('<option>' + i)};
};

function t_long() {
	for(var i = 0; i <= 120; i = i + 10){
		if (i == 40) {$('select[name="s_long"]').append('<option selected>' + i)
		} else {i < 10 ? $('select[name="s_long"]').append('<option>0' + i) : $('select[name="s_long"]').append('<option>' + i)}
		};
};

function l_end() {
	$('.set_time').html('');
	var hour, res, min, out;
	res = ($("select[name='s_hour']").val() * 60) + ($("select[name='s_min']").val() * 1) + ($("select[name='s_long']").val() * 1); // может быть ошибка 
	hour = res / 60 | 0;
	min = res % 60;
	hour < 10 ? hour = '0' + hour : hour;
	min < 10 ? min = '0' + min : min;
	out = hour + ':' + min;
	$('.set_time').html(out);
};

function cform() {
	if ($('.clear').css('display') == 'none') {$('.clear').fadeIn(300)} else $('.clear').fadeOut(300);
};

function add() {
	$('.selected').addClass('subject');
	var date = $('.set_date').html();
	var s_time = $('select[name="s_hour"]').val() + ':' + $('select[name="s_min"]').val();
	var length = $('select[name="s_long"]').val();
	var e_time = $('.set_time').html();
	var time = s_time + ' - ' + e_time;
	var name = $('input[name="name"]').val();
	var speaker = $('input[name="speaker"]').val();
	var note = $('textarea[name="note"]').val();
	var key = date.replace(/\./g,'') + s_time.replace(':','');
	var lesson = '{"date":"'+date+'","time":"'+time+'","name":"'+name+'","speaker":"'+speaker+'","s_time":"'+s_time+'","length":"'+length+'","note":"'+note+'"}';
	localStorage.setItem(key, lesson);
	$('.messeng').html('Запись добавлена!');
	$('input[name="name"]').val('');
	$('input[name="speaker"]').val('').fadeIn();
	$('textarea[name="note"]').val('');
	get_event();
};

function edit(){
    form('Редактировать');
	var key = $('div.edit').parent().attr('key');
	var item = localStorage[key];
	item = $.parseJSON(item);
	$('.set_date').html(item['date']); 
	$('input[name="name"]').val(item['name']);
	$('input[name="speaker"]').val(item['speaker']);
	var s_time = item['s_time'];
	$('select[name="s_hour"]').val(s_time[0]+s_time[1]).attr('disabled', true);
	$('select[name="s_min"]').val(s_time[3]+s_time[4]).attr('disabled', true);
	$('textarea[name="note"]').val(item['note']);
	$('select[name="s_long"]').val(item['length']);
	l_end();
};

function del_one(){
	var key = $('div.del_one').parent().attr('key');
	localStorage.removeItem(key);
	$('td').removeClass('subject');
	marker();
	get_event();
};

function del() {
	var v = $('input[name="clr"]').serialize();
	switch (v) {
		case  'clr=day':
			var d = $('td.selected').html();
			d < 10 ? d = '0' + d : d;
			for (var i=0; i<localStorage.length; i++) {
				var day_key = localStorage.key(i);
				var dkey = day_key[0] + day_key[1]; 
				if(d == dkey){localStorage.removeItem(day_key); $('td.selected').removeClass('subject')}
				};break
		case  'clr=all': 
				localStorage.clear();
				$('td').removeClass('subject');
			break
		default: 
			alert('error');
		break
	}
	get_event();
	cform();
};

function get_event() {
    $('.schedule').fadeOut(400);
	setTimeout(function(){
		$('.schedule').html('');
		if ($('.selected').hasClass("subject")) {
		var d = $('.selected').html();
		d < 10 ? d = '0' + d : d;
		var m = $('.selected').attr('data-month');
		var y = $('.selected').attr('data-year');
		var den = new Date(y,m,d).getDay();
		switch(den)
			{
				case 0:den="Воскресенье";break;
				case 1:den="Понедельник";break;
				case 2:den="Вторник";break;
				case 3:den="Среда";break;
				case 4:den="Четверг";break;
				case 5:den="Пятница";break;
				case 6:den="Суббота";break;}
		var head = '<div class="day"><div class="get_den">'+den+'</div><div class="get_den2">'+d+'.'+(m*1+1)+'.'+y+' г.</div></div>';
		var menu = '<div class="edit">Редактировать</div><div class="del_one">Удалить</div>';
		$('.schedule').html(head);	
		
		for (var i=0; i<localStorage.length; i++) {
			var key = localStorage.key(i);
			var date_key = key[0] + key[1] + key[2] + key[3] + key[4] + key[5] + key[6] + key[7];
			var date_k = ''+d+''+(m*1 + 1)+''+y;
			if(date_key == date_k){
				var item = localStorage[key];
				item = $.parseJSON(item);
				var out = '<div class="lesson" key="'+key+'"><div class="get_time">'+item.time+'<br />'+item.length+' мин.</div><div class="info"><b>'+item.name+'</b><br />'+item.speaker+'<br /><i>'+item.note+'</i></div>'+menu+'</div>';
				$('.schedule').append(out);
			};
		};
		$('.schedule').fadeIn(400);
		$('.del_one').click(function() {del_one();});
		$('.edit').click(function() {edit();});
	};
		
		},400);
};

function schedule() {
	$('.schedule').html('');
	for (var i=0; i<localStorage.length; i++) {
			var key = localStorage.key(i);
			var item = localStorage[key];
			item = $.parseJSON(item);
			var key_moth = key[2]+key[3];
			var current_month = $('.ui-datepicker-month').attr('month');
			if (key_moth == current_month){
				var present = true;
				var d = key[0]+key[1];
				var m = current_month*1-1;
				var y = $('.ui-datepicker-year').attr('year');
				var den = new Date(y,m,d).getDay();
				switch(den)
					{
						case 0:den="Воскресенье";break;
						case 1:den="Понедельник";break;
						case 2:den="Вторник";break;
						case 3:den="Среда";break;
						case 4:den="Четверг";break;
						case 5:den="Пятница";break;
						case 6:den="Суббота";break;}
				var head = '<div class="day"><div class="get_den">'+den+'</div><div class="get_den2">'+d+'.'+m+'.'+y+' г.</div></div>';
				var out = '<div class="lesson"><div class="get_time">'+item.time+'<br />'+item.length+' мин.</div><div class="info"><b>'+item.name+'</b><br />'+item.speaker+'<br /><i>'+item.note+'</i></div></div>';
				if($('.schedule').html() == ''){var last_key = d; $('.schedule').html(head)};
				if(d == last_key){$('.schedule').append(out)} else {var last_key = d; $('.schedule').append(head);$('.schedule').append(out)};
			};
	};
	present ? $('.schedule').fadeIn(400) : $('.schedule').fadeIn(400).html('<h2>В этом месяце занятий нет!</h2>');
};

function expo() {
	$('textarea[name="expo"]').html('');
	for (var i=0, str = '{'; i<localStorage.length; i++) {
		var key = localStorage.key(i);
		var item = localStorage[key];
		item = $.parseJSON(item);
		var out = {"key":key, "item":item};
		str = str + '"n' + i + '"' + ':' + JSON.stringify(out) + ',';
	};
	str = str.substring(0, str.length - 1);
	str = str + '}';
	$('textarea[name="expo"]').append(str);
};

function impo() {
	var enter = $('textarea[name="expo"]').val();
	var str = $.parseJSON(enter);
	for(var a in str){
		var k = str[a].key;
		var i = JSON.stringify(str[a].item);
		console.log(i);
		localStorage.setItem(k,i);};
	marker();
	$('.messeng').html('Запись добавлена!').fadeIn(800).delay(800).fadeOut(800);
};

/* Выполнение */
jQuery(document).ready(function($){
	panel();
	$.datepicker.setDefaults($.extend($.datepicker.regional["ru"]));
	$('#calendar').datepicker();
	$('.add').click(add);
	$('li.form_add').click(function() {form();});
	$('li.form_clear').click(cform);
	$('.del').click(del);
	$('.close').click(function() {$(this).parent().fadeOut(300);});
	$('li.form_export').click(function() {if ($('.expo').css('display') == 'none') {$('.expo').css('display','block')} else $('.expo').css('display','none');})
	$('.export').click(expo);
	$('.import').click(impo);
	$('.rasp').click(function() {$('.ui-datepicker-calendar').fadeOut(400); schedule();});
	$('.clndr').click(function() {$('.schedule').fadeOut(400); $('.ui-datepicker-calendar').fadeIn(400); marker();});
	$('td').click(select);
	marker();
})(jQuery);