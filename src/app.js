/*
 * Developed by Bitwinkel
 */


var UI = require('ui');
var Vector2 = require('vector2');
var Voice = require('ui/voice');
var Settings = require('settings');

var iso = navigator.language.indexOf("es")!=-1 ? 'es' : 'en';//en-BG

//Graphic elements
var namesMenu;
var mainMenu;
var team1Screen;
var team2Screen;
var namesMenu;
var servicePointScreen;
var matchScreen;
var matchBall;
var matchBallPosition;
var team1PointsText;
var team2PointsText;
var team1GamesText;
var team2GamesText;
var team1SetsText;
var team2SetsText;
var serviceNameText;

//Match data
var team1;
var team2;
var serviceTeam;
var serviceRight;
var servicePlayerTeam1;
var servicePlayerTeam2;
var matchType;





/*
 * LANG
 */
var lang={
		advantage:{
			es:"V", en:"AD"
		},
		games:{
			es:"Jue.", en:"Game"
		},
		justLikeLast:{
			es:"igual que el último", en:"just like last time"	
		},
		left:{
			es:"izquierda", en:"left"	
		},
		matchs:{
			es:"Partidos", en:"Matchs"	
		},
		oponent:{
			es:"Oponente", en:"Oponent"	
		},
		player:{
			es:"Jugador", en:"Player"
		},
		players:{
			es:"Jugadores", en:"Players"
		},
		repeat:{
			es:"Repetir", en:"Repeat"
		},
		right:{
			es:"derecha", en:"right"	
		},
		service:{
			es:"Saca: ", en:"Serv.: "	
		},
		servicePoint:{
			es:"Punto de saque", en:"Service point"
		},
		sets:{
			es:"Sets", en:"Sets"
		},
		startMatch:{
			es:"Empezar partido", en:"Start match"	
		},
		sureExit:{
			es:"¿Seguro que quieres salir?", en:"Do you want to exit?"	
		},
		sureFinish:{
			es:"¿Finalizar el partido?", en:"Do you want to finish match?"	
		},
		team:{
			es:"Equipo", en:"Team"
		},
		teamName:{
			es:"Nombre \nequipo #", en:"Team # \nname"
		},
		tie:{
			es:"Empate", en:"Tie"
		},
		wantSave:{
			es:"¿Sobreescribir equipos anteriores?", en:"Overwrite latest teams?"
		},
		winner:{
			es:"Ganador:\n", en:"Winner:\n"
		},
		yourTeam:{
			es:"Tu equipo", en:"Your team"
		}
};



/*
 * MAIN SCREEN ##############################################################################
 */

var main = new UI.Card({
  title: '   Paddle Time',
  banner:'images/pelota.png',
  backgroundColor: '#009900',
  titleColor: '#ffffff',
  fullscreen: true,
});

main.show();


main.on('click', 'select', showMainMenu);

//Reset data
resetSave(false);


/*
 * MAIN MENU ##############################################################################
 */
function showMainMenu(){
    mainMenu = new UI.Menu({
    backgroundColor: '#009900',
    textColor: 'white',
    highlightBackgroundColor: 'white',
    highlightTextColor: '#009900',
	fullscreen: true,
    sections: [{
      items: [
          {
            title: '2 ' + lang.players[iso],
            subtitle:'1 vs 1'
          }, 
          {
            title: '4 ' + lang.players[iso],
            subtitle:'2 vs 2'
          },
          {
            title: lang.repeat[iso],
            subtitle:lang.justLikeLast[iso]
          }
      ]
    }]
  });
  mainMenu.on('select', function(e) {
      if(e.itemIndex < 2){
        matchType= e.itemIndex +1;
        showTeam1NameScreen();    
      }
	  else{
		  if(Settings.data('team1') && Settings.data('team1')){
			  team1 = Settings.data('team1');
			  team2 = Settings.data('team2');
		  }
		  else{
			  return;
		  }
		  
		  //Show matchs screen
		  var matchsScreen = new UI.Window({
				 fullscreen: true,
				 backgroundColor: '#009900'
		  });
		  
		  var matchsHeaderText = new UI.Text({
				position: new Vector2(0, 10),
				size: new Vector2(144, 20),
				font: 'gothic-28-bold',
			  	text: lang.matchs[iso],
				textColor:'white',
				textAlign: 'center'
		  });
		  
		  var matchsText = new UI.Text({
				position: new Vector2(0, 55),
				size: new Vector2(142, 90),
				font: 'gothic-24-bold',
			  	text: team2.name + ": " + team2.matchs + "\n\n" + team1.name + ": " + team1.matchs,
				textColor:'white',
				textAlign: 'center'
		  });
		  matchsScreen.add(matchsHeaderText); 
		  matchsScreen.add(matchsText); 
		  
		  matchsScreen.show();
		  
		  setTimeout(function(){
			  showServicePointScreen();
			  matchsScreen.hide();
		  },3000);
	  }
  });
  mainMenu.show();  
}


