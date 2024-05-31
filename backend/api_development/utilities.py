import unicodedata

def clean_string(input_string):
   # Normalize string to decomposed form, then filter out non-ASCII and control characters
    normalized_string = unicodedata.normalize('NFKD', input_string)
    cleaned_string = ''.join(c for c in normalized_string if unicodedata.category(c) != 'Cc' and ord(c) < 128)
    return cleaned_string