"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export default function Stage10() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    handoverBy: "",
    receivedBy: "",
    submissionDate: "",
    invoiceNumber: "",
    vendorName: "",
  });

  const pending = records.filter(
    (r) => r.stage === 10 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 10)
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
    { key: "invoiceNumber", label: "Invoice #" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  // Recompute validation whenever formData changes
  const isFormValid =
    formData.handoverBy &&
    formData.receivedBy &&
    formData.submissionDate &&
    formData.invoiceNumber &&
    formData.vendorName;

  // Reset form when opening dialog
  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    const today = new Date().toISOString().split("T")[0];

    // Safely extract invoice and vendor
    const invoiceNumber = record?.data?.invoiceNumber || "";
    const vendorName =
      record?.data?.vendorName ||
      record?.data?.vendor ||
      record?.data?.vendor_name ||
      "Unknown Vendor";

    setSelectedRecord(recordId);
    setFormData({
      handoverBy: "",
      receivedBy: "",
      submissionDate: today,
      invoiceNumber,
      vendorName,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecord || !isFormValid) {
      console.log("Form invalid or no record selected");
      return;
    }

    updateRecord(selectedRecord, formData);
    moveToNextStage(selectedRecord);

    // Reset
    setOpen(false);
    setSelectedRecord(null);
    setFormData({
      handoverBy: "",
      receivedBy: "",
      submissionDate: "",
      invoiceNumber: "",
      vendorName: "",
    });
  };

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 10: Submit Invoice to Accounts</h2>
            <p className="text-gray-600 mt-1">Hand over original invoice for payment processing</p>
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
              <p className="text-lg text-gray-500">No pending invoice submissions</p>
              <p className="text-sm text-gray-400 mt-1">All invoices are with Accounts!</p>
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
                          Submit Invoice
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
            stage={10}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Invoice Submission Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Submit Original Invoice to Accounts</DialogTitle>
            <p className="text-sm text-gray-600">
              Hand over physical invoice for final payment processing.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invoice Summary */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <p className="font-mono text-lg">{formData.invoiceNumber || "—"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor Name</Label>
                    <p className="text-lg">{formData.vendorName}</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Handover By Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="handoverBy">
                    Handover By (Submitted By) <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="handoverBy"
                    value={formData.handoverBy}
                    onChange={(e) =>
                      setFormData({ ...formData, handoverBy: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select submitter...</option>
                    <option value="Vikram Singh">Vikram Singh</option>
                    <option value="Priya Sharma">Priya Sharma</option>
                    <option value="Rajesh Kumar">Rajesh Kumar</option>
                    <option value="Anita Patel">Anita Patel</option>
                    <option value="Sneha Gupta">Sneha Gupta</option>
                  </select>
                </div>

                {/* Received By Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="receivedBy">
                    Received By (Accounts) <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="receivedBy"
                    value={formData.receivedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, receivedBy: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select accounts person...</option>
                    <option value="Amit Shah">Amit Shah</option>
                    <option value="Neha Jain">Neha Jain</option>
                    <option value="Suresh Patel">Suresh Patel</option>
                    <option value="Kavita Rao">Kavita Rao</option>
                    <option value="Rohit Verma">Rohit Verma</option>
                  </select>
                </div>

                {/* Date of Submission Dropdown */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="submissionDate">
                    Date of Submission <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="submissionDate"
                    value={formData.submissionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, submissionDate: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select date...</option>
                    <option value={new Date().toISOString().split("T")[0]}>Today</option>
                    <option value={new Date(Date.now() + 86400000).toISOString().split("T")[0]}>Tomorrow</option>
                    <option value={new Date(Date.now() + 172800000).toISOString().split("T")[0]}>Day After Tomorrow</option>
                  </select>
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
            <Button type="submit" disabled={!isFormValid} onClick={handleSubmit}>
              Submit to Accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}