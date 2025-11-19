"use client";

import type React from "react";
import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const QC_ENGINEERS = [
  "Rajesh Kumar",
  "Amit Sharma",
  "Priya Singh",
  "Vikram Patel",
  "Neha Gupta",
  "Suresh Yadav",
  "Anjali Verma",
  "Karan Mehta",
];

export default function Stage8() {
  const { records = [], moveToNextStage, updateRecord } = useWorkflow() || {};

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    qcBy: "",
    qcDate: "",
    qcStatus: "",
    rejectRemarks: "",
    rejectQty: "",
    returnStatus: "",
    qcRemarks: "",
    rejectPhoto: null as File | null,
  });

  // Safe filtering
  const pending = (records || []).filter(
    (r: any) => r?.stage === 8 && r?.status === "pending"
  );
  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history)
      ? r.history.some((h: any) => h?.stage === 8)
      : false
  );

  // Pending columns (without QC result fields)
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
  ];

  // History columns (includes QC result fields)
  const historyColumns = [
    ...pendingColumns,
    { key: "qcBy", label: "QC Done By" },
    { key: "qcDate", label: "QC Date" },
    { key: "qcStatus", label: "QC Status" },
    { key: "rejectQty", label: "Reject Qty" },
    { key: "rejectRemarks", label: "Reject Remarks" },
    { key: "returnStatus", label: "Return Status" },
    { key: "qcRemarks", label: "QC Remarks" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<
    string[]
  >(pendingColumns.map((col) => col.key));

  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<
    string[]
  >(historyColumns.map((col) => col.key));

  const handleOpenForm = (recordId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedRecord(recordId);
    setFormData({
      qcBy: "",
      qcDate: today,
      qcStatus: "",
      rejectRemarks: "",
      rejectQty: "",
      returnStatus: "",
      qcRemarks: "",
      rejectPhoto: null,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !updateRecord || !moveToNextStage) return;

    const qcData = {
      qcBy: formData.qcBy,
      qcDate: formData.qcDate,
      qcStatus: formData.qcStatus,
      rejectQty: formData.qcStatus === "rejected" ? formData.rejectQty : "",
      rejectRemarks:
        formData.qcStatus === "rejected" ? formData.rejectRemarks : "",
      returnStatus: formData.returnStatus,
      qcRemarks: formData.qcRemarks,
      rejectPhoto: formData.rejectPhoto,
    };

    updateRecord(selectedRecord, qcData);
    moveToNextStage(selectedRecord);

    setOpen(false);
    setSelectedRecord(null);
    setFormData({
      qcBy: "",
      qcDate: "",
      qcStatus: "",
      rejectRemarks: "",
      rejectQty: "",
      returnStatus: "",
      qcRemarks: "",
      rejectPhoto: null,
    });
  };

  const isFormValid =
    formData.qcBy &&
    formData.qcDate &&
    formData.qcStatus &&
    formData.returnStatus &&
    (formData.qcStatus === "approved" ||
      (formData.qcStatus === "rejected" &&
        formData.rejectQty &&
        formData.rejectRemarks));

  // Get vendor data
  const getVendorData = (record: any) => {
    const selectedId = record?.data?.selectedVendor || "vendor1";
    const idx = parseInt(selectedId.replace("vendor", ""), 10) || 1;
    return {
      name:
        record?.data?.[`vendor${idx}Name`] || record?.data?.vendorName || "-",
      rate:
        record?.data?.[`vendor${idx}Rate`] || record?.data?.ratePerQty || "-",
      terms:
        record?.data?.[`vendor${idx}Terms`] ||
        record?.data?.paymentTerms ||
        "-",
      delivery:
        record?.data?.[`vendor${idx}DeliveryDate`] ||
        record?.data?.deliveryDate,
      warrantyType:
        record?.data?.[`vendor${idx}WarrantyType`] ||
        record?.data?.warrantyType ||
        "-",
      attachment:
        record?.data?.[`vendor${idx}Attachment`] ||
        record?.data?.vendorAttachment,
    };
  };

  // Safe data access with lifting data support
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 8)?.data ||
          record?.data
        : record?.data;

      // Get lifting data
      const lift = ((data?.liftingData as any[]) ?? [])[0] ?? {};
      const vendor = getVendorData({ data });

      // Handle lifting data fields
      if (key === "liftNumber") return lift.liftNumber || "-";
      if (key === "liftQty") return lift.liftingQty || "-";
      if (key === "transporter") return lift.transporterName || "-";
      if (key === "lrNumber") return lift.lrNumber || "-";
      if (key === "freight")
        return lift.freightAmount ? `₹${lift.freightAmount}` : "-";
      if (key === "advanceAmount")
        return lift.advanceAmount ? `₹${lift.advanceAmount}` : "-";
      if (key === "paymentDate")
        return lift.paymentDate
          ? new Date(lift.paymentDate).toLocaleDateString("en-IN")
          : "-";
      if (key === "biltyNumber") return lift.biltyCopy?.name || "-";

      // Handle vendor data fields
      if (key === "vendor") return vendor.name;
      if (key === "ratePerQty") return vendor.rate ? `₹${vendor.rate}` : "-";
      if (key === "paymentTerms") return vendor.terms;
      if (key === "warranty") return vendor.warrantyType;
      if (key === "attachment") return vendor.attachment?.name || "-";

      // Handle warehouse
      if (key === "warehouse")
        return data?.warehouseLocation || data?.warehouse || "-";

      // Handle Stage 7 payment amounts
      if (key === "hydraAmount")
        return data?.paymentAmountHydra ? `₹${data.paymentAmountHydra}` : "-";
      if (key === "labourAmount")
        return data?.paymentAmountLabour ? `₹${data.paymentAmountLabour}` : "-";
      if (key === "hemaliAmount")
        return data?.paymentAmountHemali ? `₹${data.paymentAmountHemali}` : "-";

      // Handle QC Required
      if (key === "qcRequired") return data?.qcRequirement || "-";

      // Handle regular fields
      const val = data?.[key];
      if (val !== undefined && val !== null) {
        return key.includes("Date") && val
          ? new Date(val).toLocaleDateString("en-IN")
          : String(val);
      }
      return "-";
    } catch (err) {
      console.error("Error reading field:", key, err);
      return "-";
    }
  };

  if (!records) {
    return (
      <div className="p-6 text-center text-red-600">
        Workflow context not loaded.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 8: Quality Control</h2>
            <p className="text-gray-600 mt-1">
              Inspect and approve/reject received materials
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
              <SelectContent className="w-64 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={
                        activeTab === "pending"
                          ? selectedPendingColumns.length ===
                            pendingColumns.length
                          : selectedHistoryColumns.length ===
                            historyColumns.length
                      }
                      onCheckedChange={(checked) => {
                        if (activeTab === "pending") {
                          setSelectedPendingColumns(
                            checked ? pendingColumns.map((c) => c.key) : []
                          );
                        } else {
                          setSelectedHistoryColumns(
                            checked ? historyColumns.map((c) => c.key) : []
                          );
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All</Label>
                  </div>
                  {(activeTab === "pending"
                    ? pendingColumns
                    : historyColumns
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
                            setSelectedPendingColumns(
                              checked
                                ? [...selectedPendingColumns, col.key]
                                : selectedPendingColumns.filter(
                                    (c) => c !== col.key
                                  )
                            );
                          } else {
                            setSelectedHistoryColumns(
                              checked
                                ? [...selectedHistoryColumns, col.key]
                                : selectedHistoryColumns.filter(
                                    (c) => c !== col.key
                                  )
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">
            History ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending QC checks</p>
              <p className="text-sm mt-1">All items are inspected!</p>
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
                  {pending.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {record.id || "-"}
                      </TableCell>
                      {pendingColumns
                        .filter((c) => selectedPendingColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(record, col.key)}
                          </TableCell>
                        ))}
                      <TableCell className="sticky right-0 bg-white z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(record.id)}
                        >
                          Perform QC
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No QC history</p>
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
                  {completed.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {record.id || "-"}
                      </TableCell>
                      {historyColumns
                        .filter((c) => selectedHistoryColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(record, col.key, true)}
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

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Quality Control Inspection</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>QC Done By *</Label>
                  <Select
                    value={formData.qcBy}
                    onValueChange={(v) => setFormData({ ...formData, qcBy: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {QC_ENGINEERS.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>QC Date *</Label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.qcDate}
                    onChange={(e) =>
                      setFormData({ ...formData, qcDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>QC Status *</Label>
                  <Select
                    value={formData.qcStatus}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        qcStatus: v,
                        rejectQty: v === "approved" ? "" : formData.rejectQty,
                        rejectRemarks:
                          v === "approved" ? "" : formData.rejectRemarks,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Return Status *</Label>
                  <Select
                    value={formData.returnStatus}
                    onValueChange={(v) =>
                      setFormData({ ...formData, returnStatus: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="not return">Not Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.qcStatus === "rejected" && (
                <div className="p-4 border rounded bg-red-50 space-y-3">
                  <h3 className="font-semibold text-red-800">
                    Rejection Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Reject Qty *</Label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="0"
                        value={formData.rejectQty}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rejectQty: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Reject Photo</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, rejectPhoto: file });
                          }
                        }}
                        className="hidden"
                        id="reject-photo"
                      />
                      <label
                        htmlFor="reject-photo"
                        className="flex items-center justify-center w-full p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        {formData.rejectPhoto ? (
                          <span className="text-green-600">
                            {" "}
                            Photo Selected
                          </span>
                        ) : (
                          <span> Upload Photo</span>
                        )}
                      </label>
                    </div>
                    <div className="col-span-2">
                      <Label>Reject Remarks *</Label>
                      <textarea
                        className="w-full px-3 py-2 border rounded resize-none"
                        rows={3}
                        value={formData.rejectRemarks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rejectRemarks: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>QC Remarks</Label>
                <textarea
                  className="w-full px-3 py-2 border rounded resize-none"
                  rows={3}
                  value={formData.qcRemarks}
                  onChange={(e) =>
                    setFormData({ ...formData, qcRemarks: e.target.value })
                  }
                />
              </div>
            </form>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Complete QC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
