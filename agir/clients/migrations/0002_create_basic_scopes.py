# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-06-09 14:55
from __future__ import unicode_literals

from django.db import migrations


basic_scopes = [
    ("get_profile", "Obtenir l'url du profil"),
    ("view_profile", "Voir mon profil"),
    ("edit_profile", "Changer mon profil"),
    ("edit_event", "Éditer mes événements"),
    ("edit_rsvp", "Voir et éditer mes participations aux événements"),
    ("edit_supportgroup", "Éditer mes groupes d'appui"),
    ("edit_membership", "Voir et éditer mes participations aux groups d'appui"),
    ("edit_authorization", "Éditer mes autorisations d'accès"),
]


def create_base_scopes(apps, schema):
    Scope = apps.get_model("clients", "Scope")

    for label, description in basic_scopes:
        Scope.objects.create(label=label, description=description)


def remove_basic_scopes(apps, schema):
    Scope = apps.get_model("clients", "Scope")

    Scope.objects.filter(label__in=[label for label, _ in basic_scopes]).delete()


class Migration(migrations.Migration):

    dependencies = [("clients", "0001_initial")]

    operations = [
        migrations.RunPython(create_base_scopes, remove_basic_scopes, atomic=True)
    ]
