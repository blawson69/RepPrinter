/*
RepPrinter
Outputs a character's repeating items for reference when developing other scripts.

On Github:	https://github.com/blawson69
Contact me: https://app.roll20.net/users/1781274/ben-l
Like this script? Buy me a coffee: https://venmo.com/theRealBenLawson
*/

var RepPrinter = RepPrinter || (function () {
    'use strict';

    //---- INFO ----//

    var version = '1.0',
		repstrings = {equipment: '^(?:repeating_equipment_).+$', utility: '^(?:repeating_utility_).+$', offense: '^(?:repeating_offense_).+$', ammo: '^(?:repeating_ammo_).+$', spells: '^(?:repeating_spell).+$', spell0: '^(?:repeating_spell(0|-cantrip)).+$', spell1: '^(?:repeating_spell[\-]?1).+$', spell2: '^(?:repeating_spell[\-]?2).+$', spell3: '^(?:repeating_spell[\-]?3).+$', spell4: '^(?:repeating_spell[\-]?4).+$', spell5: '^(?:repeating_spell[\-]?5).+$', spell6: '^(?:repeating_spell[\-]?6).+$', spell7: '^(?:repeating_spell[\-]?7).+$', spell8: '^(?:repeating_spell[\-]?8).+$', spell9: '^(?:repeating_spell[\-]?9).+$', skills: '^(?:repeating_skill_).+$', armor: '^(?:repeating_armor_).+$', class: '^(?:repeating_class_).+$', modifiers: '^(?:repeating_modifier_).+$', attachers: '^(?:repeating_attacher_).+$', classfeature: '^(?:repeating_classfeature_).+$', inventory: '^(?:repeating_inventory_).+$', attack: '^(?:repeating_attack_).+$', proficiencies: '^(?:repeating_proficiencies_).+$', traits: '^(?:repeating_traits_).+$', resource: '^(?:(repeating|other)_resource)(_.+)?$', random: '^.*REPLACE.*$', curval: '^.*REPLACE.*$'},
        styles = {
            box:  'background-color: #fff; border: 1px solid #000; padding: 8px 10px; border-radius: 6px;',
            title: 'padding: 0 0 10px 0; color: ##591209; font-size: 1.5em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            button: 'background-color: #000; border-width: 0px; border-radius: 5px; padding: 5px 8px; margin: 8px 0; color: #fff; text-align: center;',
            buttonWrapper: 'text-align: center; margin: 10px 0; clear: both;',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #591209; text-decoration: underline;',
            code: 'font-family: "Courier New", Courier, monospace; background-color: #ddd; color: #000; padding: 2px 4px;',
        },

    checkInstall = function () {
        if (!_.has(state, 'RepPrinter')) state['RepPrinter'] = state['RepPrinter'] || {};
        if (typeof state['RepPrinter'].screen_output == 'undefined') state['RepPrinter'].screen_output = true;
        if (typeof state['RepPrinter'].store_chat == 'undefined') state['RepPrinter'].store_chat = false;
        if (typeof state['RepPrinter'].shorten_name == 'undefined') state['RepPrinter'].shorten_name = false;

        log('--> RepPrinter v' + version + ' <-- Initialized');
        var d = new Date();
        showDialog('', 'RepPrinter v' + version + ' loaded at ' + d.toLocaleTimeString() + '.<br><a style=\'' + styles.textButton + '\' href="!print config">Show config</a>', true);
    },

    //----- INPUT HANDLER -----//

    handleInput = function (msg) {
        if (msg.type == 'api' && msg.content.startsWith('!print')) {
			var parms = msg.content.split(/\s+/i), message = '';

            if (parms[1] == 'config') {
                commandConfig(msg);
                return;
            }

            if (parms[1] == 'help') {
                commandHelp(msg);
                return;
            }

            if (parms[1] == 'page') {
                commandPageVals(msg);
                return;
            }

            if (parms[2] && parms[2] == 'csv') {
                commandCSV(parms[1]);
                return;
            }

			if (parms.length > 2) {
				var char_id = parms[1];
                var spells_re = new RegExp(/^(?:spell[s0-9]{1}|spell-cantrip|spell-[1-9])$/, 'i');
                var other_re = new RegExp(/^(?:equipment|utility|offense|ammo|skills|armor|class|modifiers|attachers|classfeature|inventory|attack|resource|proficiencies|traits|random|curval)$/, 'i');
				if (parms[2].match(spells_re) == null && parms[2].match(other_re) == null) {
					//var valid_categories = _.map(_.keys(repstrings), function(x) {return x;});
                    //log('valid_categories = ' + JSON.stringify(valid_categories));
                    showDialog('Error', '"' + parms[2] + '" is not a valid category.<br><div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!print help">Get Help</a></div>', true);
				} else {
					var category = parms[2].toLowerCase(), search_string = parms[2].toLowerCase();
                    var character = getObj('character', char_id);
                    var char_name = (character) ? character.get('name') : char_id;
					var charAttrs = findObjs({type: 'attribute', characterid: char_id}, {caseInsensitive: true});

                    var tmpCat = repstrings[category];
                    if (tmpCat) {
                        if (category == 'curval') {
                            search_string = msg.content.substring(35);
                            tmpCat = tmpCat.replace('REPLACE', esRE(search_string));
                            var re = new RegExp(tmpCat, 'i');
                            var util = _.filter(charAttrs, function (attr) {
                                let x = attr.get('current') + '';
                                return (x.match(re) !== null);
                            });
                            if (util && util.length > 0) {
                                if (!state['RepPrinter'].screen_output) showDialog('', util.length + ' "' + search_string + '" current value search results found for ' + char_name + '. Printing...');
                                if (!state['RepPrinter'].screen_output) log('.'); // spacer
                                if (!state['RepPrinter'].screen_output) log('-------------- BEGIN "' + search_string + '" current value search results for ' + char_name + ' --------------');
                                var row_id = '';
                                _.each(util, function (row) {
                                    var tmp_row_id = row.get('name').split('_')[2];
                                    if (row_id !== '' && row_id !== tmp_row_id) {
                                        if (!state['RepPrinter'].screen_output) log('--------------');
                                    }
                                    if (!state['RepPrinter'].screen_output) log(row.get('name') + ' = ' + row.get('current'));
                                    message += row.get('name') + ' (' + (typeof row.get('current')) + ') = ' + row.get('current').toString().replace(/\n/g, '<br>') + '<br>';
                                    row_id = tmp_row_id;
                                });
                                if (!state['RepPrinter'].screen_output) log('--------------- END "' + search_string + '" current value search results for ' + char_name + ' ---------------');
                                if (state['RepPrinter'].screen_output) showDialog('Results', 'Attributes whose current value contains "' + search_string + '":<br><pre style="font-size: 11px;">' + generateSafeOutput(message) + '</pre>');
                                setTimeout(function () {
                                    if (!state['RepPrinter'].screen_output) showDialog('Complete', 'Printed ' + util.length + ' "' + search_string + '" current value searches for ' + char_name + '.');
                                }, 1000);
                            } else {
                                showDialog('Not Found', char_name + ' has no attributes with a current value containing "' + search_string + '".');
                            }
                        } else {
                            //var tmpCat = repstrings[category];
                            if (category == 'random') {
                                search_string = msg.content.substring(35);
                                tmpCat = tmpCat.replace('REPLACE', esRE(search_string));
                            }
                            var re = new RegExp(tmpCat, 'i');
                            var util = _.filter(charAttrs, function (attr) {
                                return (attr.get('name').match(re) !== null);
                            });
                            if (util && util.length > 0) {
                                if (!state['RepPrinter'].screen_output) showDialog('', util.length + ' "' + search_string + '" attributes found for ' + char_name + '. Printing...');
                                if (!state['RepPrinter'].screen_output) log('.'); // spacer
                                if (!state['RepPrinter'].screen_output) log('-------------- BEGIN attribute name search containing "' + search_string + '" for ' + char_name + ' --------------');
                                var row_id = '';
                                _.each(util, function (row) {
                                    var tmp_row_id = row.get('name').split('_')[2];
                                    if (row_id !== '' && row_id !== tmp_row_id) {
                                        if (!state['RepPrinter'].screen_output) log('--------------');
                                    }
                                    if (!state['RepPrinter'].screen_output) log(getNameAfterID(row.get('name')) + ' = ' + row.get('current'));
                                    message += getNameAfterID(row.get('name')) + ' (' + (typeof row.get('current')) + ') = ' + row.get('current').toString().replace(/\n+/gm, '<br>') + '<br>';
                                    row_id = tmp_row_id;
                                });
                                if (!state['RepPrinter'].screen_output) log('--------------- END attribute name search containing "' + search_string + '" for ' + char_name + ' ---------------');

                                if (state['RepPrinter'].screen_output) showDialog('Results', 'Attributes whose names contain "' + search_string + '":<br><pre style="font-size: 11px; padding: 3px;">' + generateSafeOutput(message) + '</pre>');
                                setTimeout(function () {
                                    if (!state['RepPrinter'].screen_output) showDialog('Complete', 'Printed ' + util.length + ' attributes whose names contain "' + search_string + '" for ' + char_name + '.');
                                }, 1000);
                            } else {
                                showDialog('Not Found', char_name + ' has no attributes with a name containing "' + search_string + '".');
                            }
                        }

                    } else {
                        showDialog('Error', '"' + category + '" is not a valid category.<br><div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!print help">Get Help</a></div>', true);
                    }
				}
			} else {
                showDialog('Error', 'You didn\'t send all the required parameters. Proper syntax is:<br><br><span style=\'' + styles.code + '\'>!print character_id category [search_criteria]</span><br><br>Try again.', true);
			}
		}
    },

    commandCSV = function (char_id) {
        //OGL Sheet inventory only!
        var ids = [], items = [], charAttrs = findObjs({type: 'attribute', characterid: char_id}, {caseInsensitive: true});
        var itemNames = _.filter(charAttrs, function (attr) { return attr.get('name').match(/^repeating_inventory_(.+)_itemname$/) !== null; });
        var elements = ['itemname', 'itemproperties', 'itemmodifiers', 'itemweight', 'hasattack', 'useasresource', 'itemcontent', 'equipped'];

        // Collect IDs
        _.each(itemNames, function (item) {
            var tmpID = item.get('name').replace(/^repeating_inventory_([^_]+)_(.+)$/, '$1');
            ids.push(tmpID);
        });
        ids = _.uniq(ids);

        // Collect all attribute elements for each ID
        _.each(ids, function (id) {
            var tmpItem = {}, tmpO;
            _.each(elements, function (e) {
                if (_.find(charAttrs, function (attr) { return attr.get('name').match('repeating_inventory_' + id + '_' + e) !== null; })) {
                    tmpO = findObjs({ type: 'attribute', characterid: char_id, name: 'repeating_inventory_' + id + '_' + e })[0];
                    if (tmpO) {
                        var tmpVal = tmpO.get('current');
                        tmpItem[e] = tmpVal != 'undefined' ? tmpVal.toString().trim().replace(/[\r|\n|\r\n]+/gm, ' ') : '';
                    } else tmpItem[e] = '';
                }
            });

            // Set default values
            if (!tmpItem.hasattack) tmpItem.hasattack = 0;
            if (!tmpItem.useasresource) tmpItem.useasresource = 0;

            items.push(tmpItem);
        });

        // Generate CSV text (TAB DELIMITED)
        var csv_text = '<pre style="font-size: 11px; padding: 3px; margin:0;">' + elements.join('	');
        _.each(items, function (item) {
            csv_text += '<br>' + item.itemname + '	' + item.itemproperties + '	' + item.itemmodifiers
            csv_text += '	' + item.itemweight + '	' + item.hasattack + '	' + item.useasresource;
        });
        csv_text += '</pre>';
        showDialog('Tab Delimited', 'Copy & paste to text file:<br>' + csv_text.replace(/\r\n/gi, '\r\n'));
    },

    commandPageVals = function (msg) {
        var page = getObj('page', Campaign().get("playerpageid"));
        log('page = ' + JSON.stringify(page));

    },

    commandConfig = function (msg) {
        var message = '', parms = msg.content.split(/\s*\-\-/i);
        if (parms[1]) {
            if (parms[1] == 'toggle-screen') state['RepPrinter'].screen_output = !state['RepPrinter'].screen_output;
            if (parms[1] == 'toggle-archive') state['RepPrinter'].store_chat = !state['RepPrinter'].store_chat;
            if (parms[1] == 'toggle-abbreviate') state['RepPrinter'].shorten_name = !state['RepPrinter'].shorten_name;
        }

        message += '<div style=\'' + styles.title + '\'>Results Output</div>';
        message += 'When turned on, results are sent to the Chat Window. When off they will be printed to the API Output Console. <a style="' + styles.textButton + '" href="!print config --toggle-screen"> turn ' + (state['RepPrinter'].screen_output ? 'off' : 'on') + '</a><br><br>';

        message += '<div style=\'' + styles.title + '\'>Name Abbreviation</div>';
        message += 'When turned on, attribute names for repeating sections will be abbreviated to only include text after the attribute ID. <a style="' + styles.textButton + '" href="!print config --toggle-abbreviate"> turn ' + (state['RepPrinter'].shorten_name ? 'off' : 'on') + '</a><br><br>';

        message += '<div style=\'' + styles.title + '\'>Results Archiving</div>';
        message += 'When turned on, results sent to the Chat Window will be archived. This <b>cannot</b> archive results sent to the API Output Console. <a style="' + styles.textButton + '" href="!print config --toggle-archive"> turn ' + (state['RepPrinter'].store_chat ? 'off' : 'on') + '</a>';

        message += '<div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!print help">Help Menu ➤</a></div>';

        message += '<hr style="margin: 6px 0;"><p>See the <a style="' + styles.textButton + '" href="https://github.com/blawson69/RepPrinter">documentation</a> for complete instructions.</p>';
        showDialog('', message, true);
	},

    commandHelp = function (msg) {
        var message = 'Use <span style=\'' + styles.code + '\'>!print [character_id] [category_name]</span> to list all attributes of the specified category for the indicated character.';
        message += '<br><br>Supported D&D 5E by Roll20 attributes: "inventory", "attack", "resource", "spell", "proficiencies", and "traits". Spells ';
        message += '<br><br>Supported Shaped Sheet attributes: "equipment", "spells", "utility", "offense", "ammo", "skills", "armor", "class", "modifiers", "classfeature", and "attachers"';

        message += '<br><br>Use <span style=\'' + styles.code + '\'>!print [character_id] random [search_string]</span> to list all attributes with a name containing the search string.';
        message += '<br><br>Use <span style=\'' + styles.code + '\'>!print [character_id] curval [search_string]</span> to list all attributes whose current value contains the search string.';

        message += '<div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!print config">Config Menu ➤</a></div>';

        message += '<hr style="margin: 6px 0;"><p>See the <a style="' + styles.textButton + '" href="https://github.com/blawson69/RepPrinter">documentation</a> for complete instructions.</p>';

        showDialog('Help Menu', message, true);
    },

	showDialog = function (title, content, admin = false) {
        title = (title == '') ? '' : '<div style=\'' + styles.title + '\'>' + title + '</div>';
        var body = '<div style=\'' + styles.box + '\'>' + title + '<div>' + content + '</div></div>';
        if (admin) sendChat('RepPrinter','/w GM ' + body, null, {noarchive:true});
        else sendChat('RepPrinter','/w GM ' + body, null, {noarchive:state['RepPrinter'].store_chat});
	},

    // Prevent proccessing of macros and roll template markdown when results are sent to chat
    generateSafeOutput = function (text) {
        var safeText = text.toString().replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        return safeText;
    },

    getNameAfterID = function (rep_name) {
        var parts = rep_name.split('_'), new_name = [];
        if (parts[0] == 'repeating' && state['RepPrinter'].shorten_name) {
            var id_index = _.findIndex(parts, function (x) { return x.startsWith('-'); });
            for (var x = id_index + 1; x < _.size(parts); x++) {
                new_name.push(parts[x]);
            }
            new_name = new_name.join('_');
        } else new_name = rep_name;
        return new_name;
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
