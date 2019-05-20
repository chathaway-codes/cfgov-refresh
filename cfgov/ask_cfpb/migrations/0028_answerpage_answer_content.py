# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-01 23:22
from __future__ import unicode_literals
import json

from django.db import migrations
import v1.atomic_elements.organisms
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields
from wagtail.wagtailcore.blocks import StreamValue


def migrate_answer_to_streamfield(apps, schema_editor):  
    AnswerPage = apps.get_model('ask_cfpb', 'AnswerPage')   
    for page in AnswerPage.objects.all():
        text_block = {
            'type': 'text',
            'value': {
                'content': page.answer
            }
        }
        page.answer_content = StreamValue(page.answer_content.stream_block,[text_block],True,)
        page.save()
        for revision in page.revisions.all():    
            content = json.loads(revision.content_json) 
            content['answer_content'] = json.dumps([
                {
                    'type': 'text',
                    'value': {
                        'content': content['answer']
                    }
                }
            ])
            revision.content_json = json.dumps(content) 
            revision.save()


class Migration(migrations.Migration):

    dependencies = [
        ('ask_cfpb', '0027_portalsearchpage'),
    ]

    operations = [
        migrations.AddField(
            model_name='answerpage',
            name='answer_content',
            field=wagtail.wagtailcore.fields.StreamField([(b'text', wagtail.wagtailcore.blocks.StructBlock([(b'content', wagtail.wagtailcore.blocks.RichTextBlock(features=[b'bold', b'italic', b'h2', b'h3', b'link', b'ol', b'ul', b'document-link', b'image', b'embed', b'edit-html'], label=b'Text'))])), (b'table_block', v1.atomic_elements.organisms.AtomicTableBlock(table_options={b'renderer': b'html'})), (b'tip', wagtail.wagtailcore.blocks.StructBlock([(b'content', wagtail.wagtailcore.blocks.RichTextBlock(features=[b'link', b'document-link'], label=b'Tip'))])), (b'video_player', wagtail.wagtailcore.blocks.StructBlock([(b'video_url', wagtail.wagtailcore.blocks.RegexBlock(default=b'https://www.youtube.com/embed/', error_messages={b'invalid': b'The YouTube URL is in the wrong format. You must use the embed URL (https://www.youtube.com/embed/video_id), which can be obtained by clicking Share > Embed on the YouTube video page.', b'required': b'The YouTube URL field is required for video players.'}, label=b'YouTube Embed URL', regex=b'^https:\\/\\/www\\.youtube\\.com\\/embed\\/.+$', required=True))]))], blank=True, verbose_name='Answer'),
        ),
        migrations.RunPython(migrate_answer_to_streamfield),
    ]
