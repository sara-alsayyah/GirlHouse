from storages.backends.s3 import S3Storage
from django.conf import settings


class B2Storage(S3Storage):
    bucket_name = settings.B2_BUCKET_NAME
    endpoint_url = settings.B2_ENDPOINT_URL

    access_key = settings.B2_ACCESS_KEY_ID
    secret_key = settings.B2_SECRET_ACCESS_KEY

    region_name = "us-east-005"

    default_acl = None
    file_overwrite = False
    querystring_auth = True