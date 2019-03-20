module.exports = {
    mensajes_autenticacion:{
        credenciales_validas:"Credenciales válidas.",   
        credenciales_no_validas:"Credenciales incorrectas.",   
        faltan_campos:"Faltan uno o más campos obligatorios."
    },
    mensajes_password_email:{
        email_recuperar_password_asunto:"Recuperación de contraseña",   
        email_recuperar_password_contenido:"Ingresa al link ${url} para  restablecer su contraseña.",   
        email_nuevo_password_asunto:"Contraseña restablecida",
        email_nuevo_password_contenido:"Su nueva contraseña es ${newPassword}",
        email_enviado:"Se ha enviado un correo a ${user_email}."
    },
    mensajes_error_servidor:{
        internal_server_error:"Ha ocurrido un error. Por favor intente más tarde.",
        db_elemento_duplicado:"Ya existe un elemento con el identificador ingresado.",
        db_error_dependencias:"Por favor borrar ${entidad} asociados antes de completar acción.",
        db_valor_invalido:"El valor ingresado para ${campo} no es válido",
        db_campo_desconocido: "Campo ${campo} desconocido.",
        db_no_hay_campos: "Por favor ingresar datos requeridos antes de continuar.",
        db_falta_campo:"Por favor ingresar datos para el campo ${campo}.",
        db_entidad_no_existe:"El elemento que se desea modificar no existe."
    },
    mensajes_archivos:{
        archivo_cargado:"Se ha cargado el archivo con éxito.",
        archivo_no_valido:"Por favor seleccionar un archivo."
    },
    mensajes_encuestas:{
        encuesta_cargada:"Se ha subido la encuesta con código ${codigo_encuesta}.",
        error_cargar_encuesta:"Ha ocurrido un error al cargar la encuesta."
    },
    mensajes_CRUD:{
        elemento_creado:"Se ha creado ${elemento} con éxito.",
        elemento_modificado:"${elemento} se ha modificado con éxito",
        elemento_eliminado:"Se ha eliminado ${elemento}",
        password_no_valido:"La contraseña ingresada no es válida."
    },
    mensajes_autorizacion:{
        dev_acceso_restringido:"Acceso restringido",
        dev_token_no_valido:"El token de acceso no es válido"
    }
};