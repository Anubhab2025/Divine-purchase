"use client";

import React, { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Upload } from "lucide-react";

export default function Stage13() {
  const { records = [], updateRecord, moveToNextStage } = useWorkflow() || {};

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

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

  // -----------------------------------------------------------------
  // FILTER RECORDS
  // -----------------------------------------------------------------
  const pending = (records || []).filter(
    (r: any) => r?.stage === 13 && r?.status === "pending" && r?.data?.returnStatus === "return"
  );
  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history) ? r.history.some((h: any) => h?.stage === 13) : false
  );

  // -----------------------------------------------------------------
  // Pending columns (without return result fields)
  // -----------------------------------------------------------------
  const pendingColumns = [
    { key: "indentNumber", label: "Indent #" },
    { key: "createdBy", label: "Created By" },
    { key: "category", label: "Category" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "vendor", label: "Vendor" },
    { key: "ratePerQty", label: "Rate/Qty" },
    { key: "paymentTerms", label: "Payment Terms" },
    { key: "deliveryDate", label: "Exp. Delivery" },
    { key: "warranty", label: "Warranty" },
    { key: "poAttachment", label: "PO Attachment" },
    { key: "approvedBy", label: "Approved By" },
    { key: "poNumber", label: "PO Number" },
    { key: "basicValue", label: "Basic Value" },
    { key: "totalWithTax", label: "Total w/Tax" },
    { key: "poCopy", label: "PO Copy" },
    { key: "liftNumber", label: "Lift #" },
    { key: "liftQty", label: "Lift Qty" },
    { key: "transporter", label: "Transporter" },
    { key: "lrNumber", label: "LR #" },
    { key: "freight", label: "Freight" },
    { key: "advanceAmount", label: "Adv. Amt" },
    { key: "paymentDate", label: "Pay Date" },
    { key: "biltyNumber", label: "Bilty #" },
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "invoiceDate", label: "Invoice Date" },
    { key: "srnNumber", label: "SRN #" },
    { key: "qcRequired", label: "QC Required" },
    { key: "receivedItemImage", label: "Rec. Item Img" },
    { key: "hydraAmount", label: "Hydra Amt" },
    { key: "labourAmount", label: "Labour Amt" },
    { key: "hemaliAmount", label: "Hemali Amt" },
    { key: "qcBy", label: "QC Done By" },
    { key: "qcDate", label: "QC Date" },
    { key: "qcStatus", label: "QC Status" },
    { key: "rejectQty", label: "Reject Qty" },
    { key: "rejectRemarks", label: "Reject Remarks" },
    { key: "qcRemarks", label: "QC Remarks" },
    { key: "doneBy", label: "Tally Done By" },
    { key: "submissionDate", label: "Tally Date" },
    { key: "remarks", label: "Tally Remarks" },
    { key: "handoverBy", label: "Handover By" },
    { key: "receivedBy", label: "Received By (Stage 10)" },
    { key: "invoiceSubmissionDate", label: "Invoice Submission Date" },
    { key: "verifiedReceivedBy", label: "Verified – Received By" },
    { key: "verifiedCheckedBy", label: "Verified – Checked By" },
    { key: "verificationDate", label: "Verification Date" },
    { key: "verificationRemarks", label: "Verification Remarks" },
    { key: "amount", label: "Amount" },
    { key: "vendorPayment", label: "Vendor Payment" },
    { key: "paymentDueDate", label: "Payment Due Date" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "paymentProof", label: "Payment Proof" },
    { key: "totalPaid", label: "Total Paid" },
    { key: "pendingAmount", label: "Pending Amount" },
    { key: "returnStatus", label: "Return Status" },
  ];

  // History columns (includes return result fields)
  // -----------------------------------------------------------------
  const historyColumns = [
    ...pendingColumns,
    { key: "returnedQty", label: "Returned Qty" },
    { key: "returnRate", label: "Return Rate" },
    { key: "returnReason", label: "Return Reason" },
    { key: "returnRemarks", label: "Return Remarks" },
    { key: "returnPhoto", label: "Return Photo" },
    { key: "returnAttachment", label: "Return Attachment" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<string[]>(
    pendingColumns.map((c) => c.key)
  );

  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<string[]>(
    historyColumns.map((c) => c.key)
  );

  // -----------------------------------------------------------------
  // OPEN MODAL & PRE‑FILL
  // -----------------------------------------------------------------
  const handleOpenForm = (recordId: string) => {
    const rec = records.find((r: any) => r.id === recordId);
    if (!rec) return;

    const qty = parseInt(rec.data?.quantity || "0", 10) || 0;
    setOriginalQty(qty);

    setSelectedRecord(recordId);
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

  // -----------------------------------------------------------------
  // AUTO CALCULATE RETURN AMOUNT
  // -----------------------------------------------------------------
  const returnedQty = parseInt(formData.returnedQty, 10) || 0;
  const returnAmount = returnedQty * (parseFloat(formData.returnRate) || 0);

  // -----------------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const payload = {
      returnedQty: formData.returnedQty,
      returnRate: formData.returnRate,
      returnReason: formData.returnReason,
      returnStatus: formData.returnStatus,
      returnRemarks: formData.remarks,
      returnPhoto: formData.photo?.name || null,
      returnAttachment: formData.returnAttachment?.name || null,
      returnAmount: returnAmount.toFixed(2),
    };

    updateRecord(selectedRecord, payload);
    moveToNextStage(selectedRecord);

    // Reset
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
  };

  const isFormValid =
    formData.returnedQty &&
    formData.returnRate &&
    formData.returnReason &&
    formData.returnStatus &&
    returnedQty <= originalQty;

  // -----------------------------------------------------------------
  // Get vendor data
  // -----------------------------------------------------------------
  const getVendorData = (record: any) => {
    const selectedId = record?.data?.selectedVendor || "vendor1";
    const idx = parseInt(selectedId.replace("vendor", ""), 10) || 1;
    return {
      name: record?.data?.[`vendor${idx}Name`] || record?.data?.vendorName || "-",
      rate: record?.data?.[`vendor${idx}Rate`] || record?.data?.ratePerQty || "-",
      terms: record?.data?.[`vendor${idx}Terms`] || record?.data?.paymentTerms || "-",
      delivery: record?.data?.[`vendor${idx}DeliveryDate`] || record?.data?.deliveryDate,
      warrantyType: record?.data?.[`vendor${idx}WarrantyType`] || record?.data?.warrantyType || "-",
      attachment: record?.data?.[`vendor${idx}Attachment`] || record?.data?.vendorAttachment,
    };
  };

  // -----------------------------------------------------------------
  // SAFE VALUE
  // -----------------------------------------------------------------
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 13)?.data || record?.data
        : record?.data;

      // Get lifting data
      const lift = (data?.liftingData as any[] ?? [])[0] ?? {};
      const vendor = getVendorData({ data });

      // Handle lifting data fields
      if (key === "liftNumber") return lift.liftNumber || "-";
      if (key === "liftQty") return lift.liftingQty || lift.liftQty || "-";
      if (key === "transporter") return lift.transporterName || lift.transporter || "-";
      if (key === "lrNumber") return lift.lrNumber || "-";
      if (key === "freight") return lift.freightAmount ? `₹${lift.freightAmount}` : (lift.freight ? `₹${lift.freight}` : "-");
      if (key === "advanceAmount") return lift.advanceAmount ? `₹${lift.advanceAmount}` : "-";
      if (key === "paymentDate") return lift.paymentDate ? new Date(lift.paymentDate).toLocaleDateString("en-IN") : "-";
      if (key === "biltyNumber") return lift.biltyCopy?.name || lift.biltyNumber || "-";

      // Handle vendor data fields
      if (key === "vendor") return vendor.name;
      if (key === "ratePerQty") return vendor.rate ? `₹${vendor.rate}` : "-";
      if (key === "paymentTerms") return vendor.terms;
      if (key === "warranty") return vendor.warrantyType;
      if (key === "poAttachment") return vendor.attachment?.name || "-";

      // Handle warehouse
      if (key === "warehouse") return data?.warehouseLocation || data?.warehouse || "-";

      // Handle Stage 7 payment amounts
      if (key === "hydraAmount") return data?.paymentAmountHydra ? `₹${data.paymentAmountHydra}` : "-";
      if (key === "labourAmount") return data?.paymentAmountLabour ? `₹${data.paymentAmountLabour}` : "-";
      if (key === "hemaliAmount") return data?.paymentAmountHemali ? `₹${data.paymentAmountHemali}` : "-";

      // Handle QC Required
      if (key === "qcRequired") return data?.qcRequirement || "-";

      // Handle payment amounts
      if (key === "amount") return data?.amount ? `₹${data.amount}` : "-";
      if (key === "totalPaid") return data?.totalPaid ? `₹${data.totalPaid}` : "-";
      if (key === "pendingAmount") return data?.pendingAmount ? `₹${data.pendingAmount}` : "-";

      // Handle regular fields
      const val = data?.[key];
      if (val === undefined || val === null) return "-";
      return key.includes("Date") && val
        ? new Date(val).toLocaleDateString("en-IN")
        : String(val);
    } catch {
      return "-";
    }
  };

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  if (!records) {
    return <div className="p-6 text-center text-red-600">Loading…</div>;
  }

  return (
    <div className="p-6">
      {/* ────────────────────── HEADER ────────────────────── */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 13: Purchase Return</h2>
            <p className="text-gray-600 mt-1">Process return of defective or excess material</p>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={
                  activeTab === "pending"
                    ? `${selectedPendingColumns.length} selected`
                    : `${selectedHistoryColumns.length} selected`
                } />
              </SelectTrigger>
              <SelectContent className="w-64 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={
                        activeTab === "pending"
                          ? selectedPendingColumns.length === pendingColumns.length
                          : selectedHistoryColumns.length === historyColumns.length
                      }
                      onCheckedChange={(c) => {
                        if (activeTab === "pending") {
                          setSelectedPendingColumns(c ? pendingColumns.map((x) => x.key) : []);
                        } else {
                          setSelectedHistoryColumns(c ? historyColumns.map((x) => x.key) : []);
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All</Label>
                  </div>
                  {(activeTab === "pending" ? pendingColumns : historyColumns).map((col) => (
                    <div key={col.key} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={
                          activeTab === "pending"
                            ? selectedPendingColumns.includes(col.key)
                            : selectedHistoryColumns.includes(col.key)
                        }
                        onCheckedChange={(c) => {
                          if (activeTab === "pending") {
                            setSelectedPendingColumns(
                              c
                                ? [...selectedPendingColumns, col.key]
                                : selectedPendingColumns.filter((x) => x !== col.key)
                            );
                          } else {
                            setSelectedHistoryColumns(
                              c
                                ? [...selectedHistoryColumns, col.key]
                                : selectedHistoryColumns.filter((x) => x !== col.key)
                            );
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

      {/* ────────────────────── TABS ────────────────────── */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        {/* ───── PENDING ───── */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending returns</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">ID</TableHead>
                    {pendingColumns
                      .filter((c) => selectedPendingColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    <TableHead className="sticky right-0 bg-white z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((rec: any) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {rec.id}
                      </TableCell>
                      {pendingColumns
                        .filter((c) => selectedPendingColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(rec, col.key)}
                          </TableCell>
                        ))}
                      <TableCell className="sticky right-0 bg-white z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(rec.id)}
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

        {/* ───── COMPLETED (HISTORY) ───── */}
        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No returns processed yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">ID</TableHead>
                    {historyColumns
                      .filter((c) => selectedHistoryColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((rec: any) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {rec.id}
                      </TableCell>
                      {historyColumns
                        .filter((c) => selectedHistoryColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(rec, col.key, true)}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ────────────────────── MODAL ────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Purchase Return Processing</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Returned Qty & Rate */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="returnedQty">Returned Qty *</Label>
                  <Input
                    id="returnedQty"
                    type="number"
                    min="1"
                    max={originalQty}
                    value={formData.returnedQty}
                    onChange={(e) => setFormData({ ...formData, returnedQty: e.target.value })}
                    required
                    placeholder={`Max: ${originalQty}`}
                  />
                </div>
                <div>
                  <Label htmlFor="returnRate">Return Rate *</Label>
                  <Input
                    id="returnRate"
                    type="number"
                    step="0.01"
                    value={formData.returnRate}
                    onChange={(e) => setFormData({ ...formData, returnRate: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Return Amount</Label>
                  <Input
                    value={returnAmount.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Reason & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="returnReason">Return Reason *</Label>
                  <Input
                    id="returnReason"
                    value={formData.returnReason}
                    onChange={(e) => setFormData({ ...formData, returnReason: e.target.value })}
                    required
                    placeholder="e.g. Defective, Excess"
                  />
                </div>
                <div>
                  <Label htmlFor="returnStatus">Return Status *</Label>
                  <Select
                    value={formData.returnStatus}
                    onValueChange={(v) => setFormData({ ...formData, returnStatus: v })}
                  >
                    <SelectTrigger id="returnStatus">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="returned">Returned to Vendor</SelectItem>
                      <SelectItem value="credit-note">Credit Note Issued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Photo */}
              <div>
                <Label htmlFor="photo">Return Photo</Label>
                <div>
                  <input
                    id="photo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.files?.[0] || null })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.photo ? formData.photo.name : "Upload Photo"}
                    </span>
                  </label>
                  {formData.photo && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm">
                        {formData.photo.name} ({(formData.photo.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachment */}
              <div>
                <Label htmlFor="returnAttachment">Return Attachment</Label>
                <div>
                  <input
                    id="returnAttachment"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({ ...formData, returnAttachment: e.target.files?.[0] || null })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="returnAttachment"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.returnAttachment ? formData.returnAttachment.name : "Upload File"}
                    </span>
                  </label>
                  {formData.returnAttachment && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm">
                        {formData.returnAttachment.name} ({(formData.returnAttachment.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <Label htmlFor="remarks">Return Remarks</Label>
                <textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded resize-none"
                  placeholder="Any additional notes..."
                />
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Process Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}