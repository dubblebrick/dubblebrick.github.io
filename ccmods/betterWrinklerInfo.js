if(WrinklerInfoMod === undefined) var WrinklerInfoMod = {};

if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

WrinklerInfoMod.name = 'Better Wrinkler Info';
WrinklerInfoMod.version = '1.0.0';
WrinklerInfoMod.GameVersion = '2.058';
WrinklerInfoMod.CCSEVersion = '2.036';

WrinklerInfoMod.launch = function(){
	WrinklerInfoMod.init = function(){
		WrinklerInfoMod.config = {};
		WrinklerInfoMod.stats = {};

		CCSE.customSave.push(() => {
			WrinklerInfoMod.stats.saveVersion = WrinklerInfoMod.version;
			WrinklerInfoMod.stats.lastAscension = Game.seed;
			if (!CCSE.config.OtherMods.WrinklerInfoMod) CCSE.config.OtherMods.WrinklerInfoMod = {};
			CCSE.config.OtherMods.WrinklerInfoMod.stats = WrinklerInfoMod.stats;
			CCSE.config.OtherMods.WrinklerInfoMod.config = WrinklerInfoMod.config;
		});

		CCSE.customLoad.push(WrinklerInfoMod.LoadData);

		// Replace Game.Notify call for exploding a wrinkler in the wrinkler update routine

		inRectFunc = 'function inRect(x,y,rect){ \
				var dx = x+Math.sin(-rect.r)*(-(rect.h/2-rect.o)),dy=y+Math.cos(-rect.r)*(-(rect.h/2-rect.o)); \
				var h1 = Math.sqrt(dx*dx + dy*dy); \
				var currA = Math.atan2(dy,dx); \
				var newA = currA - rect.r; \
				var x2 = Math.cos(newA) * h1; \
				var y2 = Math.sin(newA) * h1; \
				if (x2 > -0.5 * rect.w && x2 < 0.5 * rect.w && y2 > -0.5 * rect.h && y2 < 0.5 * rect.h) return true; \
				return false;\
			}';


		// Insert code which increments mod stats when a wrinkler is popped
		CCSE.ReplaceCodeIntoFunction(
			'Game.UpdateWrinklers',
			'Game.wrinklersPopped++;',
			'WrinklerInfoMod.AddWrinklers(1, me.type);',
			1,
			inRectFunc
		);

		// Replace condition for displaying the wrinkler notification
		CCSE.ReplaceCodeIntoFunction(
			'Game.UpdateWrinklers',
			'if (me.sucked>0.5)',
			'if (me.sucked>0.5 || me.type == 1 || WrinklerInfoMod.config.alwaysShowCount)',
			0,
			inRectFunc			
		);

		// Replace wrinkler notification with a more detailed one
		CCSE.ReplaceCodeIntoFunction(
			'Game.UpdateWrinklers',
			'Game.Notify(me.type==1?loc("Exploded a shiny wrinkler"):loc("Exploded a wrinkler"),loc("Found <b>%1</b>!",loc("%1 cookie",LBeautify(me.sucked))),[19,8],6);',
			'WrinklerInfoMod.ExplodedWrinklerMessage(me.type, me.sucked);',
			0,
			inRectFunc			
		);

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

		Game.customStatsMenu.push(() => {
			CCSE.AppendStatsSpecial('<div class="listing"><b>Longest shiny wrinkler drought:</b> ' + WrinklerInfoMod.stats.longestDrought + '</div>');
		});

		Game.customOptionsMenu.push(() => {
			CCSE.AppendCollapsibleOptionsMenu(
				WrinklerInfoMod.name,
				WrinklerInfoMod.GetOptionsMenu()
			);
		});

		// Manually load custom data since CCSE doesn't seem do be doing so automatically
		WrinklerInfoMod.LoadData();

		WrinklerInfoMod.isLoaded = 1;
		Game.Notify(WrinklerInfoMod.name + ' v' + WrinklerInfoMod.version + ' loaded!', '', [24,12], 6);
	}

	WrinklerInfoMod.ExplodedWrinklerMessage = function(type, numCookies){
		if (type == 1){
			Game.Notify(
				'Exploded a shiny wrinkler!!!',
				(numCookies > 0.5 ? loc('Found <b>%1</b>!',loc('%1 cookie',LBeautify(numCookies))) : '') +
				'It took ' + WrinklerInfoMod.stats.sinceShiny + (WrinklerInfoMod.stats.shinysFound == 0 ? ' wrinklers for your first shiny.' : ' wrinklers since your last shiny.'),
				[24,12],
				18
			);
		}
		else{
			Game.Notify(
				'Exploded a wrinkler',
				(numCookies > 0.5 ? loc('Found <b>%1</b>!',loc('%1 cookie',LBeautify(numCookies)))' : '') +
				(WrinklerInfoMod.config.alwaysShowCount ? 'You have popped ' + WrinklerInfoMod.stats.sinceShiny + (WrinklerInfoMod.stats.shinysFound == 0 ? ' wrinklers without a shiny.' : ' wrinklers since your last shiny.') : ''),
				[19,8],
				6
			);
		}
	}

	WrinklerInfoMod.GetOptionsMenu = function(){
		var str = '<div class="listing">' + CCSE.MenuHelper.ToggleButton(WrinklerInfoMod.config, 'alwaysShowCount', 'alwaysShowCountButton', 'Always show count ON', 'Always show count OFF', 'WrinklerInfoMod.ToggleOption') + '<label>(whether the number of wrinklers since the last shiny is displayed with every popped wrinkler)</label></div>';

		return str;
	}

	WrinklerInfoMod.ToggleOption = function(optionName, button, on, off, invert)
	{
		if (WrinklerInfoMod.config[optionName]){
			document.getElementById(button).innerHTML = off;
			WrinklerInfoMod.config[optionName] = false;
		}
		else{
			document.getElementById(button).innerHTML = on;
			WrinklerInfoMod.config[optionName] = true;
		}
		
		document.getElementById(button).className = 'smallFancyButton prefButton option' + ((WrinklerInfoMod.config[optionName]^invert) ? '' : ' off');
	}

	WrinklerInfoMod.LoadData = function(){
		if(CCSE.config.OtherMods.WrinklerInfoMod){
			WrinklerInfoMod.stats = CCSE.config.OtherMods.WrinklerInfoMod.stats;
			WrinklerInfoMod.config = CCSE.config.OtherMods.WrinklerInfoMod.config;
		}
		else{
			WrinklerInfoMod.stats = {
				sinceShiny: Game.wrinklersPopped,
				shinysFound: 0,
				totalWrinklers: Game.wrinklersPopped,
				wrinklersThisAscension: Game.wrinklersPopped,
				lastAscension: Game.seed,
				longestDrought: Game.wrinklersPopped
			};
			WrinklerInfoMod.config = {
				alwaysShowCount: true
			};
		}
		
		// Resync save data if wrinklers were popped while the mod was unloaded (cannot detect shiny wrinklers or >1 ascension)
		if (Game.wrinklersPopped > WrinklerInfoMod.stats.wrinklersThisAscension){
			WrinklerInfoMod.AddWrinklers(Game.wrinklersPopped - WrinklerInfoMod.stats.wrinklersThisAscension, 0);
			WrinklerInfoMod.stats.wrinklersThisAscension = Game.wrinklersPopped;
		}
		else if (Game.seed != WrinklerInfoMod.stats.lastAscension || Game.wrinklersPopped < WrinklerInfoMod.stats.wrinklersThisAscension){
			WrinklerInfoMod.AddWrinklers(Game.wrinklersPopped, 0);
			WrinklerInfoMod.stats.wrinklersThisAscension = Game.wrinklersPopped;
		}

		console.log('[WrinklerInfoMod] Data successfully loaded');
	}

	WrinklerInfoMod.AddWrinklers = function(num, type){
		WrinklerInfoMod.stats.totalWrinklers += num;
		WrinklerInfoMod.stats.wrinklersThisAscension += num;
		if (type == 0){
			WrinklerInfoMod.stats.sinceShiny += num;
			if (WrinklerInfoMod.stats.sinceShiny > WrinklerInfoMod.stats.longestDrought)
				WrinklerInfoMod.stats.longestDrought = WrinklerInfoMod.stats.sinceShiny;
		}
		else{
			WrinklerInfoMod.stats.sinceShiny = 0;
			WrinklerInfoMod.stats.shinysFound += num;
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
