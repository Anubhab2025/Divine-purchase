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
import { Badge } from "@/components/ui/badge";
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
import {
  FileText,
  Upload,
} from "lucide-react";

export default function Stage14() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    freightNumber: "",
    paymentAmount: "",
    report: "",
    transportName: "",
    biltyImage: null as File | null,
    biltyNumber: "",
    totalPayment: "",
    totalPaid: "",
    pending: "",
    invoiceImage: null as File | null,
  });

  const pending = records.filter(
    (r) => r.stage === 14 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.stage > 14 || (r.stage === 14 && r.status !== "pending")
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
    { key: "freightNumber", label: "Freight #" },
    { key: "transportName", label: "Transport" },
    { key: "totalFreight", label: "Total Amount" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<string[]>(pendingColumns.map(col => col.key));
  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<string[]>(historyColumns.map(col => col.key));

  // Auto-calculate pending amount
  useEffect(() => {
    if (formData.totalPayment && formData.totalPaid) {
      const total = parseFloat(formData.totalPayment) || 0;
      const paid = parseFloat(formData.totalPaid) || 0;
      setFormData((prev) => ({
        ...prev,
        pending: (total - paid).toFixed(2),
      }));
    }
  }, [formData.totalPayment, formData.totalPaid]);

  const handleOpenForm = (recordId: string) => {
    setSelectedRecord(recordId);
    setFormData({
      freightNumber: `FR-${Date.now().toString().slice(-6)}`,
      paymentAmount: "",
      report: "",
      transportName: "",
      biltyImage: null,
      biltyNumber: "",
      totalPayment: "",
      totalPaid: "",
      pending: "",
      invoiceImage: null,
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
        freightNumber: "",
        paymentAmount: "",
        report: "",
        transportName: "",
        biltyImage: null,
        biltyNumber: "",
        totalPayment: "",
        totalPaid: "",
        pending: "",
        invoiceImage: null,
      });
    }
  };

  const isFormValid =
    formData.transportName &&
    formData.biltyNumber &&
    formData.paymentAmount;

  const handleFileRemove = (field: "biltyImage" | "invoiceImage") => {
    setFormData({ ...formData, [field]: null });
  };

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filters */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 14: Freight Payments</h2>
            <p className="text-gray-600 mt-1">Process transport and handling charges</p>
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
              <p className="text-lg text-gray-500">No pending freight payments</p>
              <p className="text-sm text-gray-400 mt-1">All transports paid!</p>
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
            stage={14}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={historyColumns.filter(col => selectedHistoryColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Freight Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Freight Payment Processing</DialogTitle>
            <p className="text-sm text-gray-600">
              Record transport, handling, and freight charges.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Freight No. */}
                <div className="space-y-2">
                  <Label>Freight No.</Label>
                  <Input
                    value={formData.freightNumber}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Transport Name */}
                <div className="space-y-2">
                  <Label htmlFor="transportName">Transport Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="transportName"
                    value={formData.transportName}
                    onChange={(e) =>
                      setFormData({ ...formData, transportName: e.target.value })
                    }
                    required
                    placeholder="e.g. Sharma Logistics"
                  />
                </div>

                {/* Bilty Number */}
                <div className="space-y-2">
                  <Label htmlFor="biltyNumber">Bilty Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="biltyNumber"
                    value={formData.biltyNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, biltyNumber: e.target.value })
                    }
                    required
                    placeholder="e.g. BIL-2025-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Amount */}
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount <span className="text-red-500">*</span></Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={formData.paymentAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentAmount: e.target.value })
                    }
                    required
                    placeholder="0.00"
                  />
                </div>

                {/* Report */}
                <div className="space-y-2">
                  <Label htmlFor="report">Report</Label>
                  <Input
                    id="report"
                    value={formData.report}
                    onChange={(e) =>
                      setFormData({ ...formData, report: e.target.value })
                    }
                    placeholder="Enter report details"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Total Payment */}
                <div className="space-y-2">
                  <Label htmlFor="totalPayment">Total Payment</Label>
                  <Input
                    id="totalPayment"
                    type="number"
                    step="0.01"
                    value={formData.totalPayment}
                    onChange={(e) =>
                      setFormData({ ...formData, totalPayment: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                {/* Total Paid */}
                <div className="space-y-2">
                  <Label htmlFor="totalPaid">Total Paid</Label>
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

                {/* Pending */}
                <div className="space-y-2">
                  <Label htmlFor="pending">Pending</Label>
                  <Input
                    id="pending"
                    value={formData.pending}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4">
                {/* Bilty image */}
                <div className="space-y-2">
                  <Label htmlFor="biltyImage">Bilty image</Label>
                  <div>
                    <input
                      id="biltyImage"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          biltyImage: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="biltyImage"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload Bilty Image</span>
                    </label>
                    {formData.biltyImage && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formData.biltyImage.name}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({(formData.biltyImage.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove("biltyImage")}
                          className="text-red-600 hover:text-red-800"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Image */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceImage">Invoice Image</Label>
                  <div>
                    <input
                      id="invoiceImage"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invoiceImage: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="invoiceImage"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload Invoice Image</span>
                    </label>
                    {formData.invoiceImage && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formData.invoiceImage.name}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({(formData.invoiceImage.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove("invoiceImage")}
                          className="text-red-600 hover:text-red-800"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
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
              Complete Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}