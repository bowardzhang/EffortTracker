# Generated by Django 2.1.4 on 2018-12-05 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker_app', '0003_auto_20181205_0834'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projectwork',
            name='status',
            field=models.CharField(choices=[('0', 'to start'), ('1', 'ongoing'), ('2', 'ended'), ('3', 'other')], default='1', max_length=10),
        ),
    ]