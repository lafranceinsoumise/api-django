# Generated by Django 2.1.5 on 2019-02-08 16:43
from django.db import migrations

import agir.lib.model_fields


class Migration(migrations.Migration):

    dependencies = [("donations", "0010_auto_20190205_1807")]

    operations = [
        migrations.AlterField(
            model_name="spendingrequest",
            name="iban",
            field=agir.lib.model_fields.IBANField(
                help_text="Indiquez le RIB du prestataire s'il s'agit d'un réglement, ou le RIB de la personne concernée s'il s'agit d'un remboursement.",
                max_length=34,
                verbose_name="RIB (format IBAN)",
                allowed_countries=["FR"],
            ),
        )
    ]