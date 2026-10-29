import cloudinary.uploader
from cloudinary.exceptions import Error as ErroCloudinary
from fastapi import HTTPException, UploadFile

TIPOS_PERMITIDOS = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


def enviar_imagem(imagem: UploadFile, pasta: str) -> str:
    """Envia a imagem ao Cloudinary e devolve a URL pública (https)."""
    if imagem.content_type not in TIPOS_PERMITIDOS:
        raise HTTPException(
            status_code=400,
            detail="Formato de imagem não permitido"
        )

    try:
        resultado = cloudinary.uploader.upload(imagem.file, folder=pasta)
    except ErroCloudinary:
        raise HTTPException(
            status_code=502,
            detail="Não foi possível enviar a imagem. Tente novamente."
        )

    return resultado["secure_url"]
