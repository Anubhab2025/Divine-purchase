"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { CheckCircle2 } from "lucide-react";

export default function Stage4() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    selectedVendor: "",
    approvedBy: "",
    remarks: "",
  });

  const approvers = ["John Doe", "Jane Smith", "Bob Johnson"];

  const pending = records.filter(
    (r) => r.stage === 4 && r.status === "pending"
  );
  const completed = records.filter((r) => r.history.some((h) => h.stage === 4));

  const columns = [
    { key: "indentNumber", label: "Indent #" },
    { key: "createdBy", label: "Created By" },
    { key: "category", label: "Category" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "deliveryDate", label: "Exp. Delivery" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    console.log("Opening negotiation for record:", recordId);
    console.log("Record data:", record?.data);
    console.log("vendor3Name:", record?.data?.vendor3Name);
    console.log("Has vendor3Name:", !!record?.data?.vendor3Name);
    if (record) {
      setSelectedRecord(recordId);
      setCurrentRecord(record);
      setFormData({ selectedVendor: "", approvedBy: "", remarks: "" });

      if (!record.data.vendor3Name) {
        console.log("Auto-skipping to next stage - only 1 vendor");
        updateRecord(recordId, { autoSkipped: true });
        moveToNextStage(recordId);
        return;
      }

      console.log("Opening negotiation modal - 3 vendors found");
      setOpen(true);
    } else {
      console.log("Record not found:", recordId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord && formData.selectedVendor && formData.approvedBy) {
      updateRecord(selectedRecord, formData);
      moveToNextStage(selectedRecord);
      setOpen(false);
      setSelectedRecord(null);
      setCurrentRecord(null);
      setFormData({ selectedVendor: "", approvedBy: "", remarks: "" });
    }
  };

  const vendors = currentRecord
    ? [
        {
          id: "vendor1",
          name: currentRecord.data.vendor1Name || "-",
          rate: currentRecord.data.vendor1Rate || "-",
          terms: currentRecord.data.vendor1Terms || "-",
          delivery: currentRecord.data.vendor1DeliveryDate || "-",
        },
        {
          id: "vendor2",
          name: currentRecord.data.vendor2Name || "-",
          rate: currentRecord.data.vendor2Rate || "-",
          terms: currentRecord.data.vendor2Terms || "-",
          delivery: currentRecord.data.vendor2DeliveryDate || "-",
        },
        {
          id: "vendor3",
          name: currentRecord.data.vendor3Name || "-",
          rate: currentRecord.data.vendor3Rate || "-",
          terms: currentRecord.data.vendor3Terms || "-",
          delivery: currentRecord.data.vendor3DeliveryDate || "-",
        },
      ]
    : [];

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 4: Vendor Negotiation</h2>
            <p className="text-gray-600 mt-1">
              Select the best vendor after comparison
            </p>
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
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">
            History ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No pending negotiations</p>
              <p className="text-sm text-gray-400 mt-1">All caught up!</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record, idx) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">
                        {record.id}
                      </TableCell>
                      {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                        <TableCell key={col.key}>
                          {col.key === "deliveryDate"
                            ? new Date(record.data[col.key]).toLocaleDateString(
                                "en-IN"
                              )
                            : String(record.data[col.key] || "-")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(record.id)}
                        >
                          Negotiate
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
            stage={4}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Negotiation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Vendor Negotiation & Final Selection</DialogTitle>
            <p className="text-sm text-gray-600">
              Compare quotes and select the optimal vendor for procurement.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Vendor Comparison Table */}
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-medium">Vendor Comparison Matrix</h3>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Payment Terms</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead className="text-center">Select</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow
                          key={vendor.id}
                          className={
                            formData.selectedVendor === vendor.id
                              ? "bg-blue-50"
                              : ""
                          }
                        >
                          <TableCell className="font-semibold">
                            {vendor.id.toUpperCase()}
                          </TableCell>
                          <TableCell>{vendor.name}</TableCell>
                          <TableCell>
                            <span className="font-mono">₹{vendor.rate}</span>
                          </TableCell>
                          <TableCell>{vendor.terms}</TableCell>
                          <TableCell>
                            {vendor.delivery !== "-" ? (
                              <span className="text-sm">
                                {new Date(vendor.delivery).toLocaleDateString(
                                  "en-IN"
                                )}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="radio"
                              name="selectedVendor"
                              value={vendor.id}
                              checked={formData.selectedVendor === vendor.id}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  selectedVendor: e.target.value,
                                })
                              }
                              className="w-4 h-4"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Approval Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approvedBy">
                    Approved By <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="approvedBy"
                    value={formData.approvedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, approvedBy: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Choose approver...</option>
                    {approvers.map((approver) => (
                      <option key={approver} value={approver}>
                        {approver}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Negotiation Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    placeholder="Document negotiation outcomes..."
                    className="min-h-24"
                  />
                </div>
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
            <Button
              type="submit"
              disabled={!formData.selectedVendor || !formData.approvedBy}
              onClick={handleSubmit}
            >
              Confirm & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
