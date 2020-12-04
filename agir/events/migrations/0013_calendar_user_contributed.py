# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-09-28 17:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("events", "0012_event_coordinates_type")]

    operations = [
        migrations.AddField(
            model_name="calendar",
            name="user_contributed",
            field=models.BooleanField(
                default=False,
                verbose_name="Les utilisateurs peuvent ajouter des événements",
            ),
        )
    ]
