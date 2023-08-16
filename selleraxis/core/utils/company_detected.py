import re

from .autocorrect import Speller

LOWES = "Lowe's"
THE_HOME_DEPOT = "The Home Depot"
COMPANY_DATA = {
    "lowes": LOWES,
    "thd": THE_HOME_DEPOT,
    "homedepot": THE_HOME_DEPOT,
    "thehomedepot": THE_HOME_DEPOT,
    "home depot": THE_HOME_DEPOT,
    "the home depot": THE_HOME_DEPOT,
}
N_GRAM_LIST = list(set(len(key.split()) for key in COMPANY_DATA))

nlp_data = {"lowes": 1, "the": 1, "home": 1, "depot": 1}

spell = Speller(nlp_data=nlp_data)


def get_ngrams(text: str = None, n: list[int] | int = 3):
    words = text.split()
    word_n_grams = []
    if isinstance(n, list):
        for i in n:
            n_grams = [words[k : k + i] for k in range(len(words) - i + 1)]  # noqa
            word_n_grams += n_grams
    return [" ".join(grams) for grams in word_n_grams]


def text_to_company(text: str) -> str | None:
    if isinstance(text, str) and text:
        clean_text = " ".join([re.sub(r"\W+", "", word) for word in text.split()])
        correct_sentence = spell(clean_text)
        words = get_ngrams(text=correct_sentence, n=N_GRAM_LIST)
        for word in words:
            word_lower = word.lower()
            if word_lower in COMPANY_DATA:
                return COMPANY_DATA[word]

            if word_lower.replace(" ", "") in COMPANY_DATA:
                return COMPANY_DATA[word]
