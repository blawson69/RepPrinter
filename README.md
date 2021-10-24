# RepPrinter

This [Roll20](http://roll20.net/) script searches character attributes for reference when developing other scripts for the [5e Shaped Sheet](http://github.com/mlenser/roll20-character-sheets/tree/master/5eShaped) or the D&D 5E by Roll20 (OGL) Sheet. Results can be sent to the API Output Console or the chat window. The script allows passing a random string (no spaces) to print any character attribute with a name that matches that string, or searching for a string contained in the "current" value of an attribute.

## Search Methods
RepPrinter provides 3 different methods for searching a character's attributes. To perform a search, send the `!print` command along with the ID of the character you are referencing, the search method (see below), and the text string you wish to search for.

#### Category
These are pre-determined categories based on the repeating sections of each sheet. By naming one of these categories, you will list all attributes within that category. This will likely result in a very large list. No search string is required, and RepPrinter will ignore any you send.

Valid categories for the OGL sheet are "inventory", "attack", "spell", "resource", "proficiencies", and "traits". You may also narrow the spells down to the spell level by using "spell-" plus the level with no spaces. Use "spell-cantrip" for cantrips.

Categories for the Shaped Sheet are "equipment", "spells", "utility", "offense", "ammo", "skills", "spells", "armor", "class", "modifiers", "classfeature", and "attachers". You may also narrow the spells down to the spell level by using "spell" plus the level with no spaces, using "spell0" for cantrips.

Sending `!print -LpPHSepEatLGlHhi8VT resource` in an OGL sheet-based game will provide a list similar to the following:

```
other_resource_itemid = -Mk-T3fPBkxACfEFtbf8
other_resource_name = Arrows +1
other_resource = 1
repeating_resource_-MkOkAoIYBLJ-kZH7uh7_resource_left_itemid = -MkOkAo3eoJ01iYvgTfO
repeating_resource_-MkOkAoIYBLJ-kZH7uh7_resource_left_name = Sling bullets
repeating_resource_-MkOkAoIYBLJ-kZH7uh7_resource_left = 1
repeating_resource_-MkOkAoIYBLJ-kZH7uh7_resource_right_itemid = -MkOkDyMZL1S1dmvemzu
repeating_resource_-MkOkAoIYBLJ-kZH7uh7_resource_right_name = Crossbow bolts
repeating_resource_-MkOkAoIYBLJ-kZH7uh7_resource_right = 1
```

#### Current Value
You can use "curval" to search for a string value in an attribute's current value field. For instance, if you search for "eldritch" you will get a list of all attributes that have that word in the attribute's current value.

Example: `!print -LpdW9JPiXtWsuj7PVWM curval eldritch` can give you something like:

```
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellname = Eldritch Blast
repeating_attack_-LpizkJIvJ1wtSjPZ3ee_atkname = Eldritch Blast
```

#### Random
You can send "random" to search attributes for a part of the attribute name, followed by the string you wish to search. This string does not have to be a repeating item but must contain no spaces. Sending `!print -Mj5jPfvpFZWGuOKy5yQ random dmgtype` will give results similar to this:

```
repeating_attack_-MjjhgkXGZcdfL-YZIea_dmgtype = Bludgeoning
repeating_attack_-MjjhgkXGZcdfL-YZIeZ_atkdmgtype = 1d8+4 Bludgeoning
repeating_attack_-MjjhgkXGZcdfL-YZIea_atkdmgtype = 1d10+4 Bludgeoning
repeating_attack_-MjjhhlkZNaMr1p4m19e_dmgtype = Slashing
repeating_attack_-MjjhhlkZNaMr1p4m19e_atkdmgtype = 1d4+4 Slashing
repeating_attack_-Mjjn8ULrajygitzrz1B_dmgtype = Piercing
repeating_attack_-Mjjn8ULrajygitzrz1B_atkdmgtype = 1+3 Piercing
```

This method is handy if you want to list all attributes for a particular entry. For instance, if you do the above [Current Value](#current-value) search and you want all attributes for the "Eldritch Blast" spell, copy the ID "-LpizkEEWbjIbjXzWVZq" from the "repeating_spell" attribute name and send `!print -Mj5jPfvpFZWGuOKy5yQ random -LpizkEEWbjIbjXzWVZq`. This will give results like:

```
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelllevel = cantrip
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spell_ability = @{charisma_mod}+
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellname = Eldritch Blast
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellclass = Warlock
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelldescription = A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage. The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellcastingtime = 1 action
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelldamagetype = Force
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelldamage = 1d10
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellduration = Instantaneous
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellrange = 120 feet
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellschool = evocation
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelltarget = A creature within range
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellcomp_m = 0
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellattack = Ranged
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelloutput = ATTACK
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spell_damage_progression = Cantrip Beam
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_options-flag = 0
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellattackid = -LpizkJIvJ1wtSjPZ3ee
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_rollcontent = %{-LpdW9JPiXtWsuj7PVWM|repeating_attack_-LpizkJIvJ1wtSjPZ3ee_attack}
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellsavesuccess =
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelldamage2 =
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spelldamagetype2 =
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spellsave =
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_details-flag = 0
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spell_flags = v s
repeating_spell-cantrip_-LpizkEEWbjIbjXzWVZq_spell_dc = 14
```

Here are some sample macros:

```
!print @{selected|character_id} ?{Category|Equipment|Spells|Utility|Offense|Ammo|Skills|Armor|Class|Modifiers|Class Features,classfeature|Attachers}
!print @{selected|character_id} ?{Spell Level|All,spells|Cantrips,spell0|Level 1,spell1|Level 2,spell2|Level 3,spell3|Level 4,spell4|Level 5,spell5|Level 6,spell6|Level 7,spell7|Level 8,spell8|Level 9,spell9}
!print @{selected|character_id} random ?{Name fragment to find|}
```

## Configuration
You can set various output options based on the information you are looking for.
- **Results Output** - You can choose to send results to either the Chat Window or the API Output Console. The Output Console is the safest place to send results, but requires having the API Scripts page open in a separate tab and jumping back and forth. Copying the results to use elsewhere, if needed, will require a few more steps to clean up the text.

  If you send results to the Chat Window, the results with be formatted to allow easy copying right from the window. However, to keep Roll20 from processing any macros or roll templates that exist in the text, RepPrinter will make the following substitutions: Curly Braces `{}` are replaced with Left and Right Angle Quotation Marks `«»` while Brackets `[]` are replaced with Left and Right Single Quotation Marks `‹›`.

- **Results Archiving** - When sending resuls to the Chat Window, you can choose whether these results are archived for future reference. By default, archiving is turned off.
- **Name Abbreviation** - Attribute names for repeating sections all begin with "repeating" followed by the section name (inventory, armor, etc.) and then the attribute ID, all separated with underscores (_). This "repeating_section-name_attribute-id_attribute-name" naming can take up a lot of room, particularly when that part of the name is not relevant to you. To accommodate this, you can remove the "repeating_section-name_attribute-id" portion of attribute names by turning this feature on. By default, name abbreviation is off.

  Note: This applies to all searches except for the [Current Value](#search-methods) search type.
