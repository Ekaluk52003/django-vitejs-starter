# Generated by Django 4.2.7 on 2023-12-27 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_runnumber_running_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='runnumber',
            name='running_number',
            field=models.IntegerField(blank=True, null=True, verbose_name='Running Number'),
        ),
    ]
