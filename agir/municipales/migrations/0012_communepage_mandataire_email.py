# Generated by Django 2.2.9 on 2020-02-17 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("municipales", "0011_communepage_contact_email")]

    operations = [
        migrations.AddField(
            model_name="communepage",
            name="mandataire_email",
            field=models.EmailField(
                blank=True,
                help_text="Nous aurons sans doute besoin pendant et après la campagne de transmettre des documents légaux au mandataire financier. Indiquez-nous une adresse qui nous permettra de le⋅a contacter à ce moment.",
                max_length=255,
                verbose_name="Adresse email du mandataire financier",
            ),
        )
    ]