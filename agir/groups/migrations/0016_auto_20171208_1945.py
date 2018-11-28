# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-12-08 18:45
from __future__ import unicode_literals

import dynamic_filenames
from django.db import migrations
import stdimage.models


class Migration(migrations.Migration):

    dependencies = [("groups", "0015_auto_20171205_1849")]

    operations = [
        migrations.AlterField(
            model_name="supportgroup",
            name="image",
            field=stdimage.models.StdImageField(
                blank=True,
                help_text="Vous pouvez ajouter une image de bannière : elle apparaîtra sur la page, et sur les réseaux sociaux en cas de partage. Préférez une image à peu près deux fois plus large que haute. Elle doit faire au minimum 1200 pixels de large et 630 de haut pour une qualité optimale.",
                upload_to=dynamic_filenames.FilePattern(
                    filename_pattern="{app_label}/{model_name}/{instance.id}/banner{ext}"
                ),
                verbose_name="image",
            ),
        )
    ]
