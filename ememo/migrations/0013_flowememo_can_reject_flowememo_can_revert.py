# Generated by Django 4.2.7 on 2023-12-10 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ememo', '0012_log_delete_logememo'),
    ]

    operations = [
        migrations.AddField(
            model_name='flowememo',
            name='can_reject',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
        migrations.AddField(
            model_name='flowememo',
            name='can_revert',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
    ]
