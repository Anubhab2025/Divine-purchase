"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WorkflowRecord } from "@/lib/workflow-context";

interface StageTableProps {
  title: string;
  stage: number;
  pending: WorkflowRecord[];
  history: WorkflowRecord[];
  onOpenForm: () => void;
  onSelectRecord: (record: WorkflowRecord) => void;
  columns: { key: string; label: string }[];
  showPending?: boolean;
}

export function StageTable({
  title,
  pending,
  history,
  onOpenForm,
  onSelectRecord,
  columns,
  showPending = true,
}: StageTableProps) {
  // Mobile card component for records
  const RecordCard = ({
    record,
    isPending = false,
    onAction,
    actionLabel = "Edit",
  }: {
    record: WorkflowRecord;
    isPending?: boolean;
    onAction: () => void;
    actionLabel?: string;
  }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-muted-foreground mb-1 break-all">
              {record.id}
            </p>
            <div
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                record.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {record.status}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="ml-2 flex-shrink-0"
          >
            {actionLabel}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm">
          {columns.map((col) => (
            <div key={col.key} className="flex justify-between">
              <span className="text-muted-foreground font-medium">
                {col.label}:
              </span>
              <span className="text-right break-words ml-2">
                {col.key === "deliveryDate"
                  ? new Date(record.data[col.key]).toLocaleDateString()
                  : String(record.data[col.key] || "-")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {showPending && (
          <Button onClick={onOpenForm} className="w-full sm:w-auto">
            Add Record
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Pending Section */}
        {showPending && pending.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Pending ({pending.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 pb-4">
              {pending.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No pending records
                </div>
              ) : (
                <>
                  {/* Mobile: Cards */}
                  <div className="block md:hidden space-y-3">
                    {pending.map((record) => (
                      <RecordCard
                        key={record.id}
                        record={record}
                        isPending={true}
                        onAction={() => onSelectRecord(record)}
                        actionLabel="Edit"
                      />
                    ))}
                  </div>

                  {/* Desktop: Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Record ID</TableHead>
                          {columns.map((col) => (
                            <TableHead key={col.key} className="min-w-[120px]">
                              {col.label}
                            </TableHead>
                          ))}
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {pending.map((record) => (
                          <TableRow
                            key={record.id}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-mono text-xs">
                              {record.id}
                            </TableCell>
                            {columns.map((col) => (
                              <TableCell key={col.key} className="text-sm">
                                {col.key === "deliveryDate"
                                  ? new Date(
                                      record.data[col.key]
                                    ).toLocaleDateString()
                                  : String(record.data[col.key] || "-")}
                              </TableCell>
                            ))}
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSelectRecord(record)}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* History Section */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              History ({history.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 pb-4">
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No completed records
              </div>
            ) : (
              <>
                {/* Mobile: Cards */}
                <div className="block md:hidden space-y-3">
                  {history.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      isPending={false}
                      onAction={() => {}}
                      actionLabel="View"
                    />
                  ))}
                </div>

                {/* Desktop: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Record ID</TableHead>
                        {columns.map((col) => (
                          <TableHead key={col.key} className="min-w-[120px]">
                            {col.label}
                          </TableHead>
                        ))}
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {history.map((record) => (
                        <TableRow
                          key={record.id}
                          className="opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <TableCell className="font-mono text-xs">
                            {record.id}
                          </TableCell>
                          {columns.map((col) => (
                            <TableCell key={col.key} className="text-sm">
                              {col.key === "deliveryDate"
                                ? new Date(
                                    record.data[col.key]
                                  ).toLocaleDateString()
                                : String(record.data[col.key] || "-")}
                            </TableCell>
                          ))}
                          <TableCell
                            className={`font-medium ${
                              record.status === "completed"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {record.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
