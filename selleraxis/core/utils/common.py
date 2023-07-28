import random
import string

DEFAULT_ALLOWED_CHARS = "".join((string.ascii_letters, string.digits))


def random_chars(size: int = 6, chars: str = DEFAULT_ALLOWED_CHARS):
    return "".join(random.choice(chars) for _ in range(size))
