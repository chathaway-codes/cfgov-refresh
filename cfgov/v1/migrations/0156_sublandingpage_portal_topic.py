# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-04-29 18:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0155_add_venue_coords_to_existing_events'),
    ]

    operations = [
        migrations.AddField(
            model_name='sublandingpage',
            name='portal_topic',
            field=models.ForeignKey(blank=True, help_text=b'Select a topic if this is a MONEY TOPICS portal page.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='portal_pages', to='v1.PortalTopic'),
        ),
    ]