/*
 * TEAM 1 NAME SCREEN ##############################################################################
 */
function showTeam1NameScreen(){
	team1Screen = new UI.Window({
    		fullscreen: true,
			backgroundColor: '#009900',
			action:{
				up: 'images/dimiss.png',
				select: 'images/mic2.png',
				backgroundColor:'clear'
			}
  	});
	
	var textfield = new UI.Text({
		position: new Vector2(0, 55),
		size: new Vector2(144, 30),
		font: 'gothic-24-bold',
		text: lang.teamName[iso].replace("#","1"),
		textColor:'white',
		textAlign: 'center'
	});
	team1Screen.add(textfield);
	
	var textfield2 = new UI.Text({
		position: new Vector2(0, 125),
		size: new Vector2(144, 30),
		font: 'gothic-18',
		text: lang.yourTeam[iso],
		textColor:'white',
		textAlign: 'center'
	});
	team1Screen.add(textfield2);
  
    team1Screen.show(); 
	
	team1Screen.on('click', 'up', function(){
      showTeam2NameScreen(); 
    });
  
    team1Screen.on('click', 'select', function(){
      Voice.dictate('start', true, function(e) {
		  if (!e.err) {
			  team1.name = decodeURIComponent(escape(e.transcription.length > 12 ? e.transcription.substr(0,10)+"..." : e.transcription)); 
		  }
		  showTeam2NameScreen();
	  });
    });
}


/*
 * TEAM 2 NAME SCREEN ##############################################################################
 */
function showTeam2NameScreen(){
    team2Screen = new UI.Window({
    		fullscreen: true,
			backgroundColor: '#009900',
			action:{
				up: 'images/dimiss.png',
				select: 'images/mic2.png',
				backgroundColor:'clear'
			}
  	});
	var textfield = new UI.Text({
		position: new Vector2(0, 55),
		size: new Vector2(144, 30),
		font: 'gothic-24-bold',
		text: lang.teamName[iso].replace("#","2"),
		textColor:'white',
		textAlign: 'center'
	});
	team2Screen.add(textfield); 
	
	var textfield2 = new UI.Text({
		position: new Vector2(0, 125),
		size: new Vector2(144, 30),
		font: 'gothic-18',
		text: lang.oponent[iso],
		textColor:'white',
		textAlign: 'center'
	});
	team2Screen.add(textfield2);
  
    team2Screen.show(); 
  
    team2Screen.on('click', 'up', function(){
      showNamesMenu(); 
    });
  
    team2Screen.on('click', 'select', function(){
      Voice.dictate('start', true, function(e) {
		  if (!e.err) {
			  team2.name = decodeURIComponent(escape(e.transcription.length > 12 ? e.transcription.substr(0,10)+"..." : e.transcription));  
		  }
		  showNamesMenu();
	  });
    });
}


/*
 * NAMES MENU ##############################################################################
 */
