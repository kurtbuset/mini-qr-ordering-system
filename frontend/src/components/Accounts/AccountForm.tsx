import { useState, useEffect } from "react";
import { Account } from "../../types/account";
import {
  accountService,
  CreateAccountData,
} from "../../services/accountService";
import { useToastStore } from "../../store/toastStore";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Role } from "../../types/role";

interface AccountFormProps {
  account: Account | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AccountForm({
  account,
  onSuccess,
  onCancel,
}: AccountFormProps) {
  const isEditMode = !!account;
  const addToast = useToastStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: Role.Admin,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        title: "",
        firstName: account.firstName || "",
        lastName: account.lastName || "",
        email: account.email || "",
        password: "",
        confirmPassword: "",
        role: account.role || Role.Admin,
      });
    } else {
      setFormData({
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: Role.Admin,
      });
    }
  }, [account]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      addToast({
        variant: "error",
        title: "Validation Error",
        message: "Please fill in all required fields",
      });
      return;
    }

    // Password validation for create mode or when password is provided in edit mode
    if (!isEditMode || formData.password) {
      if (!formData.password) {
        addToast({
          variant: "error",
          title: "Validation Error",
          message: "Password is required",
        });
        return;
      }

      if (formData.password.length < 6) {
        addToast({
          variant: "error",
          title: "Validation Error",
          message: "Password must be at least 6 characters",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        addToast({
          variant: "error",
          title: "Validation Error",
          message: "Passwords do not match",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Update existing account
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        };

        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
          updateData.confirmPassword = formData.confirmPassword;
        }

        await accountService.update(account.id, updateData);
        addToast({
          variant: "success",
          title: "Success",
          message: "Account updated successfully",
        });
      } else {
        // Create new account
        const createData: CreateAccountData = {
          title: formData.title,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        };

        await accountService.create(createData);
        addToast({
          variant: "success",
          title: "Success",
          message: "Account created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      addToast({
        variant: "error",
        title: "Error",
        message:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} account`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isEditMode ? "Edit Account" : "Create New Account"}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {isEditMode
            ? "Update account information and permissions."
            : "Fill in the details to create a new account."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div className="space-y-5">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Account Information
            </h5>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <Label>
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <Label>
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <Label>
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <Label>
                Role<span className="text-red-500">*</span>
              </Label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm transition bg-white border border-gray-300 rounded-lg outline-none dark:bg-gray-800 dark:border-gray-700 focus:border-brand-500 dark:focus:border-brand-400 text-gray-800 dark:text-white/90"
                required
              >
                <option value={Role.Admin}>Admin</option>
              </select>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                {isEditMode ? "Change Password (Optional)" : "Password"}
              </h5>

              <div className="space-y-5">
                <div>
                  <Label>
                    Password
                    {!isEditMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <Label>
                    Confirm Password
                    {!isEditMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current password"
                        : "Confirm password"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed opacity-50"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Account"
                : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
