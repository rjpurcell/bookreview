import boto3
import hashlib
import os


def upload_image(
        image_file,
        s3_bucket='bookreview-images',
        region='us-east-1',
):
    # Get boto3 session
    session = boto3.Session(
        region_name=region
    )

    # Get S3 client
    s3 = session.client('s3')

    # Get key name
    image_body = image_file.read()
    _, ext = os.path.splitext(image_file.filename)
    key = '%s%s' % (hashlib.md5(image_body).hexdigest(), ext)

    # Get ContentType
    content_type = 'image/jpeg'
    if '.png' in image_file.filename:
        content_type = 'image/png'

    s3.put_object(
        ACL='public-read',
        Body=image_body,
        Bucket=s3_bucket,
        ContentType=content_type,
        Key=key
    )

    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': s3_bucket,
            'Key': key
        }
    ).split('?')[0]
    return url
