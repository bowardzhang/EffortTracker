# Generated by Django 2.1.4 on 2018-12-05 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker_app', '0002_auto_20181204_1638'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectwork',
            name='status',
            field=models.CharField(choices=[(0, 'to start'), (1, 'ongoing'), (2, 'ended'), (3, 'other')], default=1, max_length=10),
        ),
        migrations.AlterField(
            model_name='workeffort',
            name='work_issue',
            field=models.TextField(blank=True, default=''),
        ),
    ]
