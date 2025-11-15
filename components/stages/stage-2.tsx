"use client";

import React, { useState, useEffect } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Package,
  Calendar,
  Warehouse,
  User,
  FileText,
  Hash,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Stage2() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();

  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [approvalForm, setApprovalForm] = useState({
    approvedBy: "",
    status: "",
    approvedQty: "",
    vendorType: "",
    remarks: "",
  });

  const approvers = ["John Doe", "Jane Smith", "Bob Johnson"];

  const pending = records.filter(
    (r) => r.stage === 2 && r.status === "pending"
  );

  const history = records.filter((r) =>
    r.history.some((h) => h.stage === 2)
  );

  const columns = [
    { key: "indentNumber", label: "Indent #", icon: Hash },
    { key: "createdBy", label: "Created By", icon: User },
    { key: "warehouseLocation", label: "Warehouse Location", icon: Warehouse },
    { key: "leadTime", label: "Lead Time", icon: Calendar },
    { key: "category", label: "Category", icon: FileText },
    { key: "itemName", label: "Item", icon: Package },
    { key: "quantity", label: "Qty", icon: Package },
    { key: "deliveryDate", label: "Exp. Delivery", icon: Calendar },
  ] as const;

  // All columns selected by default
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map((c) => c.key)
  );

  const toggleRecord = (id: string) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRecords.length === pending.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(pending.map((r) => r.id));
    }
  };

  // Open modal when something is selected & pre-fill first record qty
  useEffect(() => {
    setIsModalOpen(selectedRecords.length > 0);
    if (selectedRecords.length > 0) {
      const first = records.find((r) => r.id === selectedRecords[0]);
      if (first) {
        setApprovalForm((prev) => ({
          ...prev,
          approvedQty: first.data.quantity ?? "",
          status: "approved",
        }));
      }
    }
  }, [selectedRecords, records]);

  const handleBulkApprove = () => {
    selectedRecords.forEach((id) => {
      const record = records.find((r) => r.id === id);
      if (!record) return;

      const qty = approvalForm.approvedQty || record.data.quantity;
      updateRecord(id, {
        ...approvalForm,
        approvedQty: qty,
        status: approvalForm.status,
      });

      if (approvalForm.status === "approved") {
        moveToNextStage(id);
      }
    });

    setSelectedRecords([]);
    setApprovalForm({
      approvedBy: "",
      status: "",
      approvedQty: "",
      vendorType: "",
      remarks: "",
    });
    setIsModalOpen(false);
  };

  const selectedItems = pending.filter((r) =>
    selectedRecords.includes(r.id)
  );

  const isFormValid = !!approvalForm.approvedBy && !!approvalForm.status;

  /* --------------------------------------------------------------------- */
  /* -------------------------- Column Selector -------------------------- */
  /* --------------------------------------------------------------------- */
  const ColumnSelector = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-64 justify-start">
          {selectedColumns.length === columns.length
            ? "All columns"
            : `${selectedColumns.length} column${
                selectedColumns.length !== 1 ? "s" : ""
              } selected`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              checked={selectedColumns.length === columns.length}
              onCheckedChange={(c) => {
                if (c) setSelectedColumns(columns.map((col) => col.key));
                else setSelectedColumns([]);
              }}
            />
            <Label className="text-sm font-medium">All Columns</Label>
          </div>

          {columns.map((col) => (
            <div
              key={col.key}
              className="flex items-center space-x-2 py-1"
            >
              <Checkbox
                checked={selectedColumns.includes(col.key)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColumns((prev) => [...prev, col.key]);
                  } else {
                    setSelectedColumns((prev) =>
                      prev.filter((c) => c !== col.key)
                    );
                  }
                }}
              />
              <Label className="text-sm">{col.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  /* --------------------------------------------------------------------- */
  /* ------------------------------ Render ------------------------------- */
  /* --------------------------------------------------------------------- */
  return (
    <div className="p-6">
      {/* Header Card */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 2: Approval</h2>
            <p className="text-gray-600 mt-1">
              Review and approve/reject indents
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <ColumnSelector />
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
            History ({history.length})
          </TabsTrigger>
        </TabsList>

        {/* ---------- PENDING ---------- */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No pending approvals</p>
              <p className="text-sm text-gray-400 mt-1">
                All indents are processed!
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          pending.length > 0 &&
                          selectedRecords.length === pending.length
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    {columns
                      .filter((c) => selectedColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>
                          <div className="flex items-center gap-2">
                            {col.icon && <col.icon className="w-4 h-4" />}
                            {col.label}
                          </div>
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pending.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRecord(record.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => toggleRecord(record.id)}
                        />
                      </TableCell>

                      {columns
                        .filter((c) => selectedColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {col.key === "deliveryDate"
                              ? new Date(
                                  record.data[col.key]
                                ).toLocaleDateString("en-IN")
                              : col.key === "leadTime"
                              ? `${record.data[col.key] ?? "-"} days`
                              : String(record.data[col.key] ?? "-")}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ---------- HISTORY ---------- */}
        <TabsContent value="history" className="mt-6">
          <StageTable
            title=""
            stage={2}
            pending={[]}
            history={history}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter((c) => selectedColumns.includes(c.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* ------------------- APPROVAL MODAL ------------------- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Bulk Approval ({selectedRecords.length} item
              {selectedRecords.length > 1 ? "s" : ""})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected items summary */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Selected Items</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto text-sm">
                {selectedItems.map((item) => (
                  <div key={item.id}>
                    {item.data.indentNumber} - {item.data.itemName} (Qty:{" "}
                    {item.data.quantity})
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBulkApprove();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Approved By */}
                <div className="space-y-2">
                  <Label htmlFor="approvedBy">
                    Approved By <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={approvalForm.approvedBy}
                    onValueChange={(v) =>
                      setApprovalForm((p) => ({ ...p, approvedBy: v }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={approvalForm.status}
                    onValueChange={(v) =>
                      setApprovalForm((p) => ({ ...p, status: v }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Approved Qty */}
                <div className="space-y-2">
                  <Label htmlFor="approvedQty">Approved Qty</Label>
                  <Input
                    id="approvedQty"
                    type="number"
                    placeholder="Leave blank for full quantity"
                    value={approvalForm.approvedQty}
                    onChange={(e) =>
                      setApprovalForm((p) => ({
                        ...p,
                        approvedQty: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Vendor Type */}
                <div className="space-y-2">
                  <Label htmlFor="vendorType">Vendor Type</Label>
                  <Select
                    value={approvalForm.vendorType}
                    onValueChange={(v) =>
                      setApprovalForm((p) => ({ ...p, vendorType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="third party">Third Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Add remarks..."
                  rows={3}
                  value={approvalForm.remarks}
                  onChange={(e) =>
                    setApprovalForm((p) => ({ ...p, remarks: e.target.value }))
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedRecords([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isFormValid}>
                  {approvalForm.status === "approved"
                    ? "Approve & Send"
                    : "Reject Selected"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}