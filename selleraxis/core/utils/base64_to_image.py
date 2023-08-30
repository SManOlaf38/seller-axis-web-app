import base64
import datetime
import random


def base64_to_image(base64_str):
    current_date = datetime.datetime.now().strftime("%Y%m%d")
    random_number = random.randint(100000, 999999)
    name = str(current_date) + "_" + str(random_number)

    imgdata = base64.b64decode(base64_str)
    filename = f"UPS_{name}.jpg"  # I assume you have a way of picking unique filenames
    with open(filename, "wb") as f:
        f.write(imgdata)
    return filename
