# Generated by Django 2.2 on 2019-05-11 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("people", "0054_person_subscribed_sms")]

    operations = [
        migrations.AddField(
            model_name="personform",
            name="result_url_uuid",
            field=models.UUIDField(
                editable=False,
                null=True,
                verbose_name="UUID pour l'affichage des résultats",
            ),
        )
    ]
