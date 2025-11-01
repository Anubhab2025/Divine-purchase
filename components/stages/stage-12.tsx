"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { FileText, Upload } from "lucide-react";

export default function Stage12() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: "",
    paymentTerms: "",
    dueDate: "",
    amount: "",
    paymentStatus: "",
    attachment: null as File | null,
    totalPaid: "",
    pendingAmount: "",
  });

  const pending = records.filter(
    (r) => r.stage === 12 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 12)
  );

  const pendingColumns = [
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
    { key: "vendorName", label: "Vendor" },
  ];

  const historyColumns = [
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
    { key: "vendorName", label: "Vendor" },
    { key: "paymentAmount", label: "Payment Amount" },
    { key: "paymentStatus", label: "Payment Status" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<string[]>(pendingColumns.map(col => col.key));
  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<string[]>(historyColumns.map(col => col.key));

  // Auto-calculate pending amount
  useEffect(() => {
    if (formData.totalPaid && formData.amount) {
      const total = parseFloat(formData.totalPaid) || 0;
      const paid = parseFloat(formData.amount) || 0;
      setFormData((prev) => ({
        ...prev,
        pendingAmount: (total - paid).toFixed(2),
      }));
    }
  }, [formData.totalPaid, formData.amount]);

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    const today = new Date();
    const dueDate = new Date(today.setDate(today.getDate() + 30))
      .toISOString()
      .split("T")[0];

    const vendorName = record?.data?.vendorName || record?.data?.vendor || "Unknown Vendor";
    const invoiceNumber = record?.data?.invoiceNumber || "";
    const invoiceDate = record?.data?.invoiceDate || "";
    const totalPayment = record?.data?.totalAmount || record?.data?.invoiceAmount || "";

    setSelectedRecord(recordId);
    setFormData({
      vendorName,
      invoiceNumber,
      invoiceDate,
      paymentTerms: "Net 30",
      dueDate,
      amount: "",
      paymentStatus: "",
      attachment: null,
      totalPaid: totalPayment,
      pendingAmount: "",
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
        vendorName: "",
        invoiceNumber: "",
        invoiceDate: "",
        paymentTerms: "",
        dueDate: "",
        amount: "",
        paymentStatus: "",
        attachment: null,
        totalPaid: "",
        pendingAmount: "",
      });
    }
  };

  const isFormValid =
    formData.vendorName &&
    formData.amount &&
    formData.dueDate &&
    formData.paymentStatus;

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filters */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 12: Vendor Payment</h2>
            <p className="text-gray-600 mt-1">Process final payment to vendor</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Pending Columns:</Label>
              <Select
                value=""
                onValueChange={() => {}}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder={`${selectedPendingColumns.length} selected`} />
                </SelectTrigger>
                <SelectContent className="w-56">
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                      <Checkbox
                        checked={selectedPendingColumns.length === pendingColumns.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPendingColumns(pendingColumns.map(col => col.key));
                          } else {
                            setSelectedPendingColumns([]);
                          }
                        }}
                      />
                      <Label className="text-sm font-medium">All Columns</Label>
                    </div>
                    {pendingColumns.map((col) => (
                      <div key={col.key} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={selectedPendingColumns.includes(col.key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPendingColumns([...selectedPendingColumns, col.key]);
                            } else {
                              setSelectedPendingColumns(selectedPendingColumns.filter(c => c !== col.key));
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

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">History Columns:</Label>
              <Select
                value=""
                onValueChange={() => {}}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder={`${selectedHistoryColumns.length} selected`} />
                </SelectTrigger>
                <SelectContent className="w-56">
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                      <Checkbox
                        checked={selectedHistoryColumns.length === historyColumns.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedHistoryColumns(historyColumns.map(col => col.key));
                          } else {
                            setSelectedHistoryColumns([]);
                          }
                        }}
                      />
                      <Label className="text-sm font-medium">All Columns</Label>
                    </div>
                    {historyColumns.map((col) => (
                      <div key={col.key} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={selectedHistoryColumns.includes(col.key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedHistoryColumns([...selectedHistoryColumns, col.key]);
                            } else {
                              setSelectedHistoryColumns(selectedHistoryColumns.filter(c => c !== col.key));
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
              <p className="text-lg text-gray-500">No pending payments</p>
              <p className="text-sm text-gray-400 mt-1">All vendors paid!</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    {pendingColumns.filter(col => selectedPendingColumns.includes(col.key)).map((col) => (
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
                      {pendingColumns.filter(col => selectedPendingColumns.includes(col.key)).map((col) => (
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
                          Process Payment
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
            stage={12}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={historyColumns.filter(col => selectedHistoryColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Vendor Payment Processing</DialogTitle>
            <p className="text-sm text-gray-600">
              Finalize payment terms and initiate vendor payment.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Vendor Name */}
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Invoice No. */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice No.</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Invoice Date */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    value={formData.invoiceDate}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Payment Terms */}
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Input
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTerms: e.target.value })
                    }
                    placeholder="e.g. Net 30, Advance"
                  />
                </div>

                {/* Payment Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Payment Due Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    placeholder="0.00"
                  />
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status <span className="text-red-500">*</span></Label>
                  <select
                    id="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select status...</option>
                    <option value="paid">Paid – Full/Partial</option>
                    <option value="pending">Pending – Scheduled</option>
                  </select>
                </div>

                {/* Total paid */}
                <div className="space-y-2">
                  <Label htmlFor="totalPaid">Total paid</Label>
                  <Input
                    id="totalPaid"
                    type="number"
                    step="0.01"
                    value={formData.totalPaid}
                    onChange={(e) =>
                      setFormData({ ...formData, totalPaid: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                {/* Pending Amount */}
                <div className="space-y-2">
                  <Label htmlFor="pendingAmount">Pending Amount</Label>
                  <Input
                    id="pendingAmount"
                    value={formData.pendingAmount}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* attachment */}
              <div className="space-y-2">
                <Label htmlFor="attachment">attachment</Label>
                <div>
                  <input
                    id="attachment"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attachment: e.target.files?.[0] || null,
                      })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="attachment"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload attachment</span>
                  </label>
                  {formData.attachment && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {formData.attachment.name}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          ({(formData.attachment.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  )}
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
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}