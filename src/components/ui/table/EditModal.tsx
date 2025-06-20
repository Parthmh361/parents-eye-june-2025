"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "url" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  validation?: {
    min?: number; max?: number; minLength?: number; maxLength?: number;
    pattern?: RegExp; message?: string;
  };
  disabled?: boolean;
  hidden?: boolean;
  gridCols?: 1 | 2;
}

interface DynamicEditDialogProps<T = any> {
  data: T | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  fields: FieldConfig[];
  title?: string;
  description?: string;
  avatarConfig?: { imageKey: string; nameKeys: string[] };
}

const getNestedValue = (obj: any, path: string): any => 
  path.split('.').reduce((current, key) => current?.[key], obj);

const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = current[keys[i]] ? { ...current[keys[i]] } : {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
};

const validateField = (value: any, config: FieldConfig): string | undefined => {
  if (config.required && (!value || value === '')) return `${config.label} is required`;
  if (!config.validation || !value) return undefined;
  
  const { min, max, minLength, maxLength, pattern, message } = config.validation;
  
  if (config.type === 'number') {
    const numValue = Number(value);
    if (min !== undefined && numValue < min) return message || `${config.label} must be at least ${min}`;
    if (max !== undefined && numValue > max) return message || `${config.label} must be at most ${max}`;
  }
  
  if (typeof value === 'string') {
    if (minLength !== undefined && value.length < minLength) return message || `${config.label} must be at least ${minLength} characters`;
    if (maxLength !== undefined && value.length > maxLength) return message || `${config.label} must be at most ${maxLength} characters`;
    if (pattern && !pattern.test(value)) return message || `${config.label} format is invalid`;
    if (config.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `Please enter a valid email address`;
    if (config.type === 'url' && !/^https?:\/\/.+/.test(value)) return `Please enter a valid URL`;
  }
  
  return undefined;
};

export const DynamicEditDialog: React.FC<DynamicEditDialogProps> = ({
  data, isOpen, onClose, onSave, fields, 
  title = "Edit Record", 
  description = "Update the information below. Fields marked with * are required.",
  avatarConfig,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<Record<string, any>>({ defaultValues: {} });

  useEffect(() => {
    if (data && isOpen) {
      const formData: any = {};
      fields.forEach(field => {
        formData[field.key] = getNestedValue(data, field.key) ?? '';
      });
      form.reset(formData);
    }
  }, [data, isOpen, fields, form]);

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const errors: { [key: string]: string } = {};
      fields.forEach(field => {
        const error = validateField(formData[field.key], field);
        if (error) errors[field.key] = error;
      });
      
      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([key, message]) => {
          form.setError(key as any, { type: 'manual', message });
        });
        return;
      }
      
      let transformedData = { ...formData };
      fields.forEach(field => {
        if (field.key.includes('.')) {
          transformedData = setNestedValue(transformedData, field.key, formData[field.key]);
          delete transformedData[field.key];
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(transformedData);
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const renderField = (field: FieldConfig) => {
    if (field.hidden) return null;

    return (
      <FormField
        key={field.key}
        control={form.control}
        name={field.key}
        render={({ field: formField }) => (
          <FormItem className={field.gridCols === 1 ? "col-span-full" : ""}>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {field.type === "select" ? (
                <Select onValueChange={formField.onChange} value={formField.value} disabled={field.disabled}>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => {
                      const value = typeof option === 'string' ? option : option.value;
                      const label = typeof option === 'string' ? option : option.label;
                      return <SelectItem key={value} value={value}>{label}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <textarea
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              ) : (
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  onChange={(e) => {
                    const value = field.type === 'number' ? 
                      (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
                    formField.onChange(value);
                  }}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  if (!data) return null;

  const avatarDisplay = avatarConfig && (
    <Avatar className="h-10 w-10">
      <AvatarImage src={getNestedValue(data, avatarConfig.imageKey)} alt="User Avatar" />
      <AvatarFallback>
        {avatarConfig.nameKeys.map(key => getNestedValue(data, key)?.charAt(0) || '').join('').toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {avatarDisplay}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(renderField)}
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};