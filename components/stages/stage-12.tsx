"use client";

import React, { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { FileText, Upload } from "lucide-react";

export default function Stage12() {
  const { records = [], updateRecord, moveToNextStage } = useWorkflow() || {};

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const [formData, setFormData] = useState({
    amount: "",
    vendorPayment: "",
    paymentDueDate: new Date(),
    paymentStatus: "",
    paymentAttachment: null as File | null,
    totalPaid: "",
    pendingAmount: "",
  });

  // -----------------------------------------------------------------
  // FILTER RECORDS
  // -----------------------------------------------------------------
  const pending = (records || []).filter(
    (r: any) => r?.stage === 12 && r?.status === "pending"
  );
  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history) ? r.history.some((h: any) => h?.stage === 12) : false
  );

  // -----------------------------------------------------------------
  // Pending columns (without payment result fields)
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
    { key: "returnStatus", label: "Return Status" },
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
  ];

  // History columns (includes payment result fields)
  // -----------------------------------------------------------------
  const historyColumns = [
    ...pendingColumns,
    { key: "amount", label: "Amount" },
    { key: "vendorPayment", label: "Vendor Payment" },
    { key: "paymentDueDate", label: "Payment Due Date" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "paymentAttachment", label: "Payment Proof" },
    { key: "totalPaid", label: "Total Paid" },
    { key: "pendingAmount", label: "Pending Amount" },
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

    const amount = rec.data?.totalWithTax || rec.data?.basicValue || "";
    const totalPaid = rec.data?.totalWithTax || "";

    setSelectedRecord(recordId);
    setFormData({
      amount: String(amount),
      vendorPayment: "",
      paymentDueDate: new Date(),
      paymentStatus: "",
      paymentAttachment: null,
      totalPaid: String(totalPaid),
      pendingAmount: "",
    });
    setOpen(true);
  };

  // -----------------------------------------------------------------
  // AUTO CALCULATE PENDING AMOUNT
  // -----------------------------------------------------------------
  useEffect(() => {
    const total = parseFloat(formData.totalPaid) || 0;
    const paid = parseFloat(formData.amount) || 0;
    setFormData((prev) => ({
      ...prev,
      pendingAmount: (total - paid).toFixed(2),
    }));
  }, [formData.totalPaid, formData.amount]);

  // -----------------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const payload = {
      amount: formData.amount,
      vendorPayment: formData.vendorPayment,
      paymentDueDate: formData.paymentDueDate.toISOString().split("T")[0],
      paymentStatus: formData.paymentStatus,
      paymentAttachment: formData.paymentAttachment?.name || null,
      totalPaid: formData.totalPaid,
      pendingAmount: formData.pendingAmount,
    };

    updateRecord(selectedRecord, payload);
    moveToNextStage(selectedRecord);

    // Reset
    setOpen(false);
    setSelectedRecord(null);
    setFormData({
      amount: "",
      vendorPayment: "",
      paymentDueDate: new Date(),
      paymentStatus: "",
      paymentAttachment: null,
      totalPaid: "",
      pendingAmount: "",
    });
  };

  const isFormValid =
    formData.amount &&
    formData.vendorPayment &&
    formData.paymentStatus;

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

  // SAFE VALUE
  // -----------------------------------------------------------------
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 12)?.data || record?.data
        : record?.data;

      // Get lifting data
      const lift = (data?.liftingData as any[] ?? [])[0] ?? {};
      const vendor = getVendorData({ data });

      // Handle lifting data fields
      if (key === "liftNumber") return lift.liftNumber || "-";
      if (key === "liftQty") return lift.liftingQty || "-";
      if (key === "transporter") return lift.transporterName || "-";
      if (key === "lrNumber") return lift.lrNumber || "-";
      if (key === "freight") return lift.freightAmount ? `₹${lift.freightAmount}` : "-";
      if (key === "advanceAmount") return lift.advanceAmount ? `₹${lift.advanceAmount}` : "-";
      if (key === "paymentDate") return lift.paymentDate ? new Date(lift.paymentDate).toLocaleDateString("en-IN") : "-";
      if (key === "biltyNumber") return lift.biltyCopy?.name || "-";

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
            <h2 className="text-2xl font-bold">Stage 12: Vendor Payment</h2>
            <p className="text-gray-600 mt-1">Process final payment to vendor</p>
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
              <p className="text-lg">No pending payments</p>
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
                          Pay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ───── COMPLETED ───── */}
        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No payments made yet</p>
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
            <DialogTitle>Vendor Payment</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount (pre‑filled) */}
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder="Auto‑filled from Total w/Tax"
                />
              </div>

              {/* Vendor Payment (free text) */}
              <div>
                <Label htmlFor="vendorPayment">Vendor Payment *</Label>
                <Input
                  id="vendorPayment"
                  value={formData.vendorPayment}
                  onChange={(e) => setFormData({ ...formData, vendorPayment: e.target.value })}
                  required
                  placeholder="e.g. RTGS, NEFT, Cheque #12345"
                />
              </div>

              {/* Payment Due Date */}
              <div>
                <Label htmlFor="paymentDueDate">Payment Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="paymentDueDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {formData.paymentDueDate
                        ? format(formData.paymentDueDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.paymentDueDate}
                      onSelect={(d) =>
                        d && setFormData({ ...formData, paymentDueDate: d })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Payment Status */}
              <div>
                <Label htmlFor="paymentStatus">Payment Status *</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(v) =>
                    setFormData({ ...formData, paymentStatus: v })
                  }
                >
                  <SelectTrigger id="paymentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">pending</SelectItem>
                    <SelectItem value="pending">complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Paid & Pending */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalPaid">Total Paid</Label>
                  <Input
                    id="totalPaid"
                    type="number"
                    step="0.01"
                    value={formData.totalPaid}
                    onChange={(e) => setFormData({ ...formData, totalPaid: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Pending Amount</Label>
                  <Input
                    value={formData.pendingAmount}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div>
                <Label htmlFor="paymentAttachment">Payment Proof</Label>
                <div>
                  <input
                    id="paymentAttachment"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentAttachment: e.target.files?.[0] || null,
                      })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="paymentAttachment"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.paymentAttachment
                        ? formData.paymentAttachment.name
                        : "Upload file"}
                    </span>
                  </label>
                  {formData.paymentAttachment && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm">
                        {formData.paymentAttachment.name} (
                        {(formData.paymentAttachment.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}