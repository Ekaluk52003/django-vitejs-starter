# Generated by Django 4.2.7 on 2023-12-07 14:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import ememo.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Ememo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title')),
                ('content', models.TextField(verbose_name='Content')),
                ('file', models.FileField(blank=True, null=True, upload_to='files/', validators=[ememo.validators.validate_file_size])),
                ('action', models.TextField(blank=True, choices=[('Approve', 'Approve'), ('Reject', 'Reject')], null=True)),
                ('step', models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'Pre Approve'), ('FINAL_APPROVE', 'Final Approve'), ('DONE', 'Done')], max_length=13)),
                ('approver', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='approver', to=settings.AUTH_USER_MODEL)),
                ('assignnee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assignnee', to=settings.AUTH_USER_MODEL)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('reviewer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviewer', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FlowEmemo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source', models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'Pre Approve'), ('FINAL_APPROVE', 'Final Approve'), ('DONE', 'Done')], max_length=13)),
                ('target', models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'Pre Approve'), ('FINAL_APPROVE', 'Final Approve'), ('DONE', 'Done')], max_length=13)),
            ],
        ),
        migrations.CreateModel(
            name='LogEmemo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source', models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'Pre Approve'), ('FINAL_APPROVE', 'Final Approve'), ('DONE', 'Done')], max_length=13)),
                ('target', models.CharField(choices=[('Drafted', 'Drafted'), ('PRE_APPROVE', 'Pre Approve'), ('FINAL_APPROVE', 'Final Approve'), ('DONE', 'Done')], max_length=13)),
                ('ememo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ememo', to='ememo.ememo')),
                ('logBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]