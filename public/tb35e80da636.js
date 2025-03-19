var	mobileDevice =	/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

config = {
	fallbackImage : 'data:image/png;base64,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',
	/*
		Time taken by animation to fade from 100% to 0% opacity at the start and the end of a clip
		Default: 400, value in millisecond (1000 = 1 second)
	*/
	fade:1000,
	/*
		Set the scale of animation and fallback. A scale of 0.5 divide the size by 2, A scale of 2 double the size
		Default: 1. You must set a scale value between 0.3 and 2
	*/
	scale:1,
	/*
	Set the path to the videos folder. Can be relative (to your domain url) or can be absolute
		Default: '/'. Please never use istripper links, you must host videos by yourself.
	*/
	path:'/new_poppings/',
	/*
		This is your affiliation link. Make sure to add at least ?s=YOUR_ID to get the referal.
		Default: 'https://www.istripper.com'
	*/
	outlink:'https://www.istripper.com/?',
	/*
		If true then it will display a little cross allowing the user to close the popping model.
		WARNING: Setting this to false can lead to a ban of your site by Google Ad Policy.
		Default: true
	*/
	close:{},
	/*
		If true, this will display a nice speech bubble with 'GET ME NOW' (customizable below) every 6 seconds on the girl
		Default: false
	*/
	bubble:false,
	/*
		! Only if bubble is set to true
		This customize the speech bubble text.
		Note that you should keep this sentence around 12 characters long.
		Default: 'GET ME NOW !'
	*/
	bubbleText:'GET ME NOW !',
	/*
		If set to 'left', this will disable animations requiring to be at the right of the screen
		This will force other animations to be placed at the left of the screen.
		Default: 'auto'. Values can be 'left' or 'auto'
		*/
	position:'auto',
	/*
		Set the fallback position on the screen.
		Default: 'center'. Values can be 'left','right' or 'center'
	*/
	fallbackPosition:'right',
	/*
		! Only if position is set to 'left' or fallbackPosition is not 'center'
		This set the offset between the left of the screen and the animation in pixel
		This also set the right or left offset for the fallback if fallbackPosition is set
		Default: 0 . Value is in pixel
	*/
	offset:0,

	/*
		Force the height of the fallback image in pixels
		Default: 223, Value must be between 100 and 223
	*/
	fallbackSize:223,
	/*
		If true, then instead displaying fallback image, it will exit the popping model.
		Default: false
	*/
	disableFallback:false,
	/*
		Same as above, but only if the user is on mobile
		Default: false
	*/
	disableFallbackMobile:false,
	/*
		Time in second of deactivation after clicking the close button
	*/
	disableTimeClose:0,
	/*
		Time in second of deactivation after clicking on the popping
	*/
	disableTimeClick:0,
}

