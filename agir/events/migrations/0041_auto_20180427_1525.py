# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-27 13:25
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0040_rsvp_subscription'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rsvp',
            old_name='subscription',
            new_name='form_submission',
        ),
    ]