function showNamesMenu(){
  var players = [];
  
  players.push({title: team1.player1,subtitle:team1.name + (matchType==2 ? " - " + lang.right[iso] : "")});
  if(matchType==2){players.push({title: team1.player2,subtitle:team1.name + " - " + lang.left[iso]});}
  players.push({title: team2.player1,subtitle:team2.name + (matchType==2 ? " - " + lang.right[iso] : "")});
  if(matchType==2){players.push({title: team2.player2, subtitle:team2.name + " - " + lang.left[iso]});}
  players.push({title: lang.startMatch[iso]});
  
  namesMenu = new UI.Menu({
    backgroundColor: '#009900',
    textColor: 'white',
    highlightBackgroundColor: 'white',
    highlightTextColor: '#009900',
	fullscreen: true,
    sections: [{
      items: players
    }]
  });
  namesMenu.on('select', function(e) {
      if((matchType==1 && e.itemIndex<2) || (matchType==2 && e.itemIndex<4)){
		  Voice.dictate('start', true, function(ev) {
				if (!ev.err) {
				  var playerName = decodeURIComponent(escape(ev.transcription.length > 12 ? ev.transcription.substr(0,10)+"..." : ev.transcription));
				  switch(e.itemIndex){
					case 0:
					  	  team1.player1=playerName;
					  	  namesMenu.item(0, e.itemIndex, { title: playerName});
					break;
					case 1:
						  if(matchType==1){team2.player1=playerName;}else{team1.player2=playerName;}  
						  namesMenu.item(0, e.itemIndex, { title: playerName});
					break;
					case 2:
					  	  team2.player1=playerName; 
						  namesMenu.item(0, e.itemIndex, { title: playerName});
					break;
					case 3:
					  	  team2.player2=playerName;
						  namesMenu.item(0, e.itemIndex, { title: playerName});
					break;	
				  }
				}
		  });
	  }
	  else{
			showServicePointScreen();
	  }
  });
  namesMenu.show();  
}

/*
 * SERVICE POINT SCREEN ##############################################################################
 */
function showServicePointScreen(){
    servicePointScreen = new UI.Window({
    		fullscreen: true,
			backgroundColor: '#009900',
			action:{
				up: 'images/check.png',
				down: 'images/check.png',
				backgroundColor:'clear'
			}
  	});
	var textfield2 = new UI.Text({
		position: new Vector2(0, 20),
		size: new Vector2(116, 30),
		font: 'gothic-18',
		text: team2.name,
		textColor:'white',
		textAlign: 'right'
	});
	servicePointScreen.add(textfield2);
	
	var textfield = new UI.Text({
		position: new Vector2(0, 65),
		size: new Vector2(144, 30),
		font: 'gothic-24-bold',
		text: lang.servicePoint[iso],
		textColor:'white',
		textAlign: 'center'
	});
	servicePointScreen.add(textfield); 
	
	var textfield2 = new UI.Text({
		position: new Vector2(0, 122),
		size: new Vector2(116, 30),
		font: 'gothic-18',
		text: team1.name,
		textColor:'white',
		textAlign: 'right'
	});
	servicePointScreen.add(textfield2);
  
    servicePointScreen.show(); 
  
    servicePointScreen.on('click', 'up', function(){
      	serviceTeam=2;
		showMatchScreen();
    });
	servicePointScreen.on('click', 'down', function(){
      	serviceTeam=1;
		showMatchScreen();
    });
}

/*
 * MATCH SCREEN ##############################################################################
 */
