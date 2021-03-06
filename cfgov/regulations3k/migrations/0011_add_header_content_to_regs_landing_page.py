# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import wagtail.wagtailimages.blocks
import wagtail.wagtailcore.fields
import wagtail.wagtailcore.blocks
import v1.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('regulations3k', '0010_rename_acquired_field'),
    ]

    operations = [
        migrations.AddField(
            model_name='regulationlandingpage',
            name='content',
            field=wagtail.wagtailcore.fields.StreamField([('full_width_text', wagtail.wagtailcore.blocks.StreamBlock([(b'content', wagtail.wagtailcore.blocks.RichTextBlock(icon=b'edit')), (b'regulations_list', wagtail.wagtailcore.blocks.StructBlock([(b'heading', wagtail.wagtailcore.blocks.CharBlock(help_text=b'Regulations list heading', required=False)), (b'more_regs_page', wagtail.wagtailcore.blocks.PageChooserBlock(help_text=b'Link to more regulations')), (b'more_regs_text', wagtail.wagtailcore.blocks.CharBlock(help_text=b'Text to show on link to more regulations', required=False))])), (b'reusable_text', v1.blocks.ReusableTextChooserBlock(b'v1.ReusableText'))]))], blank=True),
        ),
        migrations.AddField(
            model_name='regulationlandingpage',
            name='header',
            field=wagtail.wagtailcore.fields.StreamField([('hero', wagtail.wagtailcore.blocks.StructBlock([(b'heading', wagtail.wagtailcore.blocks.CharBlock(help_text=b'Maximum character count: 25 (including spaces)', required=False)), (b'body', wagtail.wagtailcore.blocks.RichTextBlock(help_text=b'Maximum character count: 185 (including spaces)', required=False)), (b'links', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock([(b'text', wagtail.wagtailcore.blocks.CharBlock(required=False)), (b'url', wagtail.wagtailcore.blocks.CharBlock(default=b'/', required=False))]), help_text=b'If your hero needs a call-to-action link, enter it here, rather than inside the body field.')), (b'is_button', wagtail.wagtailcore.blocks.BooleanBlock(help_text=b'Select to render any links given above as buttons.', required=False)), (b'image', wagtail.wagtailimages.blocks.ImageChooserBlock(help_text=b'Should be exactly 390px tall, and up to 940px wide, unless this is an overlay or bleeding style hero.', required=False)), (b'is_overlay', wagtail.wagtailcore.blocks.BooleanBlock(help_text=b'Select if you want the provided image to be a background image under the entire hero.', required=False)), (b'background_color', wagtail.wagtailcore.blocks.CharBlock(help_text=b'Specify a hex value (with the # sign) from our official palette: https://github.com/cfpb/cf-theme-cfpb/blob/master/src/color-palette.less', required=False)), (b'is_white_text', wagtail.wagtailcore.blocks.BooleanBlock(help_text=b'Turns the hero text white. Useful if using a dark background color or background image.', required=False)), (b'cta_link_color', wagtail.wagtailcore.blocks.CharBlock(help_text=b'If using a dark background color or background image, you may need to specify an alternate color for the call-to-action link. Specify a hex value (with the # sign) from our official palette: https://github.com/cfpb/cf-theme-cfpb/blob/master/src/color-palette.less', required=False, label=b'CTA link color')), (b'is_bleeding', wagtail.wagtailcore.blocks.BooleanBlock(help_text=b'Select if you want the provided image to bleed vertically off the top and bottom of the hero.', required=False)), (b'small_image', wagtail.wagtailimages.blocks.ImageChooserBlock(help_text=b'Provide an alternate image for small displays when using a bleeding or overlay hero.', required=False))]))], blank=True),
        ),
    ]
