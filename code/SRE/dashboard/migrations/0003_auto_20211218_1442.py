# Generated by Django 3.2.9 on 2021-12-18 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_auto_20211217_2110'),
    ]

    operations = [
        migrations.RenameField(
            model_name='favor',
            old_name='project',
            new_name='Project',
        ),
        migrations.AddField(
            model_name='favor',
            name='Info',
            field=models.TextField(default=None),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='chart',
            name='ChartType',
            field=models.CharField(choices=[('2', 'StackedBarChart'), ('3', 'PieChart'), ('4', 'LineChart'), ('1', 'BarChart')], max_length=10),
        ),
    ]