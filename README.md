# RepPrinter

Outputs a [5e Shaped Sheet](http://github.com/mlenser/roll20-character-sheets/tree/master/5eShaped) character's repeating items into the API Output Console for reference when developing other scripts.

## How to Use

Sent the `!print` command along with the category of repeating items you wish to view and the ID of the character you are referencing. Valid categories are "equipment", "spells", "utility", "offense", "ammo", "skills", "armor", and "class". You may also narrow the spells down to the spell level by using "spell" plus the level with no spaces. Use "spell0" for cantrips.

Here are some macros for your convenience:

`!print ?{Category|Equipment|Spells|Utility|Offense|Ammo|Skills|Armor|Class} @{selected|character_id}`

`!print ?{Spell Level|All,spells|Cantrips,spell0|Level 1,spell1|Level 2,spell2|Level 3,spell3|Level 4,spell4|Level 5,spell5|Level 6,spell6|Level 7,spell7|Level 8,spell8|Level 9,spell9} @{selected|character_id}`
