import unicodedata

def clean_string(input_string):
   # Normalize string to decomposed form, then filter out non-ASCII and control characters
    normalized_string = unicodedata.normalize('NFKD', input_string)
    cleaned_string = ''.join(c for c in normalized_string if unicodedata.category(c) != 'Cc' and ord(c) < 128)
    return cleaned_string


from PIL import Image as PILImage
from io import BytesIO
import os
from django.core.files.storage import default_storage
import logging

logger = logging.getLogger(__name__)

def compress_image(image_path, output_path, quality=85):
   logger.debug('Compress image method called!')
   with default_storage.open(image_path, 'rb') as f:
      image = PILImage.open(f)
      image = image.convert('RGB')
      output = BytesIO()
      image.save(output, format='JPEG', quality=quality)
      output.seek(0)

      with default_storage.open(output_path, 'wb') as out_f:
         out_f.write(output.read())
