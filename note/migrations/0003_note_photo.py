# Generated by Django 4.2.7 on 2023-11-29 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('note', '0002_rename_department_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='photo',
            field=models.ImageField(null=True, upload_to='images/'),
        ),
    ]
