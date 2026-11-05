if(BabyDragonMod === undefined) var BabyDragonMod = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

BabyDragonMod.name = 'Son of Krumblor';
BabyDragonMod.version = '0.1';
BabyDragonMod.GameVersion = '2.058';
BabyDragonMod.CCSEVersion = '2.036';

BabyDragonMod.pics = [
	'https://dubblebrick.github.io/ccmods/img/dragon1.png',
	'https://dubblebrick.github.io/ccmods/img/dragon2.png',
	'https://dubblebrick.github.io/ccmods/img/dragon3.png',
	'https://dubblebrick.github.io/ccmods/img/dragon4.png',
	'https://dubblebrick.github.io/ccmods/img/dragon5.png'
];

BabyDragonMod.launch = function(){
	BabyDragonMod.BabyDragon = {};

	BabyDragonMod.init = function(){
		BabyDragonMod.BabyDragon.stage = 0;

		CCSE.CreateSpecialObject(
			'baby dragon',
			function(){return true;},
			function(picframe){
				picframe.pic = BabyDragonMod.pics[BabyDragonMod.BabyDragon.stage];
				picframe.frame = 0;
			},
			BabyDragonMod.ToggleSpecialMenu
		);

		BabyDragonMod.isLoaded = 1;
	}

	BabyDragonMod.ToggleSpecialMenu = function(str){
		str = CCSE.SetSpecialMenuImage(str, BabyDragonMod.pics[BabyDragonMod.BabyDragon.stage]);
		
		str += '<h3>Son of Krumblor<\h3>' + '<div  class="line"></div>' + 'Under construction';
	}

	if(CCSE.ConfirmGameCCSEVersion(BabyDragonMod.name, BabyDragonMod.version, BabyDragonMod.GameVersion, BabyDragonMod.CCSEVersion))
		Game.registerMod(BabyDragonMod.name, BabyDragonMod);
}

if(!BabyDragonMod.isLoaded){
	if(CCSE && CCSE.isLoaded){
		BabyDragonMod.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(BabyDragonMod.launch);
	}
}
