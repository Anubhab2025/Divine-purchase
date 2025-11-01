"use client";

import type React from "react";
import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Stage8() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    qcBy: "",
    qcDate: "",
    qcStatus: "",
    rejectRemarks: "",
    rejectQty: "",
    returnStatus: "",
    qcRemarks: "",
  });

  const pending = records.filter(
    (r) => r.stage === 8 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 8)
  );

  const columns = [
    { key: "indentNumber", label: "Indent #" },
    { key: "createdBy", label: "Created By" },
    { key: "category", label: "Category" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "deliveryDate", label: "Exp. Delivery" },
    { key: "poNumber", label: "PO Number" },
    { key: "liftNumber", label: "Lift Number" },
    { key: "qcBy", label: "QC Done By" },
    { key: "qcStatus", label: "QC Status" },
    { key: "returnStatus", label: "Return Status" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  const handleOpenForm = (recordId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedRecord(recordId);
    setFormData({
      qcBy: "",
      qcDate: today,
      qcStatus: "",
      rejectRemarks: "",
      rejectQty: "",
      returnStatus: "",
      qcRemarks: "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord && isFormValid) {
      updateRecord(selectedRecord, formData);
      moveToNextStage(selectedRecord);
      setOpen(false);
      setSelectedRecord(null);
      setFormData({
        qcBy: "",
        qcDate: "",
        qcStatus: "",
        rejectRemarks: "",
        rejectQty: "",
        returnStatus: "",
        qcRemarks: "",
      });
    }
  };

  // Validation
  const isFormValid =
    formData.qcBy &&
    formData.qcDate &&
    formData.qcStatus &&
    formData.returnStatus &&
    (formData.qcStatus === "approved" ||
      (formData.qcStatus === "rejected" && formData.rejectQty && formData.rejectRemarks));

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 8: Quality Control</h2>
            <p className="text-gray-600 mt-1">Inspect and approve/reject received materials</p>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select
              value=""
              onValueChange={() => {}}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder={`${selectedColumns.length} columns selected`} />
              </SelectTrigger>
              <SelectContent className="w-64">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedColumns.length === columns.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColumns(columns.map(col => col.key));
                        } else {
                          setSelectedColumns([]);
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All Columns</Label>
                  </div>
                  {columns.map((col) => (
                    <div key={col.key} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={selectedColumns.includes(col.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns([...selectedColumns, col.key]);
                          } else {
                            setSelectedColumns(selectedColumns.filter(c => c !== col.key));
                          }
                        }}
                      />
                      <Label className="text-sm">{col.label}</Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No pending QC checks</p>
              <p className="text-sm text-gray-400 mt-1">All items are inspected!</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                      <TableHead key={col.key}>
                        {col.label}
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">
                        {record.id}
                      </TableCell>
                      {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                        <TableCell key={col.key}>
                          {col.key === "deliveryDate"
                            ? new Date(record.data[col.key]).toLocaleDateString("en-IN")
                            : String(record.data[col.key] || "-")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(record.id)}
                        >
                          Perform QC
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <StageTable
            title=""
            stage={8}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* QC Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Quality Control Inspection</DialogTitle>
            <p className="text-sm text-gray-600">
              Verify material quality and decide approval or rejection.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* QC Done By */}
                <div className="space-y-2">
                  <Label htmlFor="qcBy">
                    QC Done By <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="qcBy"
                    value={formData.qcBy}
                    onChange={(e) =>
                      setFormData({ ...formData, qcBy: e.target.value })
                    }
                    required
                    placeholder="Engineer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* QC Date */}
                <div className="space-y-2">
                  <Label htmlFor="qcDate">
                    QC Date <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="qcDate"
                    type="date"
                    value={formData.qcDate}
                    onChange={(e) =>
                      setFormData({ ...formData, qcDate: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* QC Status */}
                <div className="space-y-2">
                  <Label htmlFor="qcStatus">
                    QC Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="qcStatus"
                    value={formData.qcStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        qcStatus: e.target.value,
                        rejectQty: e.target.value === "approved" ? "" : formData.rejectQty,
                        rejectRemarks: e.target.value === "approved" ? "" : formData.rejectRemarks,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select...</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                {/* Return Status */}
                <div className="space-y-2">
                  <Label htmlFor="returnStatus">
                    Return Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="returnStatus"
                    value={formData.returnStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, returnStatus: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select...</option>
                    <option value="return">Return</option>
                    <option value="not return">Not Return</option>
                  </select>
                </div>
              </div>

              {/* Conditional: Reject fields */}
              {formData.qcStatus === "rejected" && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Rejection Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rejectQty">
                        Reject Qty <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="rejectQty"
                        type="number"
                        value={formData.rejectQty}
                        onChange={(e) =>
                          setFormData({ ...formData, rejectQty: e.target.value })
                        }
                        required
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="rejectRemarks">
                        Reject Remarks <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="rejectRemarks"
                        value={formData.rejectRemarks}
                        onChange={(e) =>
                          setFormData({ ...formData, rejectRemarks: e.target.value })
                        }
                        required
                        placeholder="Reason for rejection..."
                        className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* QC Remarks */}
              <div className="space-y-2">
                <Label htmlFor="qcRemarks">QC Remarks</Label>
                <textarea
                  id="qcRemarks"
                  value={formData.qcRemarks}
                  onChange={(e) =>
                    setFormData({ ...formData, qcRemarks: e.target.value })
                  }
                  placeholder="Any observations or additional notes..."
                  className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded resize-none"
                  rows={3}
                />
              </div>
            </form>
          </div>

          {/* Actions - Fixed at bottom */}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid} onClick={handleSubmit}>
              Complete QC Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}