# Generated by Django 4.2.7 on 2023-12-29 03:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ememo', '0020_alter_ememo_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ememo',
            name='step',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('Reject', 'Reject'), ('Cancel', 'Cancel'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], default='Drafted', max_length=13),
        ),
        migrations.AlterField(
            model_name='flowememo',
            name='source',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('Reject', 'Reject'), ('Cancel', 'Cancel'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], max_length=13),
        ),
        migrations.AlterField(
            model_name='flowememo',
            name='target',
            field=models.CharField(choices=[('Drafted', 'Drafted'), ('Reject', 'Reject'), ('Cancel', 'Cancel'), ('PRE_APPROVE', 'PRE_APPROVE'), ('FINAL_APPROVE', 'FINAL_APPROVE'), ('DONE', 'DONE')], max_length=13),
        ),
    ]