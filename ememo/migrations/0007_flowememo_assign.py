# Generated by Django 4.2.7 on 2023-12-08 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ememo', '0006_alter_ememo_approver_alter_ememo_reviewer'),
    ]

    operations = [
        migrations.AddField(
            model_name='flowememo',
            name='assign',
            field=models.TextField(blank=True, null=True, verbose_name='Assign To'),
        ),
    ]
