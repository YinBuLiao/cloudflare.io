var MusicApi = 'https://api.bikamoe.com/api/v2/music.php?id=',
PlayListApi = 'https://api.bikamoe.com/api/v2/playlist.php?id=',
LyricApi = 'https://api.bikamoe.com/api/lyric.php?id=',
isEchoContent = false,
isEchoListContent = false,
autoplay = false,
PlayOrder = 2,
scid = false,
isMove = false,
PlayList,
Musics,
Lrcline,
Lrctime = [],
TipsTime,
TipsShow,
audio = new Audio;

if(PlayOrder == 1 || PlayOrder == 3){
    var MusicId;
}

$(function(){
    console.log( "%cFlxPlayer%c Powered by FlxSNX <211154860@qq.com>", 'font-family:"微软雅黑";color:#ff5f53;font-size:40px;text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);','font-size:14px;color:#666;font-family: "微软雅黑";');
    $('body').append(
        '<div class="FlxPlayer">'+
            '<div class="FlxPlayerTips"></div>'+
            '<div class="FlxPlayerContent">'+
                '<div class="FlxPlayerInfo">'+
                    '<span id="Fminfo-1"><i class="fa fa-music"></i> Loading...</span>'+
                    '<span id="Fminfo-3"><i class="fa fa-clock-o"></i> 00:00/00:00</span>'+
                    '<span id="Fminfo-4"><i class="fa fa-times-circle"></i> 暂无歌词</span>'+
                '</div>'+
                '<div class="FlxPlayerImage"></div>'+
                '<div class="FlxPlayerTool">'+
                    '<i class="fa fa-volume-up"></i><i class="fa fa-random"></i><i class="fa fa-toggle-on"></i><i class="fa fa-backward"></i><i class="fa fa-play"></i><i class="fa fa-forward"></i><i class="fa fa-bars"></i>'+
                '</div>'+
                '<div class="FlxPlayerJDT"><div class="t"><div class="circular"></div></div></div>'+
            '</div>'+
            '<div class="FlxPlayerReturn"><i class="fa fa-chevron-right"></i></div>'+
            '<div class="FlxPlayerList">'+
                '<div class="FlxPlayerListTitle">音乐列表</div>'+
                '<div class="FlxPlayerListContent"><ul></ul></div>'+
            '</div>'+
            '<div class="lyric"><ul></ul></div>'+
        '</div>'
    );

    $('.FlxPlayerTool i').eq(0).hide();
    $('.FlxPlayerTool i').eq(1).hide();

    $('.FlxPlayerReturn').click(function(){
        if(isEchoContent == true){
            $('.FlxPlayerReturn .fa-chevron-right').css({
                '-webkit-transform':'rotate(0deg)',
                '-moz-transform':'rotate(0deg)',
                '-ms-transform':'rotate(0deg)',
                'transform':'rotate(0deg)',
            });
            $('.FlxPlayer').css('left','-290px');
            if(isEchoListContent == true){
                setTimeout(function(){
                    $('.FlxPlayer').css('bottom','90px');
                    $('.FlxPlayerList').css('height','0px');
                    isEchoListContent = false;
                },600);
            }
            isEchoContent = false;
        }else{
            isEchoContent = true;
            $('.FlxPlayerReturn .fa-chevron-right').css({
                '-webkit-transform':'rotate(180deg)',
                '-moz-transform':'rotate(180deg)',
                '-ms-transform':'rotate(180deg)',
                'transform':'rotate(180deg)'
            });
            $('.FlxPlayer').css('left','0');
        }
    });

    $('.FlxPlayerTool i').eq(3).click(function(){
        $(".FlxPlayer audio").trigger("pause");
        scid = PlayMusic();
    });

    $('.FlxPlayerTool i').eq(4).click(function(){
        if(audio.paused == true){
            audio.play();
            $('.FlxPlayerTool .fa-play').attr('class','fa fa-pause');
        }else{
            audio.pause();
            $('.FlxPlayerTool .fa-pause').attr('class','fa fa-play');
        }
    });

    $('.FlxPlayerTool i').eq(5).click(function(){
        $(".FlxPlayer audio").trigger("pause");
        scid = PlayMusic();
    });

    $('.FlxPlayerTool i').eq(2).click(function(){
        if($('.lyric').css('height') == '30px'){
            $('.lyric').addClass('off');
            $('.FlxPlayerTool .fa-toggle-on').attr('class','fa fa-toggle-off');
            $('#Fminfo-4').html('<i class="fa fa-times-circle"></i> 歌词关闭');
            Tips('歌词已关闭','time');
        }else{
            $('.lyric').removeClass('off');
            $('.FlxPlayerTool .fa-toggle-off').attr('class','fa fa-toggle-on');
            $('#Fminfo-4').html('<i class="fa fa-check-circle"></i> 歌词开启');
            Tips('歌词已开启','time');
        }
    });

    $('.FlxPlayerTool i').eq(6).click(function(){
        if(isEchoListContent == true){
            $('.FlxPlayerList').css('height','0px');
            isEchoListContent = false;
        }else{
            isEchoListContent = true;
            $('.FlxPlayerList').css('height','260px');
        }
    });

    $('.FlxPlayerJDT .circular').mousedown(function(e){
        isMove = true;
        $('.FlxPlayer').mousemove(function(e){
            if(isMove == true){
                $('.FlxPlayerJDT .circular').css({"left":e.pageX});
                if(e.pageX >= 280){
                    $('.FlxPlayerJDT .circular').css({"left":280});
                }else if(e.pageX <= 0){
                    $('.FlxPlayerJDT .circular').css({"left":0});
                }
            }
        })
        $(document).mouseup(function(){
            if(isMove == true){
                isMove = false;
                audio.currentTime = ($('.FlxPlayerJDT .circular').offset().left) / 280 * audio.duration;
            }
        });
    });

    audio.ontimeupdate = function(){
        $('#Fminfo-3').html('<i class="fa fa-clock-o"></i> '+MusicTime(audio.currentTime)+'/'+MusicTime(audio.duration));
        if(isMove == false){
            $('.FlxPlayerJDT .circular').css('left',(audio.currentTime/audio.duration) * 280);
        }
        songtime = audio.currentTime;
        if (Lrctime[Lrcline]<=audio.currentTime){
            console.log(audio.currentTime);
            $('.lyric ul').css('transform','translateY('+(Lrcline*-30)+'px)');
            $('.lyric ul li').eq(Lrcline).addClass('on').siblings().removeClass('on');
            Lrcline++;
        }
    };

    audio.onended = function(){
        if(audio.ended == true){
            PlayMusic();
        }
    };

    PlayList = $('#FlxPlayer').attr('PlayListID');
    $.ajax({
        type : "GET",
        url : PlayListApi+PlayList,
        dataType:'json',
        success : function(data) {
            if(data.code == 1){
                Musics = data.list;
                console.log(data.list);
                $.each(Musics,function(index,item){
                    $('.FlxPlayerListContent ul').append('<li><span>'+(index+1)+'</span>'+item.name+'</li>')
                });
                $('.FlxPlayerListContent ul li').click(function(){
                    audio.pause();
                    PlayMusic($(this).index());
                });
                PlayMusic();
                var firstplaypause = setInterval(function(){
                    if(audio.paused == true){
                        $('.FlxPlayerTool .fa-pause').attr('class','fa fa-play');
                        setTimeout(function(){clearInterval(firstplaypause);},1000);
                    }
                },1000);
            }
        }
    });
});

