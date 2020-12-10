# Generated by Django 3.1.3 on 2020-12-08 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0087_auto_20201207_1450"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="for_users",
            field=models.CharField(
                choices=[
                    ("I", "Les insoumis⋅es"),
                    ("2", "Les signataires « Nous Sommes Pour ! »"),
                ],
                default="I",
                max_length=1,
                verbose_name="Utilisateur⋅ices de la plateforme concerné⋅es par l'événement",
            ),
        ),
    ]
