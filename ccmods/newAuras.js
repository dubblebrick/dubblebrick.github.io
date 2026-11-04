if(NewAurasMod === undefined) var NewAurasMod = {};

if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

NewAurasMod.launch = function(){
	Game.dragonAuras[22] = {name:'Test Aura', pic:[21,12], desc:"This aura <b>does nothing</b>"}
	NewAurasMod.isLoaded = 1;
}

if(!NewAurasMod.isLoaded){
	if(CCSE && CCSE.isLoaded){
		NewAurasMod.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(NewAurasMod.launch);
	}
}
