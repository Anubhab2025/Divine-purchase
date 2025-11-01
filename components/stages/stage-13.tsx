"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { FileText, Upload } from "lucide-react";

export default function Stage13() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    returnedQty: "",
    returnRate: "",
    returnReason: "",
    returnStatus: "",
    remarks: "",
    photo: null as File | null,
    returnAttachment: null as File | null,
  });

  const [originalQty, setOriginalQty] = useState(0);

  const pending = records.filter(
    (r) => r.stage === 13 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 13)
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
    { key: "returnStatus", label: "Return Status" },
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
    { key: "returnedQty", label: "Qty Returned" },
    { key: "returnStatus", label: "Return Status" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<string[]>(pendingColumns.map(col => col.key));
  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<string[]>(historyColumns.map(col => col.key));

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    const qty = parseInt(record?.data?.quantity || "0", 10) || 0;

    setSelectedRecord(recordId);
    setOriginalQty(qty);
    setFormData({
      returnedQty: "",
      returnRate: "",
      returnReason: "",
      returnStatus: "",
      remarks: "",
      photo: null,
      returnAttachment: null,
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
        returnedQty: "",
        returnRate: "",
        returnReason: "",
        returnStatus: "",
        remarks: "",
        photo: null,
        returnAttachment: null,
      });
    }
  };

  const isFormValid =
    formData.returnedQty &&
    formData.returnRate &&
    formData.returnReason &&
    formData.returnStatus &&
    parseInt(formData.returnedQty, 10) <= originalQty;

  const returnedQty = parseInt(formData.returnedQty, 10) || 0;
  const returnAmount = returnedQty * (parseFloat(formData.returnRate) || 0);

  const handleFileRemove = (field: "photo" | "returnAttachment") => {
    setFormData({ ...formData, [field]: null });
  };

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filters */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 13: Purchase Return</h2>
            <p className="text-gray-600 mt-1">Process return of defective or excess material</p>
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
              <p className="text-lg text-gray-500">No pending returns</p>
              <p className="text-sm text-gray-400 mt-1">All materials accepted!</p>
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
                          Process Return
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
            stage={13}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={historyColumns.filter(col => selectedHistoryColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Return Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Purchase Return Processing</DialogTitle>
            <p className="text-sm text-gray-600">
              Return defective or excess material to vendor.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-3 gap-4">
                {/* Invoice No. */}
                <div className="space-y-2">
                  <Label>Invoice No.</Label>
                  <Input
                    value={records.find(r => r.id === selectedRecord)?.data?.invoiceNumber || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Vendor name */}
                <div className="space-y-2">
                  <Label>Vendor name</Label>
                  <Input
                    value={records.find(r => r.id === selectedRecord)?.data?.vendorName || records.find(r => r.id === selectedRecord)?.data?.vendor || "Unknown Vendor"}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Item Name */}
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    value={records.find(r => r.id === selectedRecord)?.data?.itemName || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Returned Item details */}
              <div className="space-y-4">
                <h3 className="font-medium">Returned Item details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Qty */}
                  <div className="space-y-2">
                    <Label htmlFor="returnedQty">Qty <span className="text-red-500">*</span></Label>
                    <Input
                      id="returnedQty"
                      type="number"
                      min="1"
                      max={originalQty}
                      value={formData.returnedQty}
                      onChange={(e) =>
                        setFormData({ ...formData, returnedQty: e.target.value })
                      }
                      required
                      placeholder={`Max: ${originalQty}`}
                    />
                  </div>

                  {/* Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="returnRate">Rate <span className="text-red-500">*</span></Label>
                    <Input
                      id="returnRate"
                      type="number"
                      step="0.01"
                      value={formData.returnRate}
                      onChange={(e) =>
                        setFormData({ ...formData, returnRate: e.target.value })
                      }
                      required
                      placeholder="0.00"
                    />
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="returnReason">Reason <span className="text-red-500">*</span></Label>
                    <Input
                      id="returnReason"
                      value={formData.returnReason}
                      onChange={(e) =>
                        setFormData({ ...formData, returnReason: e.target.value })
                      }
                      required
                      placeholder="Return reason"
                    />
                  </div>
                </div>
              </div>

              {/* Return Status */}
              <div className="space-y-2">
                <Label htmlFor="returnStatus">Return Status <span className="text-red-500">*</span></Label>
                <select
                  id="returnStatus"
                  value={formData.returnStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, returnStatus: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select status</option>
                  <option value="returned">Returned to Vendor</option>
                  <option value="not-returned">Not Returned (Credit Note)</option>
                </select>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4">
                {/* Photo */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <div>
                    <input
                      id="photo"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          photo: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload Photo</span>
                    </label>
                    {formData.photo && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formData.photo.name}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({(formData.photo.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove("photo")}
                          className="text-red-600 hover:text-red-800"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Attachment */}
                <div className="space-y-2">
                  <Label htmlFor="returnAttachment">Return Attachment</Label>
                  <div>
                    <input
                      id="returnAttachment"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          returnAttachment: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="returnAttachment"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload Return Attachment</span>
                    </label>
                    {formData.returnAttachment && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formData.returnAttachment.name}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({(formData.returnAttachment.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove("returnAttachment")}
                          className="text-red-600 hover:text-red-800"
                        >
                          X
                        </button>
                      </div>
                    )}
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
                  placeholder="Any additional notes..."
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
              Process Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}