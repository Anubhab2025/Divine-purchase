"use client";

import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, X } from "lucide-react";

interface LiftingEntry {
  liftNumber: string;
  liftingQty: string;
  transporterName: string;
  vehicleNumber: string;
  contactNumber: string;
  lrNumber: string;
  biltyCopy: File | null;
  dispatchDate: string;
  freightAmount: string;
  advanceAmount: string;
  paymentDate: string;
}

/* --------------------------------------------------------------- */
/*  COLUMNS FOR PENDING TAB (HIDE Stage-7 fields)                  */
/* --------------------------------------------------------------- */
const PENDING_COLUMNS = [
  { key: "indentNumber", label: "Indent #" },
  { key: "createdBy", label: "Created By" },
  { key: "category", label: "Category" },
  { key: "itemName", label: "Item" },
  { key: "quantity", label: "Qty" },
  { key: "warehouse", label: "Warehouse" },
  { key: "vendorName", label: "Vendor" },
  { key: "ratePerQty", label: "Rate/Qty" },
  { key: "paymentTerms", label: "Payment Terms" },
  { key: "deliveryDate", label: "Exp. Delivery" },
  { key: "warrantyType", label: "Warranty" },
  { key: "vendorAttachment", label: "Attachment" },
  { key: "approvedBy", label: "Approved By" },
  { key: "poNumber", label: "PO Number" },
  { key: "basicValue", label: "Basic Value" },
  { key: "totalWithTax", label: "Total w/Tax" },
  { key: "poCopy", label: "PO Copy" },
  { key: "liftNumber", label: "Lift #" },
  { key: "liftingQty", label: "Lift Qty" },
  { key: "transporterName", label: "Transporter" },
  { key: "lrNumber", label: "LR #" },
  { key: "freightAmount", label: "Freight" },
  { key: "advanceAmount", label: "Adv. Amt" },
  { key: "paymentDate", label: "Pay Date" },
  { key: "biltyCopy", label: "Bilty #" },
] as const;

/* --------------------------------------------------------------- */
/*  COLUMNS FOR HISTORY TAB (SHOW ALL)                             */
/* --------------------------------------------------------------- */
const HISTORY_COLUMNS = [
  ...PENDING_COLUMNS,
  { key: "invoiceNumber", label: "Invoice #" },
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "srnNumber", label: "SRN #" },
  { key: "qcRequirement", label: "QC Required" },
  { key: "receivedItemImage", label: "Rec. Item Img" },
  { key: "paymentAmountHydra", label: "Hydra Amt" },
  { key: "paymentAmountLabour", label: "Labour Amt" },
  { key: "paymentAmountHemali", label: "Hemali Amt" },
  { key: "remarks", label: "Remarks" },
] as const;

