# Generated by Django 4.2.7 on 2023-12-07 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ememo', '0002_alter_ememo_step'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ememo',
            name='action',
            field=models.TextField(blank=True, choices=[('Approve', 'Approve'), ('Reject', 'Reject'), ('Save', 'Save')], default='Save', null=True),
        ),
    ]