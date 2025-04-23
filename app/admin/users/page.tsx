"use client"

import { useState } from "react"
import Link from "next/link"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Search, MoreHorizontal, Edit, Trash, UserPlus, Eye } from "lucide-react"

export default function UsersPage() {
    const { users, deleteUser, updateUser } = useAdmin()
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm),
    )

    // Handle user deletion
    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (userToDelete) {
            const success = deleteUser(userToDelete)
            if (success) {
                toast({
                    title: "Xóa người dùng thành công",
                    description: "Người dùng đã được xóa khỏi hệ thống.",
                })
            } else {
                toast({
                    title: "Xóa người dùng thất bại",
                    description: "Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
            setDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    // Handle user status change
    const handleStatusChange = (userId: string, newStatus: "active" | "inactive" | "blocked") => {
        const success = updateUser(userId, { status: newStatus })
        if (success) {
            toast({
                title: "Cập nhật trạng thái thành công",
                description: `Trạng thái người dùng đã được cập nhật thành ${newStatus === "active" ? "Hoạt động" : newStatus === "inactive" ? "Không hoạt động" : "Bị chặn"
                    }.`,
            })
        } else {
            toast({
                title: "Cập nhật trạng thái thất bại",
                description: "Đã xảy ra lỗi khi cập nhật trạng thái người dùng. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <Button asChild>
                    <Link href="/admin/users/new">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Thêm người dùng
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách người dùng</CardTitle>
                    <CardDescription>Quản lý tất cả người dùng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm người dùng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Không tìm thấy người dùng nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                                        }`}
                                                >
                                                    {user.role === "admin" ? "Admin" : "Khách hàng"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : user.status === "inactive"
                                                                ? "bg-gray-100 text-gray-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {user.status === "active"
                                                        ? "Hoạt động"
                                                        : user.status === "inactive"
                                                            ? "Không hoạt động"
                                                            : "Bị chặn"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{user.createdAt.toLocaleDateString("vi-VN")}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Mở menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/users/${user.id}/view`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem chi tiết
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/users/${user.id}`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Chỉnh sửa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(user.id)}>
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                                            Hoạt động
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                                                            Không hoạt động
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "blocked")}>
                                                            Chặn
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
