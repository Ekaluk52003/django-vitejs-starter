# Generated by Django 4.2.7 on 2023-12-10 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_customuser_fullname_customuser_jobtitle'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='fullname',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Full Name'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='jobtitle',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Job Title'),
        ),
    ]