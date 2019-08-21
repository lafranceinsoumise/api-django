# Generated by Django 2.1.4 on 2018-12-11 17:26

import agir.donations.model_fields
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import dynamic_filenames

import agir.payments.model_fields


class Migration(migrations.Migration):

    dependencies = [("donations", "0004_auto_20181204_2135")]

    operations = [
        migrations.AddField(
            model_name="spendingrequest",
            name="operation",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="spending_request",
                to="donations.Operation",
            ),
        ),
        migrations.AlterField(
            model_name="document",
            name="file",
            field=models.FileField(
                upload_to=dynamic_filenames.FilePattern(
                    filename_pattern="financement/request/{instance.request_id}/{uuid:s}{ext}"
                ),
                validators=[
                    django.core.validators.FileExtensionValidator(
                        [
                            "doc",
                            "docx",
                            "odt",
                            "xls",
                            "xlsx",
                            "ods",
                            "pdf",
                            "png",
                            "jpeg",
                            "jpg",
                            "gif",
                        ]
                    )
                ],
                verbose_name="Fichier",
            ),
        ),
        migrations.AlterField(
            model_name="spendingrequest",
            name="amount",
            field=agir.payments.model_fields.AmountField(
                help_text="Pour que cette demande soit payée, la somme allouée à votre groupe doit être suffisante.",
                verbose_name="Montant de la dépense",
            ),
        ),
        migrations.AlterField(
            model_name="spendingrequest",
            name="status",
            field=models.CharField(
                choices=[
                    ("D", "Brouillon à compléter"),
                    ("G", "En attente de validation par un autre animateur"),
                    (
                        "R",
                        "En attente de vérification par l'équipe de suivi des questions financières",
                    ),
                    ("I", "Informations supplémentaires requises"),
                    ("V", "Validée, en attente des fonds"),
                    ("T", "Décomptée de l'allocation du groupe, à payer"),
                    ("P", "Payée"),
                    ("B", "Cette demande a été refusée"),
                ],
                default="D",
                max_length=1,
                verbose_name="Statut",
            ),
        ),
    ]
