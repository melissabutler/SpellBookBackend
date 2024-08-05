"use strict";

const { default: axios } = require('axios');
const db = require('./db');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('./expressError')

const BASE_URL = 'https://www.dnd5eapi.co/api';

/** Class for calling the DND 5e API
 * 
 * API only supports GET methods, therefore all calls are GET.
 */
class Spell{
    // CONSOLIDATE INTO ONE FOR ONE CALL?
    /** Get a list of all spells */
    static async getAllSpells() {
        let res = await axios.get(`${BASE_URL}/spells`)
        return res.data;
    }

    /** Get a list of spells filtered by Level */

    static async getSpellsByLevel(level) {
        let res = await axios.get(`${BASE_URL}/spells?level=${level}`)
        return res.data;
    }

    /** Get a list of spells filtered by class */

    static async getSpellsByClass(dndClass) {
        let res = await axios.get(`${BASE_URL}/classes/${dndClass}/spells`)
    }

    /** Get information on a single spell based on spell index.  */

        

}

module.exports = Spell;

/** 
 * 
 * Spell List Call Responses
 * 
 * 
Get list of spells

 * GET /api/spells
 * {
  "count": 319,
  "results": [
    {
      "index": "acid-arrow",
      "name": "Acid Arrow",
      "level": 2,
      "url": "/api/spells/acid-arrow"
    },


Get list of spells filtered by level

    GET /api/spells?level=4

Get spells by class

    NOTE: This is seperate from the mains spells page, which only takes by level or school

    GET/api/classes/:index/spells

Get spells by class AND level

    GET /api/classes/:index/levels/:spell_level/spells

Get spell by Spell Index

 * GET /api/spells/:index
 * 
 * {
    "higher_level": [],
    "index": "alarm",
    "name": "Alarm",
    "desc": [
      "You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.",
      "A mental alarm alerts you with a ping in your mind if you are within 1 mile of the warded area. This ping awakens you if you are sleeping.",
      "An audible alarm produces the sound of a hand bell for 10 seconds within 60 feet."
    ],
    "range": "30 feet",
    "components": [
      "V",
      "S",
      "M"
    ],
    "material": "A tiny bell and a piece of fine silver wire.",
    "ritual": true,
    "duration": "8 hours",
    "concentration": false,
    "casting_time": "1 minute",
    "level": 1,
    "area_of_effect": {
      "type": "cube",
      "size": 20
    },
    "school": {
      "index": "abjuration",
      "name": "Abjuration",
      "url": "/api/magic-schools/abjuration"
    },
    "classes": [
      {
        "index": "ranger",
        "name": "Ranger",
        "url": "/api/classes/ranger"
      },
      {
        "index": "wizard",
        "name": "Wizard",
        "url": "/api/classes/wizard"
      }
    ],
    "subclasses": [
      {
        "index": "lore",
        "name": "Lore",
        "url": "/api/subclasses/lore"
      }
    ],
    "url": "/api/spells/alarm"
  }

 */