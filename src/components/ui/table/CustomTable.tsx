"use client"
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  RowData,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CustomArrowUpDown } from "@/components/ui/customarrowupdown";
import { Button } from "@/components/ui/button";
import SearchComponent from "@/components/ui/filter-search/SearchComponent";
import TablePagination from "@/components/ui/table/TablePagination";
import { CustomFilter } from "../filter-search/CustomFilter";
import DateRangeFilter  from "../filter-search/DateRangeFilter";
export type CellContent =
  | { type: "text"; value: string }
  | { type: "icon"; icon: React.ReactNode }
  | { type: "button"; label: string; onClick: () => void }
  | { type: "custom"; render: () => React.ReactNode }
  | { type: "group"; items: CellContent[] };

interface CustomTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSizeArray?: number[];
  height?: number;
  rowHeight?: number;
  showFilters?: boolean;
}
const renderCellContent = (content: CellContent): React.ReactNode => {
  switch (content.type) {
    case "text": return content.value;
    case "icon": return content.icon;
    case "button": return <Button size="sm" onClick={content.onClick}>{content.label}</Button>;
    case "custom": return content.render();
    case "group":
      return (
        <div className="flex flex-row flex-wrap items-center gap-1">
          {content.items.map((item, idx) => (
            <div key={idx} className="flex-shrink-0">{renderCellContent(item)}</div>
          ))}
        </div>
      );
    default: return null;
  }
};
const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((current, key) => current?.[key], obj);

export function CustomTable<TData extends RowData>({
  data,
  columns,
  pageSizeArray = [10, 20, 30],
  height = 480,
  rowHeight = 48,
  showFilters = true,
}: CustomTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: pageSizeArray[0] });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position to sync header
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setContainerWidth(width);
      setIsMobile(width < 768);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync horizontal scroll between header and body
  useEffect(() => {
    const tableScroll = tableScrollRef.current;
    const header = headerRef.current;
    
    if (!tableScroll || !header) return;
    
    const handleScroll = () => {
      const newScrollLeft = tableScroll.scrollLeft;
      setScrollLeft(newScrollLeft);
      header.scrollLeft = newScrollLeft;
    };
    
    tableScroll.addEventListener('scroll', handleScroll);
    return () => tableScroll.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setPagination(prev => ({ ...prev, pageIndex: 0 })), []);
const [filterResults, setFilterResults] = useState<TData[]>(data);
const [searchResults, setSearchResults] = useState<TData[]>(data);

const handleFilter = (results: TData[]) => {
  setFilterResults(results);
  setSearchResults(results); // Reset search on new filter
};

const handleSearch = (results: TData[]) => {
  setSearchResults(results); // Search applies on top of filtered data
};

const finalData = searchResults;
  const pageCount = Math.ceil(finalData .length / pagination.pageSize);
  const paginatedData = finalData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableScrollRef.current,
    estimateSize: () => (isMobile ? Math.max(rowHeight, 60) : rowHeight),
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows[0]?.start || 0;
  const paddingBottom = totalSize - (virtualRows.at(-1)?.end || 0);

  const getColumnStyle = (col: any) => {
    const meta = col.columnDef?.meta || {};
    return {
      flex: meta.flex || 1,
      minWidth: (meta.minWidth || (isMobile ? 100 : 120)) + "px",
      maxWidth: meta.maxWidth ? meta.maxWidth + "px" : undefined,
    };
  };

  // Calculate consistent table width
  const tableWidth = useMemo(() => {
    if (!containerWidth) return "100%";
    
    const headers = table.getHeaderGroups()[0]?.headers || [];
    const totalMinWidth = headers.reduce((sum, header) => {
      const minWidth = parseInt(getColumnStyle(header.column).minWidth || '120');
      return sum + minWidth;
    }, 0);
    
    const padding = headers.length * 2; // Border spacing
    const requiredWidth = totalMinWidth + padding;
    
    // Always use the larger of container width or required width
    return Math.max(containerWidth - 32, requiredWidth) + "px";
  }, [containerWidth, table, isMobile]);

  function handleDateRangeChange(start: Date | null, end: Date | null): void {
    if (!start && !end) {
      // Reset to original data if no date range is selected
      setFilterResults(data);
      setSearchResults(data);
      return;
    }

    // Assuming your data has a 'date' field (adjust as needed)
    const filtered = data.filter((item: any) => {
      const itemDate = item.birthDate ? new Date(item.birthDate) : null;
      console.log( `Filtering item: ${item.firstName}, Date: ${itemDate}, Start: ${start}, End: ${end}`);
      if (!itemDate) return false;
      if (start && end) {
        return itemDate >= start && itemDate <= end;
      }
      if (start) {
        return itemDate >= start;
      }
      if (end) {
        return itemDate <= end;
      }
      return true;
    });

    setFilterResults(filtered);
    setSearchResults(filtered);
  }

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="flex gap-1 items-center">
        <SearchComponent
          data={filterResults as any[]}
          onResults={(e)=>{handleSearch(e as TData[])
          }}
          displayKey={["name", "email", "company.name","phone","gender","age"]}
          placeholder="Search..."
        />
        <CustomFilter
          data={data as any[]}
          filterFields={["gender"]}
          onFilter={(e)=>{handleFilter(e as TData[])}}
        />
        <DateRangeFilter
  title="Select Date Range"
  onDateRangeChange={handleDateRangeChange}
/>
      </div>
     
      <div className="rounded-md border bg-background w-full ">
        {/* Fixed Header */}
        <div 
          ref={headerRef}
          className="overflow-hidden border-b bg-muted"
          style={{ width: "100%" ,position: "sticky"}}
        >
          <div style={{ width: tableWidth }}>
            {table.getHeaderGroups().map((hg) => (
              <div key={hg.id} className="flex">
                {hg.headers.map((header) => (
                  <div
                    key={header.id}
                    className="flex bg-primary items-center px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wider border-r last:border-r-0"
                    style={getColumnStyle(header.column)}
                  >
                    <div
                      className={`flex  items-center justify-center gap-1 w-full ${
                        header.column.getCanSort() ? "cursor-pointer select-none" : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span className="truncate">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getCanSort() && (
                        <CustomArrowUpDown direction={header.column.getIsSorted()} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          ref={tableScrollRef}
          className="overflow-auto"
          style={{ 
            height: height + "px", 
            WebkitOverflowScrolling: "touch"
          }}
        >
          <div style={{ width: tableWidth }}>
            {paddingTop > 0 && <div style={{ height: paddingTop + "px" }} />}
            {virtualRows.map((vr) => {
              const row = rows[vr.index];
              return (
                <div 
                  key={row.id} 
                  className="flex border-b hover:bg-muted/50" 
                  style={{ height: vr.size + "px" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div 
                      key={cell.id} 
                      className="flex items-center px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm border-r last:border-r-0" 
                      style={getColumnStyle(cell.column)}
                    >
                      <div className="truncate w-full text-ellipsis whitespace-nowrap overflow-hidden">
                        {renderCellContent(cell.getValue() as CellContent)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {paddingBottom > 0 && <div style={{ height: paddingBottom + "px" }} />}
          </div>
        </div>

        <TablePagination
          table={table}
          pageSizeArray={pageSizeArray}
          totalRecords={finalData.length}
        />
      </div>
    </div>
  );
}