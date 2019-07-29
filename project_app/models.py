from django.db import models

# Create your models here.

class Game(models.Model):
    username = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return unicode(self.date)