"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable, CellContent } from "../CustomTable";
import { DynamicEditDialog, FieldConfig } from "@/components/ui/table/EditModal";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  birthDate: Date;
  age: number;
  gender: string;
  email: string;
  phone: string;
  image: string;
  company: {
    name: string;
  };
}

export const MyPageTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((json) => {
        setData(json.users ?? []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setData([]);
        setLoading(false);
      });
  }, []);

  // Dynamic field configuration for the edit dialog
  const editFieldConfigs: FieldConfig[] = [
    {
      key: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      placeholder: "Enter first name",
      validation: { minLength: 2, message: "First name must be at least 2 characters" }
    },
    {
      key: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      placeholder: "Enter last name",
      validation: { minLength: 2, message: "Last name must be at least 2 characters" }
    },
  
    {
      key: "age",
      label: "Age",
      type: "number",
      required: true,
      placeholder: "Enter age",
      validation: { min: 1, max: 120, message: "Age must be between 1 and 120" }
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" }
      ],
      placeholder: "Select gender"
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter email address"
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      required: true,
      placeholder: "Enter phone number",
      validation: { minLength: 10, message: "Phone number must be at least 10 characters" }
    },
    {
      key: "company.name",
      label: "Company Name",
      type: "text",
      required: true,
      placeholder: "Enter company name"
    },
    {
      key: "image",
      label: "Profile Image URL",
      type: "url",
      placeholder: "https://example.com/image.jpg",
      gridCols: 1 // Full width
    }
  ];

  // Handle edit action
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  // Handle save from dialog
  const handleSave = (updatedData: any) => {
    if (selectedUser) {
      setData(prevData => 
        prevData.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...updatedData, id: selectedUser.id }
            : user
        )
      );

      console.log("Updated user data:", updatedData);
      alert(`Successfully updated ${updatedData.firstName} ${updatedData.lastName}`);
    }
  };
  const userColumns: ColumnDef<User, CellContent>[] = [
    {
      header: "Profile",
      accessorFn: (row) => ({
        type: "custom",
        render: () => (
          <div className="flex items-center justify-center">
            <img
              src={row.image}
              alt={`${row.firstName} ${row.lastName}`}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${row.firstName}+${row.lastName}&background=e2e8f0&color=475569`;
              }}
            />
          </div>
        ),
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 0.8, minWidth: 80, maxWidth: 100 },
      enableSorting: false,
    },
    {
      header: "Name",
      accessorFn: (row) => ({
        type: "text",
        value: `${row.firstName} ${row.lastName}`,
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 2, minWidth: 150, maxWidth: 250 },
      sortingFn: (rowA, rowB) => {
        const nameA = `${rowA.original.firstName} ${rowA.original.lastName}`;
        const nameB = `${rowB.original.firstName} ${rowB.original.lastName}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      header: "Age",
      accessorFn: (row) => ({
        type: "text",
        value: row.age.toString(),
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 0.8, minWidth: 80, maxWidth: 100 },
      sortingFn: (rowA, rowB) => rowA.original.age - rowB.original.age,
    },
    {
      header: "Gender",
      accessorFn: (row) => ({
        type: "custom",
        render: () => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
            {row.gender}
          </span>
        ),
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 1, minWidth: 100, maxWidth: 120 },
    },
    {
      header: "Email",
      accessorFn: (row) => ({
        type: "custom",
        render: () => (
          <a
            href={`mailto:${row.email}`}
            className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
            title={row.email}
          >
            {row.email}
          </a>
        ),
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 3, minWidth: 200, maxWidth: 300 },
    },
    {
       header:"Birth Date",
      accessorFn: (row) => ({
        type: "text",
        value: row.birthDate ? new Date(row.birthDate).toLocaleDateString() : "N/A",
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 2, minWidth: 150, maxWidth: 200 },
    },
    
    {
      header: "Phone",
      accessorFn: (row) => ({
        type: "custom",
        render: () => (
          <a
            href={`tel:${row.phone}`}
            className="text-gray-700 hover:text-gray-900 hover:underline"
            title={`Call ${row.phone}`}
          >
            {row.phone}
          </a>
        ),
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 2, minWidth: 150, maxWidth: 200 },
    },
    {
      header: "Company",
      accessorFn: (row) => ({
        type: "custom",
        render: () => (
          <div className="flex items-center">
            <span className="truncate" title={row.company?.name ?? "N/A"}>
              {row.company?.name ?? "N/A"}
            </span>
          </div>
        ),
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 2, minWidth: 150, maxWidth: 250 },
    },
    {
      header: "Actions",
      accessorFn: (row) => ({
        type: "group",
        items: [
          {
            type: "button",
            label: "View",
            onClick: () => {
              alert(
                `Viewing ${row.firstName} ${row.lastName}\nEmail: ${row.email}\nCompany: ${row.company?.name ?? "N/A"}`
              );
            },
          },
          {
            type: "button",
            label: "Edit",
            onClick: () => handleEdit(row),
          },
        ],
      }),
      cell: (info) => info.getValue(),
      meta: { flex: 1.5, minWidth: 150, maxWidth: 160},
      enableSorting: false,
    },
  ];
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <CustomTable
        data={data}
        columns={userColumns}
        pageSizeArray={[10, 20, 30, 50]}
        showFilters={true}
      />
      <DynamicEditDialog
        data={selectedUser}
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        fields={editFieldConfigs}
        title="Edit User Details"
        description="Update the user information below. Fields marked with * are required."
        avatarConfig={{
          imageKey: "image",
          nameKeys: ["firstName", "lastName"]
        }}
      />
    </div>
  );
};