export default function Stage7() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();

  const [open, setOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [selectedPendingColumns, setSelectedPendingColumns] = useState<
    string[]
  >(PENDING_COLUMNS.map((c) => c.key));
  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<
    string[]
  >(HISTORY_COLUMNS.map((c) => c.key));

  const [invoiceType, setInvoiceType] = useState<"independent" | "common">(
    "independent"
  );
  const [form, setForm] = useState({
    liftNumber: "",
    receivedQty: "",
    invoiceNumber: "",
    invoiceDate: "",
    srnNumber: "",
    billAttachment: null as File | null,
    receivedItemImage: null as File | null,
    paymentAmountHydra: "",
    paymentAmountLabour: "",
    paymentAmountHemali: "",
    qcRequirement: "",
    remarks: "",
  });

  const pending = records.filter(
    (r) => r.stage === 7 && r.status === "pending"
  );
  const completed = records.filter((r) => r.history.some((h) => h.stage === 7));

  /* --------------------------------------------------------------- */
  /*  Get Vendor Data from Stage-6                                   */
  /* --------------------------------------------------------------- */
  const getVendorData = (record: any) => {
    const selectedId = record.data.selectedVendor || "vendor1";
    const idx = parseInt(selectedId.replace("vendor", ""), 10) || 1;
    return {
      name: record.data[`vendor${idx}Name`] || record.data.vendorName || "-",
      rate: record.data[`vendor${idx}Rate`] || record.data.ratePerQty,
      terms: record.data[`vendor${idx}Terms`] || record.data.paymentTerms,
      delivery:
        record.data[`vendor${idx}DeliveryDate`] || record.data.deliveryDate,
      warrantyType:
        record.data[`vendor${idx}WarrantyType`] || record.data.warrantyType,
      attachment:
        record.data[`vendor${idx}Attachment`] || record.data.vendorAttachment,
      approvedBy: record.data.approvedBy || "-",
      poNumber: record.data.poNumber || "-",
      basicValue: record.data.basicValue || "-",
      totalWithTax: record.data.totalWithTax || "-",
      poCopy: record.data.poCopy,
    };
  };

  /* --------------------------------------------------------------- */
  /*  Open Modal                                                     */
  /* --------------------------------------------------------------- */
  const openModal = (recordId: string) => {
    const rec = records.find((r) => r.id === recordId)!;
    const lift = ((rec.data.liftingData as LiftingEntry[]) ?? [])[0] ?? {};

    setSelectedRecordId(recordId);
    setInvoiceType("independent");
    setForm({
      liftNumber: lift.liftNumber ?? "",
      receivedQty: "",
      invoiceNumber: "",
      invoiceDate: "",
      srnNumber: "",
      billAttachment: null,
      receivedItemImage: null,
      paymentAmountHydra: "",
      paymentAmountLabour: "",
      paymentAmountHemali: "",
      qcRequirement: "",
      remarks: "",
    });
    setOpen(true);
  };

  /* --------------------------------------------------------------- */
  /*  Submit                                                         */
  /* --------------------------------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId) return;

    const rec = records.find((r) => r.id === selectedRecordId)!;
    const vendor = getVendorData(rec);

    const updated = {
      ...rec.data,
      invoiceType,
      liftNumber: invoiceType === "independent" ? form.liftNumber : "",
      receivedQty: form.receivedQty,
      invoiceNumber: form.invoiceNumber,
      invoiceDate: form.invoiceDate,
      srnNumber: form.srnNumber,
      billAttachment: form.billAttachment,
      receivedItemImage: form.receivedItemImage,
      paymentAmountHydra: form.paymentAmountHydra,
      paymentAmountLabour: form.paymentAmountLabour,
      paymentAmountHemali: form.paymentAmountHemali,
      qcRequirement: form.qcRequirement,
      remarks: form.remarks,

      // Ensure vendor data is preserved
      vendorName: vendor.name,
      ratePerQty: vendor.rate,
      paymentTerms: vendor.terms,
      deliveryDate: vendor.delivery,
      warrantyType: vendor.warrantyType,
      vendorAttachment: vendor.attachment,
      approvedBy: vendor.approvedBy,
      poNumber: vendor.poNumber,
      basicValue: vendor.basicValue,
      totalWithTax: vendor.totalWithTax,
      poCopy: vendor.poCopy,
    };

    updateRecord(selectedRecordId, updated);
    moveToNextStage(selectedRecordId);
    setOpen(false);
    setSelectedRecordId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      liftNumber: "",
      receivedQty: "",
      invoiceNumber: "",
      invoiceDate: "",
      srnNumber: "",
      billAttachment: null,
      receivedItemImage: null,
      paymentAmountHydra: "",
      paymentAmountLabour: "",
      paymentAmountHemali: "",
      qcRequirement: "",
      remarks: "",
    });
  };

  const removeFile = (key: "billAttachment" | "receivedItemImage") => {
    setForm((f) => ({ ...f, [key]: null }));
  };

  const commonValid =
    form.invoiceNumber && form.srnNumber && form.qcRequirement;
  const independentValid =
    form.receivedQty &&
    form.invoiceNumber &&
    form.invoiceDate &&
    form.srnNumber &&
    form.qcRequirement;
  const formValid = invoiceType === "common" ? commonValid : independentValid;

  return (
    <div className="p-6">
      {/* ==================== HEADER ==================== */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 7: Material Receipt</h2>
            <p className="text-gray-600 mt-1">
              Record received goods, invoice, QC & payment details
            </p>
          </div>

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
              <SelectContent className="w-64">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={
                        activeTab === "pending"
                          ? selectedPendingColumns.length ===
                            PENDING_COLUMNS.length
                          : selectedHistoryColumns.length ===
                            HISTORY_COLUMNS.length
                      }
                      onCheckedChange={(c) => {
                        if (activeTab === "pending") {
                          setSelectedPendingColumns(
                            c ? PENDING_COLUMNS.map((col) => col.key) : []
                          );
                        } else {
                          setSelectedHistoryColumns(
                            c ? HISTORY_COLUMNS.map((col) => col.key) : []
                          );
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All Columns</Label>
                  </div>
                  {(activeTab === "pending"
                    ? PENDING_COLUMNS
                    : HISTORY_COLUMNS
                  ).map((col) => (
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
                        onCheckedChange={(checked) => {
                          if (activeTab === "pending") {
                            setSelectedPendingColumns((prev) =>
                              checked
                                ? [...prev, col.key]
                                : prev.filter((c) => c !== col.key)
                            );
                          } else {
                            setSelectedHistoryColumns((prev) =>
                              checked
                                ? [...prev, col.key]
                                : prev.filter((c) => c !== col.key)
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

      {/* ==================== TABS ==================== */}
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

        {/* ---------- PENDING ---------- */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending receipts</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    {PENDING_COLUMNS.filter((c) =>
                      selectedPendingColumns.includes(c.key)
                    ).map((c) => (
                      <TableHead key={c.key}>{c.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((rec) => {
                    const lift =
                      ((rec.data.liftingData as LiftingEntry[]) ?? [])[0] ?? {};
                    const vendor = getVendorData(rec);

                    return (
                      <TableRow key={rec.id}>
                        <TableCell className="font-mono text-xs">
                          {rec.id}
                        </TableCell>

                        {PENDING_COLUMNS.filter((c) =>
                          selectedPendingColumns.includes(c.key)
                        ).map((col) => {
                          if (col.key === "deliveryDate")
                            return (
                              <TableCell key={col.key}>
                                {rec.data[col.key]
                                  ? new Date(
                                      rec.data[col.key] as string
                                    ).toLocaleDateString("en-IN")
                                  : "-"}
                              </TableCell>
                            );

                          if (col.key === "biltyCopy")
                            return (
                              <TableCell key={col.key}>
                                {lift.biltyCopy ? (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-20">
                                      {lift.biltyCopy.name}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            );

                          const liftValue =
                            col.key === "liftNumber"
                              ? lift.liftNumber
                              : col.key === "liftingQty"
                              ? lift.liftingQty
                              : col.key === "transporterName"
                              ? lift.transporterName
                              : col.key === "lrNumber"
                              ? lift.lrNumber
                              : col.key === "freightAmount"
                              ? lift.freightAmount
                              : col.key === "advanceAmount"
                              ? lift.advanceAmount
                              : col.key === "paymentDate"
                              ? lift.paymentDate
                              : undefined;

                          const value =
                            liftValue ??
                            (col.key === "vendorName"
                              ? vendor.name
                              : col.key === "ratePerQty"
                              ? vendor.rate
                              : col.key === "paymentTerms"
                              ? vendor.terms
                              : col.key === "warrantyType"
                              ? vendor.warrantyType
                              : col.key === "vendorAttachment"
                              ? vendor.attachment
                              : rec.data[col.key]);

                          return (
                            <TableCell key={col.key}>
                              {String(value ?? "-")}
                            </TableCell>
                          );
                        })}

                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(rec.id)}
                          >
                            Record Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ---------- HISTORY ---------- */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No completed receipts</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100 sticky top-0">
                  <TableRow className="border-b-2">
                    {HISTORY_COLUMNS.filter((c) =>
                      selectedHistoryColumns.includes(c.key)
                    ).map((c) => (
                      <TableHead key={c.key} className="font-semibold">
                        {c.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((record) => {
                    // Get data from stage 7 history entry
                    const stage7History = record.history.find(
                      (h) => h.stage === 7
                    );
                    const historyData = stage7History
                      ? stage7History.data
                      : record.data;
                    const lift =
                      ((historyData.liftingData as LiftingEntry[]) ?? [])[0] ??
                      {};
                    const vendor = getVendorData({
                      ...record,
                      data: historyData,
                    });

                    return (
                      <TableRow key={record.id} className="bg-green-50">
                        {HISTORY_COLUMNS.filter((c) =>
                          selectedHistoryColumns.includes(c.key)
                        ).map((col) => {
                          // Handle date fields
                          if (
                            col.key === "deliveryDate" ||
                            col.key === "invoiceDate"
                          ) {
                            return (
                              <TableCell key={col.key}>
                                {historyData[col.key]
                                  ? new Date(
                                      historyData[col.key] as string
                                    ).toLocaleDateString("en-IN")
                                  : "-"}
                              </TableCell>
                            );
                          }

                          // Handle file fields
                          if (col.key === "biltyCopy") {
                            return (
                              <TableCell key={col.key}>
                                {lift.biltyCopy ? (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-20">
                                      {lift.biltyCopy.name}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            );
                          }

                          if (
                            col.key === "receivedItemImage" ||
                            col.key === "poCopy" ||
                            col.key === "vendorAttachment"
                          ) {
                            const file = historyData[col.key];
                            return (
                              <TableCell key={col.key}>
                                {file ? (
                                  <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-20">
                                      {file.name}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            );
                          }

                          // Handle lifting data fields
                          const liftValue =
                            col.key === "liftNumber"
                              ? lift.liftNumber
                              : col.key === "liftingQty"
                              ? lift.liftingQty
                              : col.key === "transporterName"
                              ? lift.transporterName
                              : col.key === "lrNumber"
                              ? lift.lrNumber
                              : col.key === "freightAmount"
                              ? `₹${lift.freightAmount || "-"}`
                              : col.key === "advanceAmount"
                              ? `₹${lift.advanceAmount || "-"}`
                              : col.key === "paymentDate"
                              ? lift.paymentDate
                                ? new Date(lift.paymentDate).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "-"
                              : undefined;

                          if (liftValue !== undefined) {
                            return (
                              <TableCell key={col.key}>{liftValue}</TableCell>
                            );
                          }

                          // Handle vendor data fields
                          const vendorValue =
                            col.key === "vendorName"
                              ? vendor.name
                              : col.key === "ratePerQty"
                              ? `₹${vendor.rate || "-"}`
                              : col.key === "paymentTerms"
                              ? vendor.terms
                              : col.key === "warrantyType"
                              ? vendor.warrantyType
                              : col.key === "approvedBy"
                              ? vendor.approvedBy
                              : col.key === "poNumber"
                              ? vendor.poNumber
                              : col.key === "basicValue"
                              ? `₹${vendor.basicValue}`
                              : col.key === "totalWithTax"
                              ? `₹${vendor.totalWithTax}`
                              : undefined;

                          if (vendorValue !== undefined) {
                            return (
                              <TableCell key={col.key}>{vendorValue}</TableCell>
                            );
                          }

                          // Handle payment amounts
                          if (
                            col.key === "paymentAmountHydra" ||
                            col.key === "paymentAmountLabour" ||
                            col.key === "paymentAmountHemali"
                          ) {
                            return (
                              <TableCell key={col.key}>
                                {historyData[col.key]
                                  ? `₹${historyData[col.key]}`
                                  : "-"}
                              </TableCell>
                            );
                          }

                          // Default: show from historyData
                          return (
                            <TableCell key={col.key}>
                              {String(historyData[col.key] ?? "-")}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ==================== MODAL ==================== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Record Material Receipt</DialogTitle>
            <p className="text-sm text-gray-600">
              Confirm delivery, attach documents, and update QC/payment.
            </p>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto space-y-6 pr-2"
          >
            {/* Invoice Type */}
            <div className="space-y-2">
              <Label>
                Invoice Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={invoiceType}
                onValueChange={(v) => {
                  const type = v as "independent" | "common";
                  setInvoiceType(type);
                  if (type === "common") {
                    setForm((f) => ({ ...f, liftNumber: "", receivedQty: "" }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {invoiceType === "independent" && (
                <>
                  <div className="space-y-2">
                    <Label>Lift #</Label>
                    <Input
                      value={form.liftNumber}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Received Qty <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={form.receivedQty}
                      onChange={(e) =>
                        setForm({ ...form, receivedQty: e.target.value })
                      }
                      required
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Invoice Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={form.invoiceDate}
                      onChange={(e) =>
                        setForm({ ...form, invoiceDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>
                  Invoice # <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.invoiceNumber}
                  onChange={(e) =>
                    setForm({ ...form, invoiceNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  SRN # <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.srnNumber}
                  onChange={(e) =>
                    setForm({ ...form, srnNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  QC Required <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.qcRequirement}
                  onValueChange={(v) => setForm({ ...form, qcRequirement: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Received Item Image */}
            <div className="space-y-2">
              <Label>Received Item Image</Label>
              <input
                id="receivedItemImage"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) =>
                  setForm({
                    ...form,
                    receivedItemImage: e.target.files?.[0] ?? null,
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
              {form.receivedItemImage && (
                <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      {form.receivedItemImage.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("receivedItemImage")}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bill Attachment (only independent) */}
            {invoiceType === "independent" && (
              <div className="space-y-2">
                <Label>Bill Attachment</Label>
                <input
                  id="billAttachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      billAttachment: e.target.files?.[0] ?? null,
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
                {form.billAttachment && (
                  <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {form.billAttachment.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("billAttachment")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Heads - Only show for independent invoices */}
            {invoiceType === "independent" && (
              <div className="space-y-4">
                <h3 className="font-medium">Others Payment Head</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Hydra Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.paymentAmountHydra}
                      onChange={(e) =>
                        setForm({ ...form, paymentAmountHydra: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Labour Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.paymentAmountLabour}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          paymentAmountLabour: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hemali Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.paymentAmountHemali}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          paymentAmountHemali: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="space-y-2">
              <Label>Remarks</Label>
              <textarea
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded resize-none"
                rows={3}
              />
            </div>
          </form>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formValid}>
              Record Receipt & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
