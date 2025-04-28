import { type UserRole, getRolePermissions } from "@/types/user"
import { CheckCircle } from "lucide-react"

interface PermissionsListProps {
    role: UserRole
}

export function PermissionsList({ role }: PermissionsListProps) {
    const permissions = getRolePermissions(role)

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Quyền hạn:</h3>
            <ul className="space-y-1">
                {permissions.map((permission, index) => (
                    <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>{permission}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
