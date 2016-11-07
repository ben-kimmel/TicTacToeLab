#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import json
import os
import random

from google.appengine.ext import ndb
import jinja2
import webapp2
from models import TttStats

jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    autoescape=True)

stats_key = "Stats_Key"

class MainPage(webapp2.RequestHandler):
    def get(self):
        values = {}
        stats = TttStats.get_by_id(stats_key)
        if (not (stats)):
            stats = TttStats(id=stats_key)
            stats.put()
        values["wins"] = stats.wins
        values["ties"] = stats.ties
        values["losses"] = stats.losses
        template = jinja_env.get_template("templates/ttt.html")
        self.response.out.write(template.render(values))


class ResetStatsAction(webapp2.RequestHandler):
    def post(self):
        stats = TttStats.get_by_id(stats_key)
        stats.wins = 0
        stats.losses = 0
        stats.ties = 0
        stats.put()
        self.response.headers["Content-type"] = "application/json"
        response = {"wins" : stats.wins,
                    "losses": stats.losses,
                    "ties": stats.ties}
        self.response.out.write(json.dumps(response))
        pass

class GameCompleteAction(webapp2.RequestHandler):
    def post(self):
        result = self.request.get("result")
        stats = TttStats.get_by_id(stats_key)
        if (result == "win"):
            stats.wins = stats.wins + 1
        elif (result == "loss"):
            stats.losses = stats.losses + 1
        else:
            stats.ties = stats.ties + 1
        stats.put()
        self.response.headers["Content-type"] = "application/json"
        response = {"wins" : stats.wins,
                    "losses": stats.losses,
                    "ties": stats.ties}
        self.response.out.write(json.dumps(response))
        pass


def get_move_for_game(game_string):
    """  Returns the index for the computer players move given a 9 character game string. """
    open_square_occurrences = [i for i, letter in enumerate(game_string) if letter == "-"]
    return random.choice(open_square_occurrences)


class GetMove(webapp2.RequestHandler):
    def get(self):
        game_string = self.request.get("gamestring")
        move = get_move_for_game(game_string)
        self.response.headers["Content-type"] = "application/json"
        response = {"computer_move":move}
        self.response.out.write(json.dumps(response))
        pass


app = webapp2.WSGIApplication([
    ("/", MainPage),
    ("/resetstats", ResetStatsAction),
    ("/gamecomplete", GameCompleteAction),
    ("/getmove", GetMove),
], debug=True)
