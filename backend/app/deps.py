from dataclasses import dataclass


@dataclass(frozen=True)
class CurrentUser:
    id: str


def get_current_user() -> CurrentUser:
    return CurrentUser(id="mock-user-001")