let popping_function = function () {

var iterator=-1;
var video;
var ctx;
var randomAnims=[];

function init () {
	if(typeof(loadTool) !== "undefined" ) {
		const timeClose = localStorage.getItem("disabledTimeClose");
		const timeClick = localStorage.getItem("disabledTimeClick");

		if( (timeClose != null && ( (new Date().getTime() / 1000) - (parseInt(timeClose) + (loadTool.disableTimeClose != undefined ? loadTool.disableTimeClose : config.disableTimeClose)) <= 0)) ||
			(timeClick != null && ( (new Date().getTime() / 1000) - (parseInt(timeClick) + (loadTool.disableTimeClick != undefined ? loadTool.disableTimeClick : config.disableTimeClick)) <= 0))
		) {
		} else {

			let style = document.createElement('style');
			style.type= 'text/css';
			style.innerHTML += '@keyframes fadeIn { 0% { opacity: 0; }100% { opacity: 1; }}'
			style.innerHTML += '@keyframes fadeout { 0% { opacity: 1; }100% { opacity: 0; }}'
			style.innerHTML += '@keyframes TotemToolbounce { 0% {  margin-top:0; } 25% {  margin-top:-10px } 50% {  margin-top:0 } 75% {  margin-top:10px } 100% {  margin-top:0 }}'
			style.innerHTML += '@keyframes TotemToolFade { 0% {  opacity:0;  -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)" } 77% {  opacity:0;  -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0) } 80% {  opacity:1;  -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)" } 97% {  opacity:1;  -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)" } 100% {  opacity:0;  ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)" }}'

			document.getElementsByTagName('body')[0].append(style);
			video = document.createElement('video');
			video.autoplay = "autoplay";
			video.muted="muted";
			video.preload="none";
			video.crossOrigin="anonymous";
			video.style.maxWidth="100%";
			video.playsInline="playsinline";
			video.addEventListener('ended', play, false);
			let div = document.createElement("div");
			div.id = "basePopping";
			div.append(video);
			document.getElementsByTagName('body')[0].append(div);

			video.addEventListener('mousemove',function(event) {
				if( alpha(event,this)===0 ) {
					this.style.cursor = "initial";
				} else {
					this.style.cursor = "pointer";
				}
			})
			video.addEventListener('click', function handleMouseDown (event) {
				if(  alpha(event,this)===0 ) {
					this.style.pointerEvents = "none";
					this.parentNode.style.pointerEvents = "none";
					setTimeout(function(){
						video.style.pointerEvents = "auto";
						video.parentNode.style.pointerEvents = "auto";
					},1500)
				} else {
					let url = (loadTool.outlink ? loadTool.outlink : config.outlink);
					if(url.indexOf('%C%') > 1) {
						url = url.replace('%C%',loadTool.anims[iterator]['card'])
					}
					if(url.indexOf('%M%') > 1) {
						url = url.replace('%M%',"m"+loadTool.anims[iterator]['model'])
					}
					localStorage.setItem("disabledTimeClick",  new Date().getTime() / 1000);
					//console.log( (loadTool.disableTimeClick != undefined ? loadTool.disableTimeClick : config.disableTimeClick) )
					if ((loadTool.disableTimeClick != undefined ? loadTool.disableTimeClick : config.disableTimeClick) != 0) {
						document.getElementById("basePopping").remove();
					}
					window.open(url);

				  }
			});

			//Close button
			if((loadTool.close != undefined && loadTool.close != false) || config.close != false) {
				if ( loadTool.close == undefined ) { loadTool.close = {}}
				let cl;
				if ( document.getElementById('closebtn') == null) {
					cl = document.createElement('div');
					cl.innerHTML = 'X';
					cl.id="closebtn";
					cl.style.cssText = "position:absolute;bottom:0;font: small-caps "+ (loadTool.close.fontSize? loadTool.close.fontSize : 17) +"px / 17px Arial;box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px inset;width: 15px;height: 15px;z-index: 10002;margin: 0px;border-radius: 3px;text-align: center;display: flex;justify-content: center;align-items: center;";
					cl.style.color="white";
					cl.style.background = (loadTool.close.color ? loadTool.close.color : "rgba(0, 0, 0, 0.5)")
					cl.style.width = (loadTool.close.size ? loadTool.close.size : 25) + "px"
					cl.style.height = (loadTool.close.size ? loadTool.close.size : 25) + "px"
					cl.style.cursor = "pointer";
					cl.style.overflow="hidden";
					cl.addEventListener('click',function(){
						document.getElementById("basePopping").remove();
						localStorage.setItem("disabledTimeClose",  new Date().getTime() / 1000);
					});
				} else {
					cl=document.getElementById('closebtn')[0];
				}
				document.getElementById("basePopping").append(cl);
			}
			if(loadTool.bubble != false) {
				drawBubble();
			}
			play();
		}
	} else {
		console.log("popping desactivate due to no loadtool");
	}
}

async function play(){
	try {
		//Gestion de l'iterateur en cas de lancement du mode random
		if(loadTool.playtype && loadTool.playtype == 'random') {
			if( randomAnims && randomAnims.length == 0) {
				randomAnims = [...Array(loadTool.anims.length).keys()]
			}
			rand = Math.floor(Math.random() * randomAnims.length);
			iterator = randomAnims[rand]
			randomAnims.splice(rand,1)
		} else {
			iterator++
			if(iterator == loadTool.anims.length) {
				iterator=0
			}
		}
		video.src = "";
		if(video.canPlayType('video/mp4; codecs="hvc1"')) {
			video.src = (loadTool.path ? loadTool.path:config.path)+loadTool.anims[iterator].id + ".mp4";
			video.type='video/mp4; codecs="hev1"';
		} else {
			video.src = (loadTool.path ? loadTool.path:config.path)+loadTool.anims[iterator].id + ".webm";
			video.type='video/webm;';
		}
		let style = "position:fixed;z-index:10000;line-height:0;";

		if( Number.isInteger( (loadTool.fade != undefined ? loadTool.fade : config.fade))) {
			style+= 'animation:fadeIn '+(loadTool.fade != undefined ? loadTool.fade : config.fade)+'ms, fadeout '+(loadTool.fade != undefined ? loadTool.fade : config.fade)+'ms 10s; ';
			style+= 'transition: fadeIn '+(loadTool.fade != undefined ? loadTool.fade : config.fade)+'ms ease 0s;'
			style+= 'animation-fill-mode: forwards;';
		}

		let transform = "";
		positionY = loadTool.anims[iterator].posY != undefined ? loadTool.anims[iterator].posY : loadTool.posY
		positionX = loadTool.anims[iterator].posX != undefined ? loadTool.anims[iterator].posX : loadTool.posX
		scale = loadTool.anims[iterator].scale != undefined ? loadTool.anims[iterator].scale : (loadTool.scale != undefined ? loadTool.scale : 1)
		scale = (scale > 1 ? 1 :scale);
		scale = (scale < 0.4 ? 0.4 : scale);
		transform += ' scale('+scale+') ';
		style += 'transform-origin: bottom right;-webkit-transform-origin:bottom right;'

		switch (positionY) {
			case "top" : style+="top: 0%;"; break;
			case "center" : transform += 'translateY(50%) ';
							style+="bottom: 50%;";
							break;
			case "bottom" :
			default : style+="bottom: 0%;"; break;
		}
		switch (positionX) {
			case "left" : style+="left: 0%;"; break;
			case "center" : transform += 'translateX(-50%) ';
							style+="left: 50%;";
							break;
			case "right" :
			default : style+="right: 0%;"; break;
		}
		style+= 'transform:'+transform+';';
		style+= '-webkit-transform:'+transform+';';

		document.getElementById("basePopping").style=""
		window.setTimeout(function() {
			document.getElementById("basePopping").style=style
		},50)
		//Si la vidéo courante ne charge pas => on arrête la diffusion  et on passe dans le mode erreur fallback
		video.load()
		var promise = video.play();
		promise.then ( e => {
			//Add fade out after vidéo is load
			// console.log("duration calcule");
			// console.log(video.duration);
			// console.log(loadTool.fade != undefined ? loadTool.fade : config.fade);
			// console.log(Number(video.duration)-(loadTool.fade != undefined ? loadTool.fade : config.fade)/1000);
			duration = Number(video.duration)-(loadTool.fade != undefined ? loadTool.fade : config.fade)/1000;
			document.getElementById("basePopping").style.animationDelay="0s,"+ duration + "s";
			//console.log(document.getElementById("basePopping").style.animationDelay)
		}).catch (error => {
			console.error(error)
			setTimeout(()=>{video.play()},50);
		})

	} catch (e){
		document.getElementById("basePopping").style.visibility='hidden'
		console.error(e)
		let a = document.createElement("a");
		a.id="outlink"
		a.href = (loadTool.outlink ? loadTool.outlink : config.outlink);

		if(a.href.indexOf('%C%') > 1) {
			a.href = a.href.replace('%C%',loadTool.anims[iterator]['card'])
		}
		if(a.href.indexOf('%M%') > 1) {
			a.href = a.href.replace('%M%',"m"+loadTool.anims[iterator]['model'])
		}
		a.target="_blank"
		let img = document.createElement("img");
		img.src = config.fallbackImage;

		img.style.position ='fixed';
		img.style.zIndex = '999999';
		img.style.bottom = '0px';
		img.style.cursor = 'pointer';
		img.style.border = 'none';
		if(config.fallbackPosition == 'center') {
			img.style.left	 = '50%';
			img.style.marginLeft	= '-'+parseInt(config.fallbackSize/2)+'px';
		}
		if(config.fallbackPosition == 'left') {
			img.style.left	 = config.offset+'px';
		}
		if(config.fallbackPosition == 'right') {
			img.style.right	 = config.offset+'px';
		}
		img.style.width = config.fallbackSize+'px';
		img.style.height = parseInt(config.fallbackSize*280/223)+'px';
		a.append(img);
		document.getElementsByTagName('body')[0].append(a);
		setTimeout(play(),10000);
		document.getElementById("outlink").remove();
	}

}
function alpha(event,video) {
	//Création du canvas et recopie de l'image
	let canvas = document.createElement("canvas")
	canvas.id ="canvas";
	//canvas.style.zIndex = 99
	canvas.crossOrigin="anonymous"
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'medium';
	ctx.clearRect(0, 0, 1, 1);
	ctx.drawImage(
		video,
		event.clientX - video.offsetParent.offsetLeft + (loadTool.anims[iterator].posX == 'center' || loadTool.posX == 'center' ? video.videoWidth/2 : 0), //x coordinate
		event.clientY - video.offsetParent.offsetTop - (loadTool.anims[iterator].posY == 'center' ? video.videoHeight/2 : 0), //y coordinate
		1, // width to copy
		1, // height to copy
		0, //x coordinate where to place the img on canvas
		0, //y coordinate where to place the img on canvas
		1, //width of the img to use
		1, // height of the img to use
	);

	//Calcule de la position du click dans le canvas. A ajuster en fonction de la transformation css
	return ctx.getImageData(
		0,
		0,
		1,
		1
	).data[3];
}

function drawBubble (){
	let bubble = document.createElement('div');
	bubble.style= "position: absolute; left: auto; width: auto; top: 0px; right: 50%;";

	let inside_bubble = document.createElement('div');
	inside_bubble.style = 'position: relative; left: auto; top: -50px; height: 40px; background: rgb(231, 46, 74); z-index: 10001; margin: 0px auto; border-radius: 10px; pointer-events: none; color: rgb(255, 255, 255); font: 700 18px / 42px Arial; text-align: center; padding: 0px 15px; white-space: nowrap;-webkit-transform:scale(1); transform: scale(1); right: -50%;'
	inside_bubble.style.animation = '1s linear 0s infinite normal both running TotemToolbounce, 7s linear 0s infinite normal both running TotemToolFade'

	if(loadTool.bubble != undefined) {
		if(loadTool.bubble.color != undefined) {
			inside_bubble.style.background = loadTool.bubble.color
		}
		if(loadTool.bubble.radius != undefined) {
			inside_bubble.style.borderRadius= loadTool.bubble.radius
		}
		if(loadTool.bubble.size != undefined) {
			inside_bubble.style.transform.scale = loadTool.bubble.size
		}

		inside_bubble.textContent = (loadTool.bubbleText ? loadTool.bubbleText : config.bubbleText)
		if(!loadTool.bubble.noSpeech) {
			let speech = document.createElement('div');
			speech.style="position: absolute; width: 0px; height: 0px; bottom: -8px; left: 10px; border-style: solid solid none; border-width: 8px 8px 0px; border-color: rgb(231, 46, 74) transparent currentcolor; border-image: none 100% / 1 / 0 stretch;"
			inside_bubble.append(speech);
		}
		bubble.append(inside_bubble);
		document.getElementById("basePopping").append(bubble);
			}
}

setTimeout( () => {

	if(mobileAction == 'No' && mobileDevice ) {//do nothing
	} else {
		if(!mobileDevice || mobileAction == 'Yes' ) {
			init();
		} else {
			loadTool=loadToolMobile;
			init();
		}
	}

},100)
};

popping_function();