# Generated by Django 2.1.7 on 2019-04-05 12:58

from django.db import migrations, models


def subscrib_sms_forward(apps, schema):
    Person = apps.get_model("people", "Person")

    Person.objects.update(
        subscribed_sms=models.Case(
            models.When(subscribed=True, then=models.Value(True)),
            default=models.Value(False),
        )
    )


class Migration(migrations.Migration):

    dependencies = [("people", "0053_auto_20190402_1140")]

    operations = [
        migrations.AddField(
            model_name="person",
            name="subscribed_sms",
            field=models.BooleanField(
                blank=True,
                default=True,
                help_text="Vous recevrez des SMS de la France insoumise comme des meeting près de chez vous ou des appels à volontaire...",
                verbose_name="Recevoir les SMS d'information",
            ),
        ),
        migrations.RunPython(
            code=subscrib_sms_forward, reverse_code=migrations.RunPython.noop
        ),
    ]
