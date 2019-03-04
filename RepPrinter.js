/*
RepPrinter
Outputs a 5e Shaped Sheet character's repeating items into the API Output Console for reference when developing other scripts.

On Github:	https://github.com/blawson69
Contact me: https://app.roll20.net/users/1781274/ben-l
Like this script? Buy me a coffee: https://venmo.com/theBenLawson
*/

var RepPrinter = RepPrinter || (function () {
    'use strict';

    //---- INFO ----//

    var version = '0.1',
		repstrings = {equipment: '^(?:repeating_equipment_).+$', utility: '^(?:repeating_utility_).+$', offense: '^(?:repeating_offense_).+$', ammo: '^(?:repeating_ammo_).+$', spells: '^(?:repeating_spell).+$', spell0: '^(?:repeating_spell0).+$', spell1: '^(?:repeating_spell1).+$', spell2: '^(?:repeating_spell2).+$', spell3: '^(?:repeating_spell3).+$', spell4: '^(?:repeating_spell4).+$', spell5: '^(?:repeating_spell5).+$', spell6: '^(?:repeating_spell6).+$', spell7: '^(?:repeating_spell7).+$', spell8: '^(?:repeating_spell8).+$', spell9: '^(?:repeating_spell9).+$', skills: '^(?:repeating_skill_).+$', armor: '^(?:repeating_armor_).+$', class: '^(?:repeating_class_).+$', modifiers: '^(?:repeating_modifier_).+$', attachers: '^(?:repeating_attacher_).+$', random: '^.*REPLACE.*$'},
        styles = {
            box:  'background-color: #fff; border: 1px solid #000; padding: 8px 10px; border-radius: 6px; margin-left: -40px; margin-right: 0px;',
            title: 'padding: 0 0 10px 0; color: ##591209; font-size: 1.5em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            button: 'background-color: #000; border-width: 0px; border-radius: 5px; padding: 5px 8px; margin: 8px 0; color: #fff; text-align: center;',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #591209; text-decoration: underline;',
            code: 'font-family: "Courier New", Courier, monospace; background-color: #ddd; color: #000; padding: 2px 4px;',
        },

    checkInstall = function () {
        log('--> RepPrinter v' + version + ' <-- Initialized');
        showDialog('', 'RepPrinter loaded.');
    },

    //----- INPUT HANDLER -----//

    handleInput = function (msg) {
        if (msg.type == 'api' && msg.content.startsWith('!print')) {
			var parms = msg.content.split(/\s+/i);
			if (parms.length > 2) {
				var char_id = parms[1];
				if (parms[2].match(/^(?:equipment|spell[s0-9]{1}|utility|offense|ammo|skills|armor|class|modifiers|attachers|random)$/i) == null) {
					var valid_categories = _.map(_.keys(repstrings), function(x) {return x;});
                    showDialog('Error', '"' + parms[2] + '" is not a valid category. Valid categories are equipment, spells, utility, offense, ammo, skills, armor, class, modifiers, and attachers.<br><br>You may also narrow the spells down by using "spell" plus the spell level with no spaces. Use spell0 for cantrips.<br><br>To search for other strings, use "random" as the category and send your string as the last option.<br><br>Please try again.');
				} else {
					var category = parms[2].toLowerCase();
                    var character = getObj('character', char_id);
                    var char_name = (character) ? character.get('name') : char_id;
					var charAttrs = findObjs({type: 'attribute', characterid: char_id}, {caseInsensitive: true});
					if (charAttrs) {
                        var tmpCat = repstrings[category];
                        if (category == 'random') {
                            tmpCat = tmpCat.replace('REPLACE', esRE(parms[3]));
                            category = parms[3];
                        }
						var re = new RegExp(tmpCat, 'i');
						var util = _.filter(charAttrs, function (attr) {
							return (attr.get('name').match(re) !== null);
						});
						if (util && util.length > 0) {
                            showDialog('', util.length + ' "' + category + '" attributes found for ' + char_name + '. Printing...');
							log('.'); // spacer
							log('-------------- BEGIN ' + category + ' attributes for ' + char_name + ' --------------');
							var row_id = '';
							_.each(util, function (row) {
								var tmp_row_id = row.get('name').split('_')[2];
								if (row_id !== '' && row_id !== tmp_row_id) {
									log('--------------');
								}
								log(row.get('name') + ' = ' + row.get('current'));
								row_id = tmp_row_id;
							});
                            log('--------------- END ' + category + ' attributes for ' + char_name + ' ---------------');
                            setTimeout(function () {
                                showDialog('Complete', 'Printed ' + util.length + ' "' + category + '" attributes for ' + char_name + '.');
                            }, 1000);
						} else {
                            log('tmpCat = ' + tmpCat);
                            showDialog('Not Found', char_name + ' has no "' + category + '" attributes.');
                        }
					}
				}
			} else {
                showDialog('Error', 'You didn\'t send all the required parameters. Proper syntax is:<br><br><span style=\'' + styles.code + '\'>!print character_id category</span><br><br>Try again.');
			}
		}
    },

	showDialog = function (title, content) {
        title = (title == '') ? '' : '<div style=\'' + styles.title + '\'>' + title + '</div>';
        var body = '<div style=\'' + styles.box + '\'>' + title + '<div>' + content + '</div></div>';
        sendChat('RepPrinter','/w GM ' + body, null, {noarchive:true});
	},

    esRE = function (s) {
        var escapeForRegexp = /(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g;
        return s.replace(escapeForRegexp,"\\$1");
    },

    //---- PUBLIC FUNCTIONS ----//

    registerEventHandlers = function () {
		on('chat:message', handleInput);
	};

    return {
		checkInstall: checkInstall,
		registerEventHandlers: registerEventHandlers
	};
}());

on("ready", function () {
    RepPrinter.checkInstall();
    RepPrinter.registerEventHandlers();
});