function showMatchScreen(){
	//Destroy previous screens
	if(mainMenu){mainMenu.hide();mainMenu=null;}
	if(team1Screen){team1Screen.hide();team1Screen=null;}
	if(team2Screen){team2Screen.hide();team2Screen=null;}
	if(namesMenu){namesMenu.hide();namesMenu=null;}
	if(servicePointScreen){servicePointScreen.hide();servicePointScreen=null;}
	
    matchScreen = new UI.Window({
    		fullscreen: true,
			backgroundColor: '#009900'
  	});
	
	//Time text
	var timeText = new UI.TimeText({
		position: new Vector2(0, 2),
		size: new Vector2(144, 15),
		font: 'Gothic-14-Bold',
		textColor:'white',
		textAlign: 'center',
		text:'%H:%M'
	});	
	matchScreen.add(timeText);
	
	//Service text
	serviceNameText = new UI.Text({
		position: new Vector2(5, 20),
		size: new Vector2(134, 30),
		font: 'Gothic-18-Bold',
		textColor:'white',
		textAlign: 'center',
		text:""
	});	
	matchScreen.add(serviceNameText);
	
	//Rect position graphic
	var rect = new UI.Rect ({position: new Vector2(5, 50),size: new Vector2(65, 65),backgroundColor: '#00b8e6',borderColor:'white'});
	matchScreen.add(rect);
	var lineV = new UI.Rect ({position: new Vector2(37, 50),size: new Vector2(1, 65),backgroundColor: 'white',borderColor:'white'});
	matchScreen.add(lineV);
	var lineH = new UI.Rect ({position: new Vector2(5, 82),size: new Vector2(65, 3),backgroundColor: 'white',borderColor:'white'});
	matchScreen.add(lineH);
	
	//points line
	var lineH2 = new UI.Rect ({position: new Vector2(101, 83),size: new Vector2(13, 1),backgroundColor: 'white',borderColor:'white'});
	matchScreen.add(lineH2);
	
	//service ball position
	matchBall = new UI.Circle ({radius: 7,backgroundColor: 'white',borderColor:'white'});
	matchBallPosition={topLeft:new Vector2(21, 66), topRight:new Vector2(53, 66), bottomLeft:new Vector2(21, 99), bottomRight:new Vector2(53, 99)};
	matchScreen.add(matchBall);
	
	//Team 2 points text
	team2PointsText = new UI.Text({
		position: new Vector2(72, 48),
		size: new Vector2(72, 33),
		font: 'Bitham-30-Black',
		textColor:'white',
		textAlign: 'center',
		text:"0"
	});	
	matchScreen.add(team2PointsText);
	
	//Team 1 points text
	team1PointsText = new UI.Text({
		position: new Vector2(72, 81),
		size: new Vector2(72, 33),
		font: 'Bitham-30-Black',
		textColor:'white',
		textAlign: 'center',
		text:"0"
	});	
	matchScreen.add(team1PointsText);
	
	//Header games text
	var headerGamesText = new UI.Text({
			position: new Vector2(0, 115),
			size: new Vector2(30, 15),
			font: 'Gothic-14',
			textColor:'white',
			textAlign: 'center',
			text:lang.games[iso]
	});	
	matchScreen.add(headerGamesText);
	
	//Header sets text
	var headerSetsText = new UI.Text({
			position: new Vector2(114, 115),
			size: new Vector2(30, 15),
			font: 'Gothic-14',
			textColor:'white',
			textAlign: 'center',
			text:lang.sets[iso]
	});	
	matchScreen.add(headerSetsText);
	
	//Team 2 name text
	var team2NameText = new UI.Text({
			position: new Vector2(30, 130),
			size: new Vector2(84, 15),
			font: 'Gothic-18-Bold',
			textColor:'white',
			textAlign: 'center',
			text:team2.name
	});	
	matchScreen.add(team2NameText);
	
	//Team 1 name text
	var team1NameText = new UI.Text({
			position: new Vector2(30, 145),
			size: new Vector2(84, 15),
			font: 'Gothic-18-Bold',
			textColor:'white',
			textAlign: 'center',
			text:team1.name
	});	
	matchScreen.add(team1NameText);
	
	
	//Team 2 games text
	team2GamesText = new UI.Text({
		position: new Vector2(0, 130),
		size: new Vector2(30, 15),
		font: 'Gothic-18-Bold',
		textColor:'white',
		textAlign: 'center',
		text:"0"
	});	
	matchScreen.add(team2GamesText);
	
	//Team 1 games text
	team1GamesText = new UI.Text({
		position: new Vector2(0, 145),
		size: new Vector2(30, 15),
		font: 'Gothic-18-Bold',
		textColor:'white',
		textAlign: 'center',
		text:"0"
	});	
	matchScreen.add(team1GamesText);
	
	//Team 2 sets text
	team2SetsText = new UI.Text({
		position: new Vector2(114, 130),
		size: new Vector2(30, 15),
		font: 'Gothic-18-Bold',
		textColor:'white',
		textAlign: 'center',
		text:"0"
	});	
	matchScreen.add(team2SetsText);
	
	//Team 1 sets text
	team1SetsText = new UI.Text({
		position: new Vector2(114, 145),
		size: new Vector2(30, 15),
		font: 'Gothic-18-Bold',
		textColor:'white',
		textAlign: 'center',
		text:"0"
	});	
	matchScreen.add(team1SetsText);
		
	
	//Set initial points and service ball
	team1.games=0;
	team1.sets=0;
	addPoints(0);
	
  
    matchScreen.show(); 
  
    matchScreen.on('click', 'up', function(){
      	addPoints(2);
    });
	matchScreen.on('click', 'down', function(){
      	addPoints(1);
    });
	matchScreen.on('click', 'select', function(){
      	showFinishMatchScreen();
    });
	matchScreen.on('click', 'back', function() {
	  	showExitScreen();
	});
}

