import { type UserRole, getRoleColor } from "@/types/user"

interface RoleBadgeProps {
    role: UserRole[] | UserRole
    className?: string
}

export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
    // Handle both array and single role
    const roles = Array.isArray(role) ? role : [role]

    return (
        <div className="flex flex-wrap gap-1">
            {roles.map((singleRole, index) => {
                const colorClasses = getRoleColor(singleRole)

                return (
                    <span
                        key={`${singleRole}-${index}`}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
                    >
                        {singleRole}
                    </span>
                )
            })}
        </div>
    )
}