function MusicTime(time){
    time = Math.round(time);
	var y = time % 60;
	var h = (time - y) / 60;
	var m = time - h*60;
	if(m < 10){
		m = '0'+m;
	}
	if(h < 10){
		h = '0'+h;
	}
	var time = h+':'+m;
	return time;
}

function PlayMusic(index=false){
    if(index!==false){
        console.log("歌曲ID:"+index+"上一首ID:"+scid);
        if(PlayOrder == 1)MusicId = index+1;
        $('.FlxPlayerListContent ul li').eq(index).addClass('playing').siblings().removeClass('playing');
        var id = Musics[index].id;
        scid = index;
        $.ajax({
			type : "GET",
			url : MusicApi+id,
			dataType:'json',
			success : function(data) {
				if(data){
					if(data.mp3url == null){
						console.log("获取歌曲失败 ID:"+id);
						PlayMusic();
					}
					audio.src = data.mp3url;
					$(".FlxPlayerImage").css("background-image",'url('+data.picurl+"?param=100x100)");
                    audio.play();
                    Tips('开始播放音乐 - ' + data.name,'time');
					$('.FlxPlayerTool .fa-play').attr('class','fa fa-pause');
                    $('#Fminfo-1').html('<i class="fa fa-music"></i> '+ data.name + ' - ' + data.author);
                    $('#Fminfo-3').html('<i class="fa fa-clock-o"></i> 00:00/'+MusicTime(audio.duration));
				}else{
					console.log("获取歌曲失败 ID:"+id);
				}
			}
		});
		var html = '';
		var i = 0;
		Lrcline = 0;
		Lrctime = [];
		$.ajax({
			type : "GET",
			url : LyricApi+id,
			dataType:'json',
			success : function(data) {
				if(data){
                    $('#Fminfo-4').html('<i class="fa fa-check-circle"></i> 歌词开启');
					$.each(data,function(key,value){
						Lrctime[i] = parseFloat(key.substr(1,3)) * 60 + parseFloat(key.substring(3,10));
						html += '<li>'+value+'</li>';
						$('.lyric ul').html(html);
						i++;
					});
					console.log(Lrctime);
				}
			}
        });
        return;
    }
    if(PlayOrder == 1){
        if(MusicId === 0 || MusicId >= 0){
            MusicId++;
        }else{
            MusicId = 0;
        }
        if(MusicId > Musics.length){
            MusicId = 0;
        }
        var id = Musics[MusicId].id;
        $('.FlxPlayerListContent ul li').eq(MusicId).addClass('playing').siblings().removeClass('playing');
        console.log("歌曲ID:"+id+"上一首ID:"+scid);
        scid = MusicId;
        $.ajax({
			type : "GET",
			url : MusicApi+id,
			dataType:'json',
			success : function(data) {
				if(data){
					if(data.mp3url == null){
						console.log("获取歌曲失败 ID:"+id);
						PlayMusic();
					}
					audio.src = data.mp3url;
					$(".FlxPlayerImage").css("background-image",'url('+data.picurl+"?param=100x100)");
                    audio.play();
                    Tips('开始播放音乐 - ' + data.name,'time');
					$('.FlxPlayerTool .fa-play').attr('class','fa fa-pause');
                    $('#Fminfo-1').html('<i class="fa fa-music"></i> '+data.name + ' - ' + data.author);
                    $('#Fminfo-3').html('<i class="fa fa-clock-o"></i> 00:00/'+MusicTime(audio.duration));
				}else{
					console.log("获取歌曲失败 ID:"+id);
				}
			}
		});
		var html = '';
		var i = 0;
		Lrcline = 0;
		Lrctime = [];
		$.ajax({
			type : "GET",
			url : LyricApi+id,
			dataType:'json',
			success : function(data) {
				if(data){
                    $('#Fminfo-4').html('<i class="fa fa-check-circle"></i> 歌词开启');
					$.each(data,function(key,value){
						Lrctime[i] = parseFloat(key.substr(1,3)) * 60 + parseFloat(key.substring(3,10));
						html += '<li>'+value+'</li>';
						$('.lyric ul').html(html);
						i++;
					});
					console.log(Lrctime);
				}
			}
		});
    }else if(PlayOrder == 2){
		var smid = Math.floor(Math.random()*(Musics.length));//随机播放用的参数
		console.log("随机ID:"+smid+"上一首ID:"+scid);
        if(scid == smid && musics == 2){
            if(smid != musics - 1){
                smid = smid + 1;
            }else{
                smid = smid - 1;
            }
        }else if(scid == smid && musics > 2){
            if(smid != musics){
                smid = smid + 1;
            }else{
                smid = smid - 1;
            }
        }
        $('.FlxPlayerListContent ul li').eq(smid).addClass('playing').siblings().removeClass('playing');
        var id = Musics[smid].id;
        scid = smid;
		$.ajax({
			type : "GET",
			url : MusicApi+id,
			dataType:'json',
			success : function(data) {
				if(data){
					if(data.mp3url == null){
                        console.log("获取歌曲失败 ID:"+id);
                        Tips('获取歌曲失败,自动播放下一首','time');
						PlayMusic();
					}
					audio.src = data.mp3url;
					$(".FlxPlayerImage").css("background-image",'url('+data.picurl+"?param=100x100)");
                    audio.play();
                    Tips('开始播放音乐 - ' + data.name,'time');
					$('.FlxPlayerTool .fa-play').attr('class','fa fa-pause');
                    $('#Fminfo-1').html('<i class="fa fa-music"></i> '+data.name + ' - ' + data.author);
                    $('#Fminfo-3').html('<i class="fa fa-clock-o"></i> 00:00/'+MusicTime(audio.duration));
				}else{
					console.log("获取歌曲失败 ID:"+id);
				}
			}
		});
		var html = '';
		var i = 0;
		Lrcline = 0;
		Lrctime = [];
		$.ajax({
			type : "GET",
			url : LyricApi+id,
			dataType:'json',
			success : function(data) {
				if(data){
                    $('#Fminfo-4').html('<i class="fa fa-check-circle"></i> 歌词开启');
					$.each(data,function(key,value){
						Lrctime[i] = parseFloat(key.substr(1,3)) * 60 + parseFloat(key.substring(3,10));
						html += '<li>'+value+'</li>';
						$('.lyric ul').html(html);
						i++;
					});
					console.log(Lrctime);
				}
			}
		});
	}
}

