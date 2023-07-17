"""Implements the exception related modules"""

from traceback import TracebackException


class ExceptionUtilities:

    """Implements the exception utilities"""

    @staticmethod
    def stack_trace_as_string(exception: BaseException) -> str:
        """Returns the full stack trace as a string"""
        return "".join(TracebackException.from_exception(exception).format())
