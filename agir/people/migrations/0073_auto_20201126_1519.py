# Generated by Django 3.1.3 on 2020-11-26 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0072_auto_20201121_1320"),
    ]

    operations = [
        migrations.AlterField(
            model_name="person",
            name="subscribed_sms",
            field=models.BooleanField(
                blank=True,
                default=True,
                help_text="Nous envoyons parfois des SMS plutôt que des emails lors des grands événements&nbsp;! Vous ne recevrez que les informations auxquelles vous êtes abonné⋅e.",
                verbose_name="Recevoir les SMS d'information",
            ),
        ),
    ]