function PlayForId(id){
	console.log("指定ID播放:"+id);
	$.ajax({
		type : "GET",
		url : MusicApi+id,
		dataType:'json',
		success : function(data) {
			if(data){
				if(data.mp3url == null){
                    console.log("获取歌曲失败 ID:"+id);
                    PlayMusic();
                }
                audio.src = data.mp3url;
                $(".FlxPlayerImage").css("background-image",'url('+data.picurl+"?param=100x100)");
                audio.play();
                $('.FlxPlayerTool .fa-play').attr('class','fa fa-pause');
                $('#Fminfo-1').html('<i class="fa fa-music"></i> '+data.name + ' - ' + data.author);
                $('#Fminfo-3').html('<i class="fa fa-clock-o"></i> 00:00/'+MusicTime(audio.duration));
			}else{
				console.log("获取歌曲失败 ID:"+id);
			}
		}
    });
    var html = '';
    var i = 0;
    Lrcline = 0;
    Lrctime = [];
    $.ajax({
        type : "GET",
        url : LyricApi+id,
        dataType:'json',
        success : function(data) {
            if(data){
                $('#Fminfo-4').html('<i class="fa fa-check-circle"></i> 歌词开启');
                $.each(data,function(key,value){
                    Lrctime[i] = parseFloat(key.substr(1,3)) * 60 + parseFloat(key.substring(3,10));
                    html += '<li>'+value+'</li>';
                    $('.lyric ul').html(html);
                    i++;
                });
                console.log(Lrctime);
            }
        }
    });
}

function Tips(text,type='show',time=3000){
    if(type == 'show'){
        $('.FlxPlayerTips').html(text).addClass('show');
    }else if(type == 'time'){
        if(TipsShow == 1){
            $('.FlxPlayerTips').html(text);
            TipsShow = 0;
            clearTimeout(TipsTime);
        }
        $('.FlxPlayerTips').html(text).addClass('show');
        TipsShow = 1;
        TipsTime = setTimeout(function(){
            $('.FlxPlayerTips').removeClass('show');
            TipsShow = 0;
            clearTimeout(TipsTime);
        },time);
        console.log(TipsTime);
    }else if(type == 'hide'){
        $('.FlxPlayerTips').removeClass('show');
    }
}
