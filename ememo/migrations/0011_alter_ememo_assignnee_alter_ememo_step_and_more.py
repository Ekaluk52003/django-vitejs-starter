# Generated by Django 4.2.7 on 2023-12-09 00:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ememo', '0010_alter_flowememo_moderator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ememo',
            name='assignnee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assignnee', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='ememo',
            name='step',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], default='Drafted', max_length=13),
        ),
        migrations.AlterField(
            model_name='flowememo',
            name='source',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], max_length=13),
        ),
        migrations.AlterField(
            model_name='flowememo',
            name='target',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], max_length=13),
        ),
        migrations.AlterField(
            model_name='logememo',
            name='source',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], max_length=13),
        ),
        migrations.AlterField(
            model_name='logememo',
            name='target',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], max_length=13),
        ),
    ]