/*
 * ADD POINTS FUNCTION, sets service position, the name of service player, and increase the points ##############################################################################
 */
function addPoints(team){
	if(team==0){
		team1.points=0;
		team2.points=0;
		serviceRight=true;
		
		//points
		team2PointsText.text("0");
		team1PointsText.text("0");
		
		//service
		if(serviceTeam==1){
			servicePlayerTeam1 = matchType==1 ? 1 : servicePlayerTeam1==2 ? 1 : 2;
			matchBall.position(matchBallPosition.bottomRight);
			if(servicePlayerTeam1==1){
				serviceNameText.text(lang.service[iso] + team1.player1);
			}
			else{
				serviceNameText.text(lang.service[iso] + team1.player2);	
			}
		}
		else{
			servicePlayerTeam2 = matchType==1 ? 1 : servicePlayerTeam2==2 ? 1 : 2;
			matchBall.position(matchBallPosition.topLeft);	
			if(servicePlayerTeam2==1){
				serviceNameText.text(lang.service[iso] + team2.player1);
			}
			else{
				serviceNameText.text(lang.service[iso] + team2.player2);	
			}
		}
	}
	else{
		//points
		var pointsTeam = eval("team"+team);
		var otherTeam = eval("team"+(team==1 ? 2 : 1));
		pointsTeam.points+=(pointsTeam.points<30 ? 15 : 10);
		if((pointsTeam.points == 50 && otherTeam.points<40) || (pointsTeam.points == 60)){
			addGame(team);
		}
		else{
			if(pointsTeam.points == 50 && otherTeam.points == 40){
				eval("team"+team+"PointsText").text(lang.advantage[iso]);
			}
			else if(pointsTeam.points == 50 && otherTeam.points == 50){
				pointsTeam.points=40;
				otherTeam.points=40;	
				team2PointsText.text("40");
				team1PointsText.text("40");
			}
			else{
				eval("team"+team+"PointsText").text(eval("team"+team).points);
			}

			//service
			serviceRight = !serviceRight;
			if(serviceTeam==1){
				if(serviceRight){
					matchBall.position(matchBallPosition.bottomRight);	
				}
				else{
					matchBall.position(matchBallPosition.bottomLeft);		
				}

			}
			else{
				if(serviceRight){
					matchBall.position(matchBallPosition.topLeft);
				}
				else{
					matchBall.position(matchBallPosition.topRight);	
				}
			}	
		}
	}
	
	
}


/*
 * ADD GAME FUNCTION, add game and set if necessary ##############################################################################
 */
function addGame(team){
	//Reset points
	serviceTeam= serviceTeam==1 ? 2 : 1;
	addPoints(0);	
	
	var pointsTeam = eval("team"+team);
	var otherTeam = eval("team"+(team==1 ? 2 : 1));
	pointsTeam.games++;
	if(pointsTeam.games > 5 && (pointsTeam.games - otherTeam.games>1)){
		pointsTeam.sets++;   
	    pointsTeam.games=0;
	    otherTeam.games=0;
	}
	
	eval("team"+team+"GamesText").text(eval("team"+team).games);
	eval("team"+(team==1 ? 2 : 1)+"GamesText").text(eval("team"+(team==1 ? 2 : 1)).games);
	eval("team"+team+"SetsText").text(eval("team"+team).sets);
}

/*
 * EXIT SCREEN ##############################################################################
 */
