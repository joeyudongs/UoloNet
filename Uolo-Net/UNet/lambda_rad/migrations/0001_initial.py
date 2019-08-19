# Generated by Django 2.1.2 on 2018-11-16 17:49

from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Dosimetry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('roi', models.CharField(max_length=1024)),
                ('type', models.CharField(max_length=30)),
                ('dose', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10)),
                ('volume', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('data_folder', models.CharField(default='', max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='MedicalRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=1024)),
                ('value', models.CharField(max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient_id', models.CharField(max_length=30)),
                ('name', models.CharField(blank=True, default='', max_length=100)),
                ('name_first', models.CharField(blank=True, default='', max_length=50)),
                ('name_middle', models.CharField(blank=True, default='', max_length=50)),
                ('name_last', models.CharField(blank=True, default='', max_length=50)),
                ('gender', models.CharField(blank=True, max_length=30)),
                ('race', models.CharField(blank=True, max_length=30)),
                ('age', models.IntegerField(blank=True, default=0)),
                ('birth_date', models.CharField(max_length=30, null=True)),
                ('data_folder', models.CharField(default='', max_length=1024)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lambda_rad.Institution')),
            ],
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('uid', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('description', models.CharField(max_length=1024)),
                ('date', models.CharField(max_length=50)),
                ('modality', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Study',
            fields=[
                ('uid', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('description', models.CharField(max_length=1024)),
                ('date', models.CharField(default='00000000', max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='medicalrecord',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lambda_rad.Patient'),
        ),
        migrations.AddField(
            model_name='dosimetry',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lambda_rad.Patient'),
        ),
    ]
