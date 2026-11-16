export interface RoleData {
  id: string;
  name: string;
  role: string;
  email: string;
  date: string;
  createdBy: string;
  creatorRole: string;
  avatarBg: string;
  avatarUrl: string;
  lastUpdate: string;
}

export interface RolesTableProps {
  roles: RoleData[];
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onOpenEdit: (role: RoleData) => void;
  onOpenDelete: (role: RoleData) => void;
}

export interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleData | null;
  onSubmit: (updatedData: {
    name: string;
    email: string;
    role: string;
    date: string;
    createdBy: string;
    creatorRole: string;
    avatarBg: string;
    avatarUrl: string;
  }) => void;
}

export interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleData | null;
  onConfirm: () => void;
}

export interface PermissionItemProps {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: () => void;
}

export interface RoleBasicDetailsProps {
  roleName: string;
  description: string;
  onChange: (field: "roleName" | "description", value: string) => void;
}

export interface PermissionSectionProps {
  permissions: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export interface ViewRoleBasicDetailsProps {
  name: string;
  description: string;
}

export interface UsersAssignedListProps {
  users: Array<{
    id: number;
    name: string;
    avatar: string;
  }>;
}
