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

const CHECKERS = [
  "Amit Shah",
  "Neha Jain",
  "Suresh Patel",
  "Kavita Rao",
  "Rohit Verma",
];

export default function Stage11() {
  const { records = [], updateRecord, moveToNextStage } = useWorkflow() || {};

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [formData, setFormData] = useState({
    receivedBy: "",
    checkedBy: "",
    verificationDate: new Date(),
    invoiceNumber: "",
    invoiceDate: "",
    remarks: "",
  });

  // -----------------------------------------------------------------
  // FILTER RECORDS
  // -----------------------------------------------------------------
  const pending = (records || []).filter(
    (r: any) => r?.stage === 11 && r?.status === "pending"
  );
  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history) ? r.history.some((h: any) => h?.stage === 11) : false
  );

  // -----------------------------------------------------------------
  // Pending columns (without verification result fields)
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
    { key: "attachment", label: "Attachment" },
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
  ];

  // History columns (includes verification result fields)
  // -----------------------------------------------------------------
  const historyColumns = [
    ...pendingColumns,
    { key: "verifiedReceivedBy", label: "Verified – Received By" },
    { key: "verifiedCheckedBy", label: "Verified – Checked By" },
    { key: "verificationDate", label: "Verification Date" },
    { key: "verificationRemarks", label: "Verification Remarks" },
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

    const invoiceNumber = rec.data?.invoiceNumber || "-";
    const invoiceDate = rec.data?.invoiceDate || "";

    setSelectedRecord(recordId);
    setFormData({
      receivedBy: "",
      checkedBy: "",
      verificationDate: new Date(),
      invoiceNumber,
      invoiceDate,
      remarks: "",
    });
    setOpen(true);
  };

  // -----------------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const payload = {
      verifiedReceivedBy: formData.receivedBy,
      verifiedCheckedBy: formData.checkedBy,
      verificationDate: formData.verificationDate.toISOString().split("T")[0],
      verificationRemarks: formData.remarks,
    };

    updateRecord(selectedRecord, payload);
    moveToNextStage(selectedRecord);

    // reset
    setOpen(false);
    setSelectedRecord(null);
    setFormData({
      receivedBy: "",
      checkedBy: "",
      verificationDate: new Date(),
      invoiceNumber: "",
      invoiceDate: "",
      remarks: "",
    });
  };

  const isFormValid =
    formData.receivedBy && formData.checkedBy && formData.verificationDate;

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

  // SAFE VALUE (prevents crashes)
  // -----------------------------------------------------------------
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 11)?.data || record?.data
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
      if (key === "attachment") return vendor.attachment?.name || "-";

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
            <h2 className="text-2xl font-bold">
              Stage 11: Verification by Accounts
            </h2>
            <p className="text-gray-600 mt-1">
              Verify invoice details and complete financial check
            </p>
          </div>

          {/* Column selector */}
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={
                    activeTab === "pending"
                      ? `${selectedPendingColumns.length} selected`
                      : `${selectedHistoryColumns.length} selected`
                  }
                />
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
                    <div
                      key={col.key}
                      className="flex items-center space-x-2 py-1"
                    >
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
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* ───── PENDING ───── */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending verifications</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">
                      ID
                    </TableHead>
                    {pendingColumns
                      .filter((c) => selectedPendingColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    <TableHead className="sticky right-0 bg-white z-10">
                      Actions
                    </TableHead>
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
                          Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ───── HISTORY ───── */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No verified invoices yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">
                      ID
                    </TableHead>
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

      {/* ────────────────────── MODAL (DATE PICKER) ────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Verification by Accounts</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Summary */}
              <div className="p-4 bg-gray-50 border rounded-lg">
                <h3 className="font-medium mb-3">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Invoice Number</Label>
                    <p className="font-mono text-lg">{formData.invoiceNumber}</p>
                  </div>
                  <div>
                    <Label>Invoice Date</Label>
                    <p className="text-lg">
                      {formData.invoiceDate
                        ? new Date(formData.invoiceDate).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Received By */}
                <div>
                  <Label htmlFor="receivedBy">
                    Received By <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="receivedBy"
                    value={formData.receivedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, receivedBy: e.target.value })
                    }
                    required
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Checked By */}
                <div>
                  <Label htmlFor="checkedBy">
                    Checked By <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.checkedBy}
                    onValueChange={(v) =>
                      setFormData({ ...formData, checkedBy: v })
                    }
                  >
                    <SelectTrigger id="checkedBy">
                      <SelectValue placeholder="Select checker" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHECKERS.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Verification Date – Calendar */}
              <div>
                <Label htmlFor="verificationDate">
                  Verification Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="verificationDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {formData.verificationDate
                        ? format(formData.verificationDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.verificationDate}
                      onSelect={(d) =>
                        d && setFormData({ ...formData, verificationDate: d })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Remarks */}
              <div>
                <Label htmlFor="remarks">Verification Remarks</Label>
                <textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  placeholder="Any notes…"
                  rows={3}
                  className="w-full px-3 py-2 border rounded resize-none"
                />
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Verify Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}