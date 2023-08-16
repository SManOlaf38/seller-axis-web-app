import re

# from .autocorrect import Speller
# LOWES = "Lowe's"
# THE_HOME_DEPOT = "The Home Depot"
# COMPANY_DATA = {
#     "lowes": LOWES,
#     "thd": THE_HOME_DEPOT,
#     "homedepot": THE_HOME_DEPOT,
#     "thehomedepot": THE_HOME_DEPOT,
#     "home depot": THE_HOME_DEPOT,
#     "the home depot": THE_HOME_DEPOT,
# }
#
#
# N_LIST = list(set(len(key.split()) for key in COMPANY_DATA))
#
# nlp_data = {"lowes": 1, "the": 1, "home": 1, "depot": 1}
#
# spell = Speller(nlp_data=nlp_data)
#
#
# def text_to_company(text: str) -> str | None:
#     """Auto-detected merchant id, not implemented yet, move spell and n_list object to global for improve."""
#     if isinstance(text, str) and text:
#         clean_text = " ".join([re.sub(r"\W+", "", word) for word in text.split()])
#         correct_sentence = spell(clean_text)
#         words = get_ngrams(text=correct_sentence, n=N_LIST)
#         for word in words:
#             word_lower = word.lower()
#             if word_lower in COMPANY_DATA:
#                 return COMPANY_DATA[word]
#
#             if word_lower.replace(" ", "") in COMPANY_DATA:
#                 return COMPANY_DATA[word]


def get_n_list(text: str):
    return [i + 1 for i in range(len(text.split()))]


def get_ngrams(text: str = None, n: list[int] | int = 3):
    words = text.split()
    word_n_grams = []
    if isinstance(n, list):
        for i in n:
            n_grams = [words[k : k + i] for k in range(len(words) - i + 1)]  # noqa
            word_n_grams += n_grams
    return [" ".join(grams) for grams in word_n_grams]


def from_retailer_to_company(merchant_id: str, name: str) -> str | None:
    clean_text = " ".join([re.sub(r"\W+", "", word) for word in name.split()])
    n_list = get_n_list(clean_text)
    words = get_ngrams(text=clean_text, n=n_list)
    for word in words:
        word_lower = word.lower()
        if word_lower.replace(" ", "") == merchant_id:
            return name
