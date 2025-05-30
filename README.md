# 🏥 Hospital Management Dashboard

A responsive and role-based hospital management system built with **React**, **Vite**, **React Router**, and **Tailwind CSS**, supporting authentication and user management for both **admins** and **doctors**.

## 🚀 Features

- Secure JWT authentication
- Role-based access for admins and doctors
- Doctor and admin management
- Daily attendance tracking
- Message center for internal communication
- Toast notifications for user feedback
- Modern sidebar-based UI layout

---

## 📁 Project Structure

```bash
├── components/
│ ├── AddNewAdmin.jsx
│ ├── AddNewDoctor.jsx
│ ├── Admins.jsx
│ ├── Attendance.jsx
│ ├── Dashboard.jsx
│ ├── Doctors.jsx
│ ├── Login.jsx
│ ├── Messages.jsx
│ └── Sidebar.jsx
├── App.jsx
├── main.jsx
├── index.html
├── package.json
└── vite.config.js
```


---

## 🔧 Tech Stack

- **Frontend**: React 19, React Router 7, Axios, React Toastify
- **Bundler**: Vite
- **Styling**: Tailwind CSS (you can add it if not yet included)
- **Notifications**: React Toastify
- **Icons**: Lucide React & React Icons

---

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/hospital-dashboard.git
   cd hospital-dashboard

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run development server:**
    ``bash
    npm run dev
    ```

4. **Build for production:**
    ```bash
    npm run build
    ```
5. **Preview production build:**
    ```bash
    npm run preview
    ```

6. **Serve production build (optional):**
    ```bash
    npm run start
    ```

## 🔐 Authentication

**Token storage:**

- `adminToken` for admins
- `doctorToken` for doctors

- Tokens are stored in `localStorage` and sent via headers.
```bash
Authorization: Bearer <token>
Tokenname: adminToken | doctorToken
```
- On failure, user is logged out and tokens are cleared.

## 📦 Scripts

| Script          | Description                     |
|-----------------|---------------------------------|
| `npm run dev`   | Start development server        |
| `npm run build` | Build for production            |
| `npm run preview` | Preview production build      |
| `npm run start` | Serve `dist` folder using serve |
| `npm run lint`  | Run ESLint checks               |

## 🧪 Dependencies

### Core
- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `react-toastify`
- `lucide-react`
- `react-icons`

### Dev
- `vite`
- `eslint`
- `@vitejs/plugin-react`
- and other dev dependencies

