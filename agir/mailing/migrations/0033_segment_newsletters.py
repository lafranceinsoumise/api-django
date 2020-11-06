# Generated by Django 3.1.2 on 2020-11-05 11:59

import agir.lib.model_fields
from django.db import migrations, models


def default_to_lfi(apps, schema_editor):
    Segment = apps.get_model("mailing", "Segment")
    for s in Segment.objects.all():
        s.newsletters = ["LFI"]
        s.save(update_fields=["newsletters"])


class Migration(migrations.Migration):

    dependencies = [
        ("mailing", "0032_auto_20201021_1525"),
    ]

    operations = [
        migrations.AddField(
            model_name="segment",
            name="newsletters",
            field=agir.lib.model_fields.ChoiceArrayField(
                base_field=models.CharField(
                    choices=[
                        ("LFI", "Lettre d'information de la France insoumise"),
                        ("2022", "Lettre d'information de"),
                    ],
                    max_length=255,
                ),
                default=("LFI",),
                help_text="Inclure les personnes abonnées aux newsletters suivantes",
                size=None,
            ),
        ),
        migrations.RunPython(default_to_lfi),
    ]