function showExitScreen(){
    var exitScreen = new UI.Window({
    		fullscreen: true,
			backgroundColor: '#009900',
			action:{
				up: 'images/check.png',
				down: 'images/dimiss.png',
				backgroundColor:'clear'
			}
  	});
	
  	var textfield = new UI.Text({
		position: new Vector2(0, 55),
		size: new Vector2(142, 30),
		font: 'gothic-24-bold',
		text: lang.sureExit[iso],
		textColor:'white',
		textAlign: 'center'
	});
	exitScreen.add(textfield); 
	
    exitScreen.show(); 
  
    exitScreen.on('click', 'up', function(){
      	matchScreen.hide();
		matchScreen=null;
		exitScreen.hide();
		
		//Reset
		resetSave(false);
    });
	exitScreen.on('click', 'down', function(){
      	exitScreen.hide();
    });
	exitScreen.on('click', 'back', function() {
	  	return;
	});
}

/*
 * FINISH SCREEN ##############################################################################
 */
function showFinishMatchScreen(){
    var exitScreen = new UI.Window({
    		fullscreen: true,
			backgroundColor: '#009900',
			action:{
				up: 'images/check.png',
				down: 'images/dimiss.png',
				backgroundColor:'clear'
			}
  	});
	
  	var textfield = new UI.Text({
		position: new Vector2(0, 55),
		size: new Vector2(142, 30),
		font: 'gothic-24-bold',
		text: lang.sureFinish[iso],
		textColor:'white',
		textAlign: 'center'
	});
	exitScreen.add(textfield); 
	
    exitScreen.show(); 
  
    exitScreen.on('click', 'up', function(){
      	//Show winner screen during 3 seconds
		var winnerName= lang.tie[iso];
		if(team1.sets>team2.sets || (team1.sets==team2.sets && team1.games>team2.games)){
			winnerName= lang.winner[iso]+team1.name;
			team1.matchs++;
		}
		else if(team2.sets>team1.sets || (team2.sets==team1.sets && team2.games>team1.games)){
			winnerName= lang.winner[iso]+team2.name;
			team2.matchs++;
		}
		else{
			team1.matchs++;
			team2.matchs++;
		}
		
		var winnerScreen = new UI.Window({
			 fullscreen: true,
			 backgroundColor: '#009900'
		});
		var winnerText = new UI.Text({
			position: new Vector2(0, 55),
			size: new Vector2(142, 30),
			font: 'gothic-24-bold',
			text: winnerName,
			textColor:'white',
			textAlign: 'center'
		});
		winnerScreen.add(winnerText); 
		winnerScreen.show();
		setTimeout(function(){winnerScreen.hide();},3000);
		
		//Return home
		matchScreen.hide();
		matchScreen=null;
		exitScreen.hide();
		
		//Reset and save
		resetSave(true);
    });
	exitScreen.on('click', 'down', function(){
      	exitScreen.hide();
    });
	exitScreen.on('click', 'back', function() {
	  	return;
	});
}

/*
 * RESET AND SAVE ##############################################################################
 */

function resetSave(save){
	if(save){
		team1.points=0;
		team1.games=0;
		team1.sets=0;
		team2.points=0;
		team2.games=0;
		team2.sets=0;
		Settings.data('team1', team1);
		Settings.data('team2', team2);
	}
	
	//Graphic elements
	namesMenu=null;
	mainMenu=null;
	team1Screen=null;
	team2Screen=null;
	namesMenu=null;
	servicePointScreen=null;
	matchScreen=null;
	matchBall=null;
	matchBallPosition=null;
	team1PointsText=null;
	team2PointsText=null;
	team1GamesText=null;
	team2GamesText=null;
	team1SetsText=null;
	team2SetsText=null;
	serviceNameText=null;

	//Match data
	team1 = {name:lang.team[iso]+" 1", player1:lang.player[iso]+" 1", player2:lang.player[iso]+" 2", points:0, games:0, sets:0, matchs:0};
	team2 = {name:lang.team[iso]+" 2", player1:lang.player[iso]+" 1", player2:lang.player[iso]+" 2", points:0, games:0, sets:0, matchs:0};
	serviceTeam = 1;
	serviceRight = true;
	servicePlayerTeam1= 2;
	servicePlayerTeam2= 2;
	matchType=1;
}

