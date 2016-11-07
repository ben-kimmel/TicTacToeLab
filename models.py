from google.appengine.ext import ndb


class TttStats(ndb.Model):
    wins = ndb.IntegerProperty(default=0)
    ties = ndb.IntegerProperty(default=0)
    losses = ndb.IntegerProperty(default=0)