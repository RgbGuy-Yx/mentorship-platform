# AI Agent Instructions for MentorHub Codebase

## Project Overview
**MentorHub** is a full-stack mentorship platform enabling secure connections between students, mentors, and admins. The system uses JWT-based authentication with role-based access control to separate student, mentor, and admin workflows.

### Core Goals
- Enable secure user registration/authentication with role-based access
- Allow students to browse mentors and send mentorship requests
- Enable mentors to manage requests and accept/reject mentees
- Provide admin controls for mentor approval and platform oversight
- Maintain clean API-driven backend with middleware-enforced authorization

---

## Architecture

### Tech Stack
- **Frontend**: React 19 + Vite, React Router v7, Tailwind CSS, Framer Motion for animations
- **Backend**: Express.js, MongoDB + Mongoose, JWT authentication, bcryptjs for password hashing
- **Key Libraries**: Axios (HTTP client), React Context (auth state), Lucide React (icons), Toast notifications (react-hot-toast)

### High-Level Data Flow
```
User Registration → JWT Token Generated → Stored in localStorage
↓
All API Requests → Token Auto-Attached via Axios Interceptor
↓
Backend Auth Middleware → Verifies Token & Extracts User Role
↓
Role-Based Route/Controller Logic → Returns User-Specific Data
↓
Frontend Protected Routes → Check Auth Context & Role
```

### Role-Based Architecture
- **Students**: Browse mentors, send requests, manage my-mentors, view profiles
- **Mentors**: Dashboard with requests, accept/reject requests, manage mentees, update profile
- **Admins**: Dashboard for approving mentors, admin oversight

---

## Critical Code Patterns

### JWT & Authentication Flow
**Backend files**: `Backend/src/middleware/auth.middleware.js`, `Backend/src/controllers/auth.controller.js`

1. **Registration**: User submits credentials → Password hashed via pre-save hook → JWT token generated
2. **Login**: Credentials verified → JWT token returned → Token stored in localStorage
3. **Protected Routes**: Authorization header (`Bearer <token>`) verified → `req.user` populated with `userId` and `role`

**Key Pattern**: All protected API calls require `Authorization: Bearer <token>` header. Frontend automatically attaches via axios interceptor in `utils/api.js`.

### Mentorship Request Workflow
**Backend files**: `Backend/src/controllers/request.controller.js`, `Backend/src/models/MentorshipRequest.js`

Request lifecycle:
- **pending** (student created) → **accepted/rejected** (mentor action)
- Students cannot create duplicate requests to same mentor
- Mentors see requests filtered by status (All/Pending/Accepted/Rejected)
- Accept action populates mentor data in "My Mentors" for student

### Component & Hook Patterns
- **Protected Routes**: Wraps routes requiring auth + specific roles. See `components/ProtectedRoute.jsx`
- **AuthContext**: Global state for `user`, `isAuthenticated`, `token`. Initialize by checking localStorage on app mount
- **Error Handling**: Try/catch throughout, user-friendly toast notifications via `react-hot-toast`
- **Loading States**: Display spinners/skeletons while fetching. Example: `MentorDashboard.jsx` loading logic

### API Response Pattern
All responses follow this structure:
```javascript
{ success: true, data: {...} }  // Success
{ success: false, message: "Error description" }  // Error
```

---

## Essential Files to Know

### Backend Core
| File | Purpose |
|------|---------|
| `Backend/src/app.js` | Express setup, routes registration, error middleware |
| `Backend/src/server.js` | DB connection, port configuration |
| `Backend/src/models/User.js` | User schema with role, mentor status, profile fields |
| `Backend/src/models/MentorshipRequest.js` | Request schema with student/mentor refs and status |
| `Backend/src/middleware/auth.middleware.js` | JWT verification, attaches user to request |
| `Backend/src/middleware/role.middleware.js` | Role-based access control enforcement |
| `Backend/src/controllers/auth.controller.js` | Register & login logic |
| `Backend/src/controllers/request.controller.js` | Create/retrieve/update mentorship requests |
| `Backend/src/controllers/user.controller.js` | User data retrieval, profile updates |

### Frontend Core
| File | Purpose |
|------|---------|
| `Frontend/Mentorship/src/App.jsx` | Route definitions, includes protected route wrappers |
| `Frontend/Mentorship/src/context/AuthContext.jsx` | Auth state management, login/logout/session recovery |
| `Frontend/Mentorship/src/utils/api.js` | Axios instance with JWT auto-attachment interceptor |
| `Frontend/Mentorship/src/components/ProtectedRoute.jsx` | Auth + role-based route guard |
| `Frontend/Mentorship/src/pages/Dashboard.jsx` | Student dashboard with hero, stats, mentor cards |
| `Frontend/Mentorship/src/pages/MentorDashboard.jsx` | Mentor dashboard with request management |
| `Frontend/Mentorship/src/pages/MentorListing.jsx` | Browse all mentors feature |
| `Frontend/Mentorship/src/pages/MentorProfile.jsx` | View detailed mentor profile |
| `Frontend/Mentorship/src/pages/Requests.jsx` | Student view of pending/accepted requests |
| `Frontend/Mentorship/src/pages/MyMentors.jsx` | Student's accepted mentors list |

