"use client";

import type React from "react";
import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, X } from "lucide-react";

export default function Stage7() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    liftNumber: "",
    receivedQty: "",
    invoiceNumber: "",
    invoiceDate: "",
    srnNumber: "",
    billAttachment: null as File | null,
    receivedItemImage: null as File | null,
    othersPaymentHead: "",
    paymentAmountHydra: "",
    paymentAmountLabour: "",
    paymentAmountHemali: "",
    qcRequirement: "",
    remarks: "",
  });

  const pending = records.filter(
    (r) => r.stage === 7 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 7)
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
    { key: "receivedQty", label: "Received Qty" },
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "srnNumber", label: "SRN #" },
    { key: "qcRequirement", label: "QC Required" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    const liftNumber = record?.data?.liftNumber || `LIFT-${Date.now().toString().slice(-6)}`;
    setSelectedRecord(recordId);
    setFormData({
      liftNumber,
      receivedQty: "",
      invoiceNumber: "",
      invoiceDate: "",
      srnNumber: "",
      billAttachment: null,
      receivedItemImage: null,
      othersPaymentHead: "",
      paymentAmountHydra: "",
      paymentAmountLabour: "",
      paymentAmountHemali: "",
      qcRequirement: "",
      remarks: "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      updateRecord(selectedRecord, formData);
      moveToNextStage(selectedRecord);
      setOpen(false);
      setSelectedRecord(null);
      setFormData({
        liftNumber: "",
        receivedQty: "",
        invoiceNumber: "",
        invoiceDate: "",
        srnNumber: "",
        billAttachment: null,
        receivedItemImage: null,
        othersPaymentHead: "",
        paymentAmountHydra: "",
        paymentAmountLabour: "",
        paymentAmountHemali: "",
        qcRequirement: "",
        remarks: "",
      });
    }
  };

  const handleFileRemove = (field: "billAttachment" | "receivedItemImage") => {
    setFormData({ ...formData, [field]: null });
  };

  const isFormValid =
    formData.receivedQty &&
    formData.invoiceNumber &&
    formData.invoiceDate &&
    formData.srnNumber &&
    formData.qcRequirement;

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 7: Material Receipt</h2>
            <p className="text-gray-600 mt-1">Record received goods, invoice, and QC status</p>
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
              <p className="text-lg text-gray-500">No pending receipts</p>
              <p className="text-sm text-gray-400 mt-1">All materials are recorded!</p>
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
                          Record Receipt
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
            stage={7}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Material Receipt Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Record Material Receipt</DialogTitle>
            <p className="text-sm text-gray-600">
              Confirm delivery, attach documents, and update QC status.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Lift Number */}
                <div className="space-y-2">
                  <Label htmlFor="liftNumber">Lift Number</Label>
                  <Input
                    id="liftNumber"
                    value={formData.liftNumber}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Received quantity */}
                <div className="space-y-2">
                  <Label htmlFor="receivedQty">
                    Received quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="receivedQty"
                    type="number"
                    value={formData.receivedQty}
                    onChange={(e) =>
                      setFormData({ ...formData, receivedQty: e.target.value })
                    }
                    required
                    placeholder="0"
                  />
                </div>

                {/* invoice number */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">
                    Invoice number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceNumber: e.target.value })
                    }
                    required
                    placeholder="Enter invoice number"
                  />
                </div>

                {/* Invoice Date */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">
                    Invoice Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceDate: e.target.value })
                    }
                    required
                  />
                </div>

                {/* SRN number */}
                <div className="space-y-2">
                  <Label htmlFor="srnNumber">
                    SRN number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="srnNumber"
                    value={formData.srnNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, srnNumber: e.target.value })
                    }
                    required
                    placeholder="Enter SRN number"
                  />
                </div>

                {/* QC REQUIREMENT */}
                <div className="space-y-2">
                  <Label htmlFor="qcRequirement">
                    QC REQUIREMENT <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="qcRequirement"
                    value={formData.qcRequirement}
                    onChange={(e) =>
                      setFormData({ ...formData, qcRequirement: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4">
                {/* Bill attachment */}
                <div className="space-y-2">
                  <Label htmlFor="billAttachment">Bill attachment</Label>
                  <div>
                    <input
                      id="billAttachment"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billAttachment: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="billAttachment"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload Bill</span>
                    </label>
                    {formData.billAttachment && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formData.billAttachment.name}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({(formData.billAttachment.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove("billAttachment")}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Received Item Image */}
                <div className="space-y-2">
                  <Label htmlFor="receivedItemImage">Received Item Image</Label>
                  <div>
                    <input
                      id="receivedItemImage"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          receivedItemImage: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="receivedItemImage"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload Image</span>
                    </label>
                    {formData.receivedItemImage && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formData.receivedItemImage.name}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({(formData.receivedItemImage.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove("receivedItemImage")}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Heads */}
              <div className="space-y-4">
                <h3 className="font-medium">Others Payment Head</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Hydra */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmountHydra">Hydra Amount</Label>
                    <Input
                      id="paymentAmountHydra"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.paymentAmountHydra}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentAmountHydra: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  {/* Labour */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmountLabour">Labour Amount</Label>
                    <Input
                      id="paymentAmountLabour"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.paymentAmountLabour}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentAmountLabour: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  {/* Hemali */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmountHemali">Hemali Amount</Label>
                    <Input
                      id="paymentAmountHemali"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.paymentAmountHemali}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentAmountHemali: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  placeholder="Any special notes..."
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
              Record Receipt & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}