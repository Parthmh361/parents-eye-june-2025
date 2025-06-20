import { ColumnMeta } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown> {
    flex?: number,
    minWidth?: number,
    maxWidth?: number,
    justifyContent?: "flex-start" | "center" | "flex-end",
  }
}
