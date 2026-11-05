if(WrinklerInfoMod === undefined) var WrinklerInfoMod = {};

if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

WrinklerInfoMod.name = 'Better Wrinkler Info';
WrinklerInfoMod.version = '0.2.1';
WrinklerInfoMod.GameVersion = '2.058';
WrinklerInfoMod.CCSEVersion = '2.036';

WrinklerInfoMod.launch = function(){
	WrinklerInfoMod.init = function(){
		WrinklerInfoMod.stats = {
			saveVersion: WrinklerInfoMod.version,
			sinceShiny: Game.wrinklersPopped,
			shinysFound: 0,
			totalWrinklers: Game.wrinklersPopped
		};
		WrinklerInfoMod.config = {
			alwaysShowCount: true
		}
		CCSE.customLoad.push(() => {
			if(CCSE.config.OtherMods.WrinklerInfoMod){
				WrinklerInfoMod.stats = CCSE.config.OtherMods.WrinklerInfoMod.stats;
				WrinklerInfoMod.config = CCSE.config.OtherMods.WrinklerInfoMod.config;
			}
		});

		CCSE.customSave.push(() => {
			CCSE.config.OtherMods.WrinklerInfoMod.stats = WrinklerInfoMod.stats;
			CCSE.config.OtherMods.WrinklerInfoMod.config = WrinklerInfoMod.config;
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
			CCSE.AppendStatsSpecial('<div class="listing"><b>Wrinklers popped (all time):</b> ' + WrinklerInfoMod.stats.totalWrinklers + '</div>');
		});

		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsSpecial('<div class="listing"><b>Shiny wrinklers popped:</b> ' + WrinklerInfoMod.stats.shinysFound + '</div>');
		});

		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsSpecial('<div class="listing"><b>Wrinklers popped since last shiny:</b> ' + WrinklerInfoMod.stats.sinceShiny + '</div>');
		});

		Game.customOptionsMenu.push(() => {
			CCSE.AppendCollapsibleOptionsMenu(
				WrinklerInfoMod.name,
				'<a class="smallFancyButton prefButton option" id="alwaysShowCountButton" onclick="WrinklerInfoMod.ToggleOption(\'alwaysShowCount\'); PlaySound(\'snd/tick.mp3\');">Always show count ON</a><label>(show number of wrinklers since your last shiny every time you pop a wrinkler)</label>'
			);
		});

		if (WrinklerInfoMod.config.alwaysShowCount)
			document.getElementById('alwaysShowCountButton').className = 'smallFancyButton prefButton option off';
		
		WrinklerInfoMod.isLoaded = 1;

		Game.Notify(WrinklerInfoMod.name + ' v' + WrinklerInfoMod.version + ' loaded!', '', [24,12]);
	}

	WrinklerInfoMod.ExplodedWrinklerMessage = function(type, numCookies){
		if (type == 1){
			Game.Notify(
				'Exploded a shiny wrinkler!!!',
				loc('Found <b>%1</b>!',loc('%1 cookie',LBeautify(numCookies))) +
				'\nIt took ' + WrinklerInfoMod.stats.sinceShiny + WrinklerInfoMod.stats.shinysFound == 0 ? ' wrinklers for your first shiny.' : ' wrinklers since your last shiny.',
				[24,12],
				18
			);
			WrinklerInfoMod.stats.sinceShiny = 0;
			WrinklerInfoMod.stats.shinysFound++;
		}
		else{
			WrinklerInfoMod.stats.sinceShiny++;
			Game.Notify(
				'Exploded a wrinkler...',
				loc('Found <b>%1</b>!',loc('%1 cookie',LBeautify(numCookies))) +
				'\nYou have popped ' + WrinklerInfoMod.stats.sinceShiny + WrinklerInfoMod.stats.shinysFound == 0 ? ' wrinklers without a shiny.' : ' wrinklers since your last shiny.',
				[19,8],
				6
			);
		}
	}

	WrinklerInfoMod.ToggleOption = function(optionName)
	{
		configName = 'WrinklerInfoMod.config.' + optionName
		currentlyOn = eval(configName);
		if (currentlyOn){
			eval(configName + ' = false');
			eval('document.getElementById("' + optionName + 'Button").className = "smallFancyButton prefButton option off"');
		}
		else {
			eval(configName + ' = true');
			eval('document.getElementById("' + optionName + 'Button").className = "smallFancyButton prefButton option"');
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
