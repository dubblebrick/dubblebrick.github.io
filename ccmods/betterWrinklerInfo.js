if(WrinklerInfoMod === undefined) var WrinklerInfoMod = {};

if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

WrinklerInfoMod.name = 'Better Wrinkler Info';
WrinklerInfoMod.version = '0.1.6';
WrinklerInfoMod.GameVersion = '2.058';
WrinklerInfoMod.CCSEVersion = '2.036';

WrinklerInfoMod.launch = function(){
	WrinklerInfoMod.init = function(){
		WrinklerInfoMod.info = {};
		CCSE.customLoad.push(() => {
			if(CCSE.config.OtherMods.WrinklerInfoMod){
				WrinklerInfoMod.info = CCSE.config.OtherMods.WrinklerInfoMod;
			}
			else{
				WrinklerInfoMod.info.sinceShiny = Game.wrinklersPopped;
				WrinklerInfoMod.info.shinysFound = 0;
				WrinklerInfoMod.info.totalWrinklers = Game.wrinklersPopped;
			}
		});

		CCSE.customSave.push(() => {
			CCSE.config.OtherMods.WrinklerInfoMod = WrinklerInfoMod.info;
		});

		// Replace Game.Notify call for exploding a wrinkler in the wrinkler update routine
/*
		CCSE.ReplaceCodeIntoFunction(
			'Game.UpdateWrinklers',
			'Game.Notify(me.type==1?loc("Exploded a shiny wrinkler"):loc("Exploded a wrinkler"),loc("Found <b>%1</b>!",loc("%1 cookie",LBeautify(me.sucked))),[19,8],6);',
			'WrinklerInfoMod.ExplodedWrinklerMessage(me.type, me.sucked);',
			0
		);
*/
		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsVersionNumber(WrinklerInfoMod.name, WrinklerInfoMod.version);
		});

		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsSpecial('<div class="listing"><b>Wrinklers popped (all time):</b> ' + WrinklerInfoMod.info.totalWrinklers + '</div>');
		});

		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsSpecial('<div class="listing"><b>Shiny wrinklers popped:</b> ' + WrinklerInfoMod.info.shinysFound + '</div>');
		});

		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsSpecial('<div class="listing"><b>Wrinklers popped since last shiny:</b> ' + WrinklerInfoMod.info.sinceShiny + '</div>');
		});

		WrinklerInfoMod.isLoaded = 1;

		Game.Notify(WrinklerInfoMod.name + ' v' + WrinklerInfoMod.version + ' loaded!', '', [24,12]);
	}

	WrinklerInfoMod.ExplodedWrinklerMessage = function(type, numCookies){
		if (type == 1){
			Game.Notify(
				'Exploded a shiny wrinkler!!!',
				loc('Found <b>%1</b>!',loc('%1 cookie',LBeautify(numCookies))) +
				'\nIt took ' + WrinklerInfoMod.info.sinceShiny + WrinklerInfoMod.info.shinysFound == 0 ? ' wrinklers for your first shiny.' : ' wrinklers since your last shiny.',
				[24,12],
				18
			);
			WrinklerInfoMod.info.sinceShiny = 0;
			WrinklerInfoMod.info.shinysFound++;
		}
		else{
			WrinklerInfoMod.info.sinceShiny++;
			Game.Notify(
				'Exploded a wrinkler...',
				loc('Found <b>%1</b>!',loc('%1 cookie',LBeautify(numCookies))) +
				'\nYou have popped ' + WrinklerInfoMod.info.sinceShiny + WrinklerInfoMod.info.shinysFound == 0 ? ' wrinklers without a shiny.' : ' wrinklers since your last shiny.',
				[19,8],
				6
			);
		}
	}

	if(CCSE.ConfirmGameCCSEVersion(WrinklerInfoMod.name, WrinklerInfoMod.version, WrinklerInfoMod.GameVersion, WrinklerInfoMod.CCSEVersion))
		Game.registerMod(WrinklerInfoMod.name, WrinklerInfoMod);
}

if(!WrinklerInfoMod.isLoaded){
	if(CCSE && CCSE.isLoaded){
		WrinklerInfoMod.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(WrinklerInfoMod.launch);
	}
}
