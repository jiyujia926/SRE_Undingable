# Generated by Django 3.2.9 on 2021-12-20 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_auto_20211218_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='chart',
            name='Visible',
            field=models.BooleanField(default=True),
        ),
    ]