---

## Development Workflows

### Backend Setup & Running
```bash
cd Backend
npm install
# Create .env file with JWT_SECRET and MONGODB_URI (see ENV_SETUP.md)
npm run dev  # Watches for changes, runs on port 5050
npm start    # Production mode
```

### Frontend Setup & Running
```bash
cd Frontend/Mentorship
npm install
npm run dev      # Start dev server (Vite on port 5173)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Testing Workflow
Test user flows in this order:
1. Register new student/mentor (check mentorStatus = 'pending')
2. Login with credentials
3. Student: Browse mentors, send request, check status in "My Requests"
4. Mentor: Login to mentor dashboard, accept/reject request
5. Student: View request status change, see mentor in "My Mentors"

---

## Common Development Tasks

### Adding a New API Endpoint
1. Create controller function in `Backend/src/controllers/`
2. Add route in `Backend/src/routes/`
3. Add auth middleware if protected: `router.get('/path', authMiddleware, controller)`
4. Add role check if needed: `router.get('/path', authMiddleware, roleMiddleware('mentor'), controller)`
5. Frontend: Use `apiClient` (pre-configures token) from `utils/api.js`

### Adding a New Frontend Page/Route
1. Create page component in `Frontend/Mentorship/src/pages/`
2. Add route in `App.jsx` (wrap with `<ProtectedRoute>` if auth required)
3. Use `AuthContext` to access `user` and check role
4. Use `apiClient` for backend calls (token auto-attached)

### Updating User Profile Data
- Profile fields: `bio`, `skills`, `experience`, `goals`, `dateOfBirth`, `location`, `currentRole`
- Stored on User model in MongoDB
- Updated via `Backend/src/controllers/user.controller.js`
- Changes immediately visible across all pages due to fresh fetches via API

---

## Key Conventions & Patterns

### Error Handling
- Backend: Always return `{ success: false, message: "..." }`
- Frontend: Wrap async calls in try/catch, show errors via `toast.error()`
- Auth errors: Redirect to login, clear token from context/localStorage

### Naming Conventions
- Routes: kebab-case prefixed with `/api/` (backend) or `/` (frontend SPA)
- Functions: camelCase, prefix mutations with verb (createUser, updateRequest)
- Components: PascalCase with semantic names (MentorCard, RequestCard)
- Context/Hooks: Prefix with use if it's a hook (useAuth pattern via AuthContext)

### Component Structure
Most page components follow this pattern:
```javascript
export default function PageName() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch data with error handling
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/endpoint');
        setData(res.data.data);
      } catch (err) {
        setError(err.message);
        toast.error('Error message');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Content</div>;
}
```

### Animation Conventions
- Use Framer Motion with `motion` component and layout animations
- Common pattern: `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}` → `transition={{ delay: 0.1 }}`
- See `MentorDashboard.jsx` and `MentorProfile.jsx` for examples

---

## External Dependencies & Integration Points

### Database: MongoDB (via Mongoose)
- Connection via `MONGODB_URI` env variable
- Connection happens in `Backend/src/server.js`
- All queries use Mongoose schema validation

### JWT Authentication (via jsonwebtoken)
- Secret: `JWT_SECRET` env variable  
- Generated on register/login, verified on protected routes
- Token format: `Bearer <jwt_token>` in Authorization header

### Email Validation
- Backend validates format on register/login
- Regex pattern: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`
- Email unique constraint at DB level

### UI Component Libraries
- **Tailwind CSS**: Utility-first styling (not structured components)
- **Lucide React Icons**: Icon library import as `import { IconName } from 'lucide-react'`
- **Radix UI**: Low-level accessible component primitives (in some components)
- **Custom Magic UI**: Animated components in `src/components/magicui/` (animated-avatar, blur-card, etc.)

---

## Documentation Files to Reference
- `MENTOR_PROFILE_IMPLEMENTATION.md`: Complete mentor profile view feature (access points, data flow, security)
- `MENTOR_DASHBOARD_REFERENCE_REDESIGN.md`: Modern mentor dashboard design and architecture
- `STUDENT_DASHBOARD_DESIGN_DOCUMENT.md`: Student dashboard features and information architecture
- `Frontend/Mentorship/README_AUTHENTICATION.md`: Deep dive into auth system architecture
- `Backend/ENV_SETUP.md`: Environment variable configuration and troubleshooting

---

## Quick Debugging Tips
1. **Auth issues**: Check if token in localStorage, verify JWT_SECRET in .env, check Authorization header in network tab
2. **API 404s**: Verify route exists, check spelling, ensure controller exported correctly
3. **Role access denied**: Check user.role in AuthContext, verify roleMiddleware conditions
4. **Password hashing failures**: bcrypt pre-save hook runs automatically, never hash manually
5. **Protected routes not working**: Ensure ProtectedRoute wrapper applied, check role requirement passed as props
