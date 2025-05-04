"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "@/lib/axios"
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
import { Pagination } from "@/components/pagination"
import { RoleBadge } from "@/components/user/role-badge"

export default function UsersPage() {
    const { deleteUser } = useAdmin()
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<any[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 1,
        totalItems: 0,
    })

    // Fetch users from API
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await axios.get("/api/users/admin", {
                params: {
                    page: pagination.page - 1, // API might be zero-based
                    size: pagination.size,
                    sortField: "id",
                    sortDirection: "asc",
                },
            })

            setUsers(response.data.data.content || [])
            setPagination({
                ...pagination,
                totalPages: response.data.data.totalPages || 1,
                totalItems: response.data.data.totalElements || 0,
            })
        } catch (error) {
            console.error("Error fetching users:", error)
            toast({
                title: "Lỗi khi tải dữ liệu",
                description: "Không thể tải danh sách người dùng. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Fetch users when component mounts or pagination changes
    useEffect(() => {
        fetchUsers()
    }, [pagination.page, pagination.size])

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm),
    )

    // Handle page change
    const handlePageChange = (page: number) => {
        setPagination({
            ...pagination,
            page,
        })
    }

    // Handle user deletion
    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete)
                toast({
                    title: "Xóa người dùng thành công",
                    description: "Người dùng đã được xóa khỏi hệ thống.",
                })
                // Refresh the user list
                fetchUsers()
            } catch (error) {
                toast({
                    title: "Xóa người dùng thất bại",
                    description: "Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            } finally {
                setDeleteDialogOpen(false)
                setUserToDelete(null)
            }
        }
    }

    // Handle user status change
    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        try {
            await axios.put(`/api/users/admin/${userId}/status`, null, {
                params: {
                    active: newStatus,
                },
            })

            toast({
                title: "Cập nhật trạng thái thành công",
                description: `Trạng thái người dùng đã được cập nhật thành ${newStatus ? "Hoạt động" : "Không hoạt động"}.`,
            })

            // Refresh the user list
            fetchUsers()
        } catch (error) {
            console.error("Error updating user status:", error)
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Đang tải dữ liệu...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
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
                                                <RoleBadge role={user.role} />
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === true ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {user.status === true ? "Hoạt động" : "Không hoạt động"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, true)}>
                                                            Hoạt động
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, false)}>
                                                            Không hoạt động
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

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
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
