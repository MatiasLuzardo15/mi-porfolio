# Guía de Configuración EmailJS

## 📧 Configuración de EmailJS para el Formulario de Contacto

### 1. Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Confirma tu email

### 2. Configurar Servicio de Email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. **Copia el Service ID** que se genera

### 3. Crear Template de Email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este template de ejemplo:

```
Subject: Nuevo mensaje de contacto desde tu portfolio - {{from_name}}

Hola Matías,

Has recibido un nuevo mensaje de contacto desde tu portfolio personal:

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}

💬 Mensaje:
{{message}}

---
Este mensaje fue enviado automáticamente desde el formulario de contacto de tu portfolio.
Responde directamente a este email para contactar con {{from_name}}.
```

4. **Copia el Template ID** que se genera

### 4. Obtener Public Key
1. Ve a "Account" > "General"
2. Encuentra tu **Public Key**
3. Cópialo

### 5. Configurar Variables de Entorno
Edita el archivo `.env.local` con tus datos:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui  
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
VITE_CONTACT_EMAIL=luzardomatias440@gmail.com
```

### 6. Reiniciar Servidor
Después de configurar las variables de entorno:
```bash
npm run dev
```

### 7. Probar el Formulario
1. Ve a tu portfolio en localhost
2. Prueba el formulario de contacto
3. Deberías recibir el email en tu bandeja de entrada

## 🔧 Troubleshooting

- **Error 401**: Revisa tu Public Key
- **Error 400**: Verifica que los nombres de las variables en el template coincidan
- **No llega el email**: Revisa la carpeta de spam

## 📝 Notas
- EmailJS tiene un límite de 200 emails/mes en el plan gratuito
- Los emails pueden tardar unos minutos en llegar
- Asegúrate de que tu Service esté activo en EmailJS
