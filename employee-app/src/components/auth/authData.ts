export interface EmployeeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  salonName: string;
  avatarUrl: string;
}

export const MOCK_EMPLOYEE_USER: EmployeeUser = {
  id: "emp_001",
  name: "Maria Rodriguez",
  email: "maria.rodriguez@maximastudio.com",
  role: "Senior Hair Stylist",
  salonName: "Maxima Studio",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

export function buildEmployeeUser(email?: string): EmployeeUser {
  const trimmed = email?.trim();
  return trimmed ? { ...MOCK_EMPLOYEE_USER, email: trimmed } : MOCK_EMPLOYEE_USER;
}
