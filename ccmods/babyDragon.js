if(BabyDragonMod === undefined) var BabyDragonMod = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

BabyDragonMod.name = ''
BabyDragonMod.version = '0.1'
BabyDragonMod.GameVersion = '2.058'

BabyDragonMod.launch = function(){
	BabyDragonMod.init = function(){
		CCSE.CreateSpecialObject(
			'baby dragon',
			function(){return true;},
			function(picframe){
				picframe.pic = [21,12];
				picframe.frame = 0;
			},
			function(){Game.Notify('Under construction', '', [21,12]);}
		);
		BabyDragonMod.isLoaded = 1;
	};
	Game.registerMod()
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
