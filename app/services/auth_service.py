from app.models.user import UserRegister


def register_user(user: UserRegister):
    return {
        "name": user.name,
        "email": user.email
    }