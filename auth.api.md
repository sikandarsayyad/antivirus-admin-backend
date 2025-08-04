
#  Authentication API Endpoints

## 1. 🚪 Sign In

- **Method:** `POST`
- **Endpoint:** `/api/auth/signin`

### Request Body
```json
{
  "email": "john@example.com",
  "password": "john123"
}
```

### Response
```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "john123"
  }
}
```

---

## 2. 🧾 Register (Sign Up)

- **Method:** `POST`
- **Endpoint:** `/api/auth/register-user`

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john123",
  "role": "Admin" // or "Instructor", "Center"
}
```

### Response
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## 3. 🔑 Forgot Password

- **Method:** `POST`
- **Endpoint:** `/api/auth/forgot-password`

### Request Body
```json
{
  "email": "sayyadsikandar477@gmail.com"
}
```

### Response
```json
{
  "success": true,
  "message": "Reset password link sent to your email"
}
```

---

## 4. 🔒 Reset Password

- **Method:** `POST`
- **Endpoint:** `/api/auth/reset-password`

### Request Body
```json
{
  "token": "JWT_TOKEN_RECEIVED_IN_EMAIL",
  "password": "new123"
}
```

### Response
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

---

## 5. 👤 Get User Data (Protected Route)

- **Method:** `GET`
- **Endpoint:** `/api/auth/getUserData`

### Headers
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Admin"
}
```

---

> ✅ **Frontend Notes:**
> - Save JWT from login/signup in localStorage.
> - Pass `Authorization` header with Bearer token in protected routes.
> - Reset password link will be emailed. Use the token in the URL for password update.
