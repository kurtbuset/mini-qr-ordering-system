# User Profile Components

These components provide a complete user profile management interface integrated with the backend accounts API.

## Components

### UserMetaCard

A comprehensive profile card component displaying user information with social-style layout.

**Features:**

- User avatar display
- Full name and role
- Email address
- Edit functionality via modal

**Location:** `UserMetaCard.tsx`

### UserInfoCard

A detailed information card showing user account details.

**Features:**

- Structured data display (First Name, Last Name, Email, Role)
- Edit functionality via modal
- Responsive grid layout

**Location:** `UserInfoCard.tsx`

## API Integration

Both components are integrated with:

- **Auth Store:** `useAuthStore` for current user data
- **Account Service:** `accountService` for CRUD operations
- **Toast Store:** `useToastStore` for user feedback

### Backend Endpoints Used

- `GET /accounts/:id` - Fetch user details
- `PUT /accounts/:id` - Update user profile

### Editable Fields

- First Name
- Last Name
- Email Address

## Usage Example

```tsx
import UserMetaCard from "./components/UserProfile/UserMetaCard";
import UserInfoCard from "./components/UserProfile/UserInfoCard";

function UserProfilePage() {
  return (
    <div>
      <UserMetaCard />
      <UserInfoCard />
    </div>
  );
}
```

## State Management

**Form State:**

- Managed locally with `useState`
- Initialized from `useAuthStore.account`
- Synced back to store on successful update

**Loading States:**

- `isSubmitting` prevents double submission
- Disables form inputs and buttons during save

**Error Handling:**

- Try-catch blocks around API calls
- Toast notifications for success/error feedback
- Console logging for debugging

## Security

- Only authenticated users can access
- Users can only edit their own profile
- JWT tokens automatically included in requests
- Backend validates permissions

## Form Validation

**Client-side:**

- All fields required (handled in submit handler)
- Email format validation (HTML5)

**Server-side:**

- Email uniqueness check
- Field length validation
- Role-based permission checks

## Toast Notifications

Success messages:

- ✅ "Profile updated successfully"

Error messages:

- ❌ Validation errors from backend
- ❌ Network errors
- ❌ Specific error messages from API

## TypeScript Types

```typescript
interface UpdateAccountData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface Account {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  jwtToken?: string;
}
```

## Dependencies

- `react` - Core library
- `zustand` - State management (auth store, toast store)
- `../../hooks/useModal` - Modal management
- `../../services/accountService` - API calls
- `../ui/modal` - Modal component
- `../ui/button/Button` - Button component
- `../form/input/InputField` - Input component
- `../form/Label` - Label component

## Future Enhancements

- [ ] Password change functionality
- [ ] Avatar/photo upload
- [ ] Additional profile fields (phone, bio, address)
- [ ] Account deletion
- [ ] Activity log
- [ ] Two-factor authentication settings
- [ ] Profile visibility settings
- [ ] Social media links integration
