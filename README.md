# RepPrinter

Originally created to output a [5e Shaped Sheet](http://github.com/mlenser/roll20-character-sheets/tree/master/5eShaped) character's repeating item attributes into the API Output Console for reference when developing other scripts. Now the script allows passing a random string (no spaces) to print any character attribute that matches that string.

## How to Use

Sent the `!print` command along with the ID of the character you are referencing then the category of repeating items you wish to view. Valid categories are "equipment", "spells", "utility", "offense", "ammo", "skills", "armor", "class", "modifiers", and "attachers". You may also narrow the spells down to the spell level by using "spell" plus the level with no spaces, using "spell0" for cantrips.

You can send "random" as the category to search for a random string, followed by the string you wish to search. This string does not have to be a repeating item but must contain no spaces.

Here are some sample macros:

`!print @{selected|character_id} ?{Category|Equipment|Spells|Utility|Offense|Ammo|Skills|Armor|Class|Modifiers|Attachers|Random,random ?&#123;String&#125;}`

`!print @{selected|character_id} ?{Spell Level|All,spells|Cantrips,spell0|Level 1,spell1|Level 2,spell2|Level 3,spell3|Level 4,spell4|Level 5,spell5|Level 6,spell6|Level 7,spell7|Level 8,spell8|Level 9,spell